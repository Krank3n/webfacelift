"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function setCustomDomain(
  projectId: string,
  domain: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();

  // Verify ownership
  const { data: project } = await admin
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single();

  if (!project) return { success: false, error: "Project not found." };

  // Normalize domain (lowercase, no trailing slash, no protocol)
  const normalized = domain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .trim();

  if (!normalized || !normalized.includes(".")) {
    return { success: false, error: "Invalid domain." };
  }

  // Check if domain is already used by another project
  const { data: existing } = await admin
    .from("project_custom_domains")
    .select("project_id")
    .eq("domain", normalized)
    .neq("project_id", projectId)
    .maybeSingle();

  if (existing) {
    return { success: false, error: "This domain is already in use." };
  }

  const { error } = await admin.from("project_custom_domains").upsert(
    {
      project_id: projectId,
      domain: normalized,
      verified: false,
    },
    { onConflict: "project_id" }
  );

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function removeCustomDomain(
  projectId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();
  const { error } = await admin
    .from("project_custom_domains")
    .delete()
    .eq("project_id", projectId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function getCustomDomain(
  projectId: string
): Promise<{
  success: boolean;
  domain?: { domain: string; verified: boolean } | null;
  error?: string;
}> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("project_custom_domains")
    .select("domain, verified")
    .eq("project_id", projectId)
    .maybeSingle();

  if (error) return { success: false, error: error.message };
  return { success: true, domain: data };
}

export async function setContactEmail(
  projectId: string,
  contactEmail: string
): Promise<{ success: boolean; error?: string }> {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized." };

  const admin = createAdminClient();

  const { error } = await admin
    .from("projects")
    .update({ contact_email: contactEmail })
    .eq("id", projectId)
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// Look up a project by custom domain (used by middleware)
export async function getProjectByDomain(
  domain: string
): Promise<{ token: string } | null> {
  const admin = createAdminClient();

  const { data } = await admin
    .from("project_custom_domains")
    .select("project_id")
    .eq("domain", domain.toLowerCase())
    .eq("verified", true)
    .single();

  if (!data) return null;

  // Get the active share link for this project
  const { data: link } = await admin
    .from("project_share_links")
    .select("token")
    .eq("project_id", data.project_id)
    .eq("is_active", true)
    .single();

  if (!link) return null;
  return { token: link.token };
}
