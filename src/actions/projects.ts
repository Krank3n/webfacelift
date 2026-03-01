"use server";

import { createClient } from "@/lib/supabase/server";
import type { BlueprintState, Project } from "@/types/blueprint";

export async function createProject(
  url: string,
  blueprint: BlueprintState
): Promise<{ success: boolean; project?: Project; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      original_url: url,
      site_name: blueprint.siteName,
      current_json_state: blueprint,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, project: data as Project };
}

export async function updateProjectState(
  projectId: string,
  blueprint: BlueprintState
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  // RLS handles access: owners always, editors via collaborator policy
  const { error } = await supabase
    .from("projects")
    .update({
      current_json_state: blueprint,
      site_name: blueprint.siteName,
    })
    .eq("id", projectId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getProject(
  projectId: string
): Promise<{ success: boolean; project?: Project; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  // RLS handles access: owners always, collaborators via additive policy
  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("id", projectId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, project: data as Project };
}

export async function getUserProjects(): Promise<{
  success: boolean;
  projects?: Project[];
  error?: string;
}> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const { data, error } = await supabase
    .from("projects")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, projects: data as Project[] };
}

export async function deleteProject(
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
