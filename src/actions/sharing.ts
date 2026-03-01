"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { nanoid } from "nanoid";
import type { ShareLink, Collaborator, SharePermission, SharedProject } from "@/types/sharing";
import type { BlueprintState } from "@/types/blueprint";

// ─── Share Links ────────────────────────────────────────────

export async function createShareLink(
  projectId: string
): Promise<{ success: boolean; shareLink?: ShareLink; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) return { success: false, error: "Project not found." };

  const token = nanoid(12);

  const { data, error } = await supabase
    .from("project_share_links")
    .upsert(
      { project_id: projectId, token, is_active: true },
      { onConflict: "project_id" }
    )
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, shareLink: data as ShareLink };
}

export async function getShareLink(
  projectId: string
): Promise<{ success: boolean; shareLink?: ShareLink | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const { data, error } = await supabase
    .from("project_share_links")
    .select()
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) return { success: false, error: error.message };
  return { success: true, shareLink: data as ShareLink | null };
}

export async function toggleShareLink(
  projectId: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const { error } = await supabase
    .from("project_share_links")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("project_id", projectId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function deleteShareLink(
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const { error } = await supabase
    .from("project_share_links")
    .delete()
    .eq("project_id", projectId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getSharedProject(
  token: string
): Promise<{ success: boolean; blueprint?: BlueprintState; siteName?: string; error?: string }> {
  // Use admin client — caller may be unauthenticated
  const admin = createAdminClient();

  const { data: link, error: linkError } = await admin
    .from("project_share_links")
    .select("project_id, is_active")
    .eq("token", token)
    .single();

  if (linkError || !link) return { success: false, error: "Share link not found." };
  if (!link.is_active) return { success: false, error: "This share link has been disabled." };

  const { data: project, error: projectError } = await admin
    .from("projects")
    .select("current_json_state, site_name")
    .eq("id", link.project_id)
    .single();

  if (projectError || !project) return { success: false, error: "Project not found." };

  return {
    success: true,
    blueprint: project.current_json_state as BlueprintState,
    siteName: project.site_name,
  };
}

// ─── Collaborators / Invites ────────────────────────────────

export async function inviteCollaborator(
  projectId: string,
  email: string,
  role: "viewer" | "editor"
): Promise<{ success: boolean; collaborator?: Collaborator; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Verify ownership
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) return { success: false, error: "Project not found." };

  // Don't allow self-invite
  if (email.toLowerCase() === user.email?.toLowerCase()) {
    return { success: false, error: "You cannot invite yourself." };
  }

  const invite_token = nanoid(24);

  const { data, error } = await supabase
    .from("project_collaborators")
    .upsert(
      {
        project_id: projectId,
        invited_by: user.id,
        email: email.toLowerCase(),
        role,
        status: "pending",
        invite_token,
      },
      { onConflict: "project_id,email" }
    )
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, collaborator: data as Collaborator };
}

export async function removeCollaborator(
  projectId: string,
  collaboratorId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const { error } = await supabase
    .from("project_collaborators")
    .delete()
    .eq("id", collaboratorId)
    .eq("project_id", projectId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function updateCollaboratorRole(
  projectId: string,
  collaboratorId: string,
  role: "viewer" | "editor"
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const { error } = await supabase
    .from("project_collaborators")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", collaboratorId)
    .eq("project_id", projectId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function acceptInvite(
  inviteToken: string
): Promise<{ success: boolean; projectId?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Use admin to look up the invite (user might not have RLS access yet)
  const admin = createAdminClient();
  const { data: invite, error: findError } = await admin
    .from("project_collaborators")
    .select("id, project_id, email, status")
    .eq("invite_token", inviteToken)
    .single();

  if (findError || !invite) return { success: false, error: "Invite not found." };
  if (invite.status === "accepted") return { success: true, projectId: invite.project_id };

  // Verify the email matches
  if (invite.email !== user.email?.toLowerCase()) {
    return { success: false, error: "This invite was sent to a different email address." };
  }

  const { error } = await admin
    .from("project_collaborators")
    .update({
      user_id: user.id,
      status: "accepted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", invite.id);

  if (error) return { success: false, error: error.message };
  return { success: true, projectId: invite.project_id };
}

export async function declineInvite(
  inviteToken: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_collaborators")
    .update({
      status: "declined",
      user_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("invite_token", inviteToken);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getProjectCollaborators(
  projectId: string
): Promise<{ success: boolean; collaborators?: Collaborator[]; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const { data, error } = await supabase
    .from("project_collaborators")
    .select()
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message };
  return { success: true, collaborators: data as Collaborator[] };
}

export async function getSharedProjects(): Promise<{
  success: boolean;
  projects?: SharedProject[];
  error?: string;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Get accepted collaborations for this user
  const { data: collabs, error: collabError } = await supabase
    .from("project_collaborators")
    .select("project_id, role, invited_by")
    .eq("user_id", user.id)
    .eq("status", "accepted");

  if (collabError) return { success: false, error: collabError.message };
  if (!collabs || collabs.length === 0) return { success: true, projects: [] };

  // Fetch the projects (RLS allows collaborators to read)
  const projectIds = collabs.map((c) => c.project_id);
  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id, site_name, original_url, created_at, user_id")
    .in("id", projectIds);

  if (projectError) return { success: false, error: projectError.message };

  // Get owner emails
  const ownerIds = [...new Set((projects || []).map((p) => p.user_id))];
  const admin = createAdminClient();

  let ownerEmails: Record<string, string> = {};
  if (ownerIds.length > 0) {
    const { data: { users } } = await admin.auth.admin.listUsers();
    ownerEmails = Object.fromEntries(
      (users || [])
        .filter((u) => ownerIds.includes(u.id))
        .map((u) => [u.id, u.email || "Unknown"])
    );
  }

  const result: SharedProject[] = (projects || []).map((p) => {
    const collab = collabs.find((c) => c.project_id === p.id);
    return {
      id: p.id,
      site_name: p.site_name,
      original_url: p.original_url,
      created_at: p.created_at,
      role: (collab?.role || "viewer") as "viewer" | "editor",
      owner_email: ownerEmails[p.user_id] || "Unknown",
    };
  });

  return { success: true, projects: result };
}

export async function getMyPermission(
  projectId: string
): Promise<{ success: boolean; permission: SharePermission; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, permission: "none", error: "Unauthorized." };

  // Check if owner
  const { data: owned } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (owned) return { success: true, permission: "owner" };

  // Check collaborator role
  const { data: collab } = await supabase
    .from("project_collaborators")
    .select("role")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .eq("status", "accepted")
    .maybeSingle();

  if (collab) return { success: true, permission: collab.role as SharePermission };

  return { success: true, permission: "none" };
}
