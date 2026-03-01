-- ============================================================
-- Sharing schema: share links + collaborators
-- ============================================================

-- 1. project_share_links — one per project, short URL-safe token
CREATE TABLE public.project_share_links (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL UNIQUE REFERENCES public.projects(id) ON DELETE CASCADE,
  token       text NOT NULL UNIQUE,
  is_active   boolean NOT NULL DEFAULT true,
  password_hash text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_share_links_token ON public.project_share_links(token);

ALTER TABLE public.project_share_links ENABLE ROW LEVEL SECURITY;

-- Owners can manage their share links
CREATE POLICY "Owners manage share links"
  ON public.project_share_links
  FOR ALL
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Anyone can look up active share links by token (for public share view)
CREATE POLICY "Anyone can read active share links by token"
  ON public.project_share_links
  FOR SELECT
  USING (is_active = true);


-- 2. project_collaborators — email-based invites
CREATE TABLE public.project_collaborators (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  invited_by   uuid NOT NULL REFERENCES auth.users(id),
  email        text NOT NULL,
  user_id      uuid REFERENCES auth.users(id),
  role         text NOT NULL CHECK (role IN ('viewer', 'editor')) DEFAULT 'viewer',
  status       text NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')) DEFAULT 'pending',
  invite_token text UNIQUE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, email)
);

CREATE INDEX idx_collaborators_email ON public.project_collaborators(email);
CREATE INDEX idx_collaborators_user_id ON public.project_collaborators(user_id);
CREATE INDEX idx_collaborators_invite_token ON public.project_collaborators(invite_token);

ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- Owners can manage all collaborators on their projects
CREATE POLICY "Owners manage collaborators"
  ON public.project_collaborators
  FOR ALL
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Users can see and update invites addressed to them (by email or user_id)
CREATE POLICY "Users see their own invites"
  ON public.project_collaborators
  FOR SELECT
  USING (
    user_id = auth.uid()
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Users update their own invites"
  ON public.project_collaborators
  FOR UPDATE
  USING (
    user_id = auth.uid()
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  WITH CHECK (
    user_id = auth.uid()
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );


-- 3. Additive RLS on projects table for collaborators
-- Accepted collaborators can read projects shared with them
CREATE POLICY "Collaborators can read shared projects"
  ON public.projects
  FOR SELECT
  USING (
    id IN (
      SELECT project_id FROM public.project_collaborators
      WHERE user_id = auth.uid() AND status = 'accepted'
    )
  );

-- Accepted editors can update shared projects
CREATE POLICY "Editors can update shared projects"
  ON public.projects
  FOR UPDATE
  USING (
    id IN (
      SELECT project_id FROM public.project_collaborators
      WHERE user_id = auth.uid() AND status = 'accepted' AND role = 'editor'
    )
  )
  WITH CHECK (
    id IN (
      SELECT project_id FROM public.project_collaborators
      WHERE user_id = auth.uid() AND status = 'accepted' AND role = 'editor'
    )
  );
