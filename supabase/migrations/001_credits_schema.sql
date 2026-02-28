-- ============================================================
-- Credit system tables + atomic functions
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. user_credits — one row per user, tracks current balance
create table if not exists public.user_credits (
  user_id uuid primary key references auth.users(id) on delete cascade,
  credits int not null default 0 check (credits >= 0),
  free_credit_granted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_credits enable row level security;

create policy "Users can read own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

-- 2. credit_transactions — append-only audit log
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount int not null,
  type text not null check (type in ('free_grant', 'purchase', 'generation')),
  stripe_session_id text,
  description text,
  created_at timestamptz not null default now()
);

alter table public.credit_transactions enable row level security;

create policy "Users can read own transactions"
  on public.credit_transactions for select
  using (auth.uid() = user_id);

-- Index for webhook idempotency check
create unique index if not exists idx_credit_transactions_stripe_session
  on public.credit_transactions(stripe_session_id)
  where stripe_session_id is not null;

-- 3. stripe_customers — maps Supabase users to Stripe customer IDs
create table if not exists public.stripe_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now()
);

-- No RLS needed — only accessed via service role

-- ============================================================
-- Atomic credit operations (called via supabase.rpc())
-- ============================================================

-- Deduct 1 credit atomically. Returns new balance, or -1 if insufficient.
create or replace function public.deduct_credit(p_user_id uuid)
returns int
language plpgsql
security definer
as $$
declare
  new_balance int;
begin
  update public.user_credits
    set credits = credits - 1, updated_at = now()
    where user_id = p_user_id and credits > 0
    returning credits into new_balance;

  if not found then
    return -1;
  end if;

  return new_balance;
end;
$$;

-- Add credits atomically. Returns new balance.
create or replace function public.add_credits(p_user_id uuid, p_amount int)
returns int
language plpgsql
security definer
as $$
declare
  new_balance int;
begin
  update public.user_credits
    set credits = credits + p_amount, updated_at = now()
    where user_id = p_user_id
    returning credits into new_balance;

  if not found then
    -- Auto-create row if it doesn't exist
    insert into public.user_credits (user_id, credits)
      values (p_user_id, p_amount)
      returning credits into new_balance;
  end if;

  return new_balance;
end;
$$;
