"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { BlueprintState, Project } from "@/types/blueprint";

// All project queries use admin client to avoid infinite RLS recursion
// between projects ↔ project_collaborators policies.
// Auth is always verified via supabase.auth.getUser() before any query.

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function createProject(
  url: string,
  blueprint: BlueprintState
): Promise<{ success: boolean; project?: Project; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .insert({
      user_id: user.id,
      original_url: url,
      site_name: blueprint.siteName,
      current_json_state: blueprint,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, project: data as Project };
}

export async function updateProjectState(
  projectId: string,
  blueprint: BlueprintState
): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  // Verify ownership or collaborator access
  const admin = createAdminClient();

  const { data: project } = await admin
    .from("projects")
    .select("user_id")
    .eq("id", projectId)
    .single();

  if (!project) return { success: false, error: "Project not found." };

  const isOwner = project.user_id === user.id;

  if (!isOwner) {
    const { data: collab } = await admin
      .from("project_collaborators")
      .select("role")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .eq("role", "editor")
      .maybeSingle();

    if (!collab) return { success: false, error: "Unauthorized." };
  }

  const { error } = await admin
    .from("projects")
    .update({
      current_json_state: blueprint,
      site_name: blueprint.siteName,
    })
    .eq("id", projectId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getProject(
  projectId: string
): Promise<{ success: boolean; project?: Project; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();

  // Fetch project
  const { data, error } = await admin
    .from("projects")
    .select()
    .eq("id", projectId)
    .single();

  if (error) return { success: false, error: error.message };

  // Verify access: owner or accepted collaborator
  const isOwner = data.user_id === user.id;

  if (!isOwner) {
    const { data: collab } = await admin
      .from("project_collaborators")
      .select("id")
      .eq("project_id", projectId)
      .eq("user_id", user.id)
      .eq("status", "accepted")
      .maybeSingle();

    if (!collab) return { success: false, error: "Unauthorized." };
  }

  return { success: true, project: data as Project };
}

export async function getUserProjects(): Promise<{
  success: boolean;
  projects?: Project[];
  error?: string;
}> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("projects")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };
  return { success: true, projects: data as Project[] };
}

export async function deleteProject(
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
