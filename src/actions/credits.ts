"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getCredits(): Promise<{
  credits: number;
  freeGranted: boolean;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { credits: 0, freeGranted: false };

  const admin = createAdminClient();

  // Try to fetch existing row
  const { data } = await admin
    .from("user_credits")
    .select("credits, free_credit_granted")
    .eq("user_id", user.id)
    .single();

  if (data) {
    return { credits: data.credits, freeGranted: data.free_credit_granted };
  }

  // First time — create row and grant 1 free credit
  await admin.from("user_credits").insert({
    user_id: user.id,
    credits: 1,
    free_credit_granted: true,
  });

  await admin.from("credit_transactions").insert({
    user_id: user.id,
    amount: 1,
    type: "free_grant",
    description: "Welcome credit",
  });

  return { credits: 1, freeGranted: true };
}

export async function deductCredit(): Promise<{
  success: boolean;
  remaining: number;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, remaining: 0, error: "Not authenticated" };

  const admin = createAdminClient();

  // Ensure row exists (auto-grants free credit if first time)
  const { data: existing } = await admin
    .from("user_credits")
    .select("credits, free_credit_granted")
    .eq("user_id", user.id)
    .single();

  if (!existing) {
    // First time — create row with free credit, then deduct
    await admin.from("user_credits").insert({
      user_id: user.id,
      credits: 1,
      free_credit_granted: true,
    });
    await admin.from("credit_transactions").insert({
      user_id: user.id,
      amount: 1,
      type: "free_grant",
      description: "Welcome credit",
    });
  }

  // Atomic deduction
  const { data: newBalance } = await admin.rpc("deduct_credit", {
    p_user_id: user.id,
  });

  if (newBalance === -1) {
    return { success: false, remaining: 0, error: "NO_CREDITS" };
  }

  // Log the deduction
  await admin.from("credit_transactions").insert({
    user_id: user.id,
    amount: -1,
    type: "generation",
    description: "Website generation",
  });

  return { success: true, remaining: newBalance };
}
