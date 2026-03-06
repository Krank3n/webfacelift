"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DO_API_TOKEN = process.env.DO_API_TOKEN || "";
const DO_APP_ID = process.env.DO_APP_ID || "";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Add a domain to the DO App Platform spec
async function addDomainToApp(domain: string): Promise<{ success: boolean; error?: string }> {
  if (!DO_API_TOKEN || !DO_APP_ID) {
    return { success: false, error: "Server not configured for custom domains." };
  }

  // Get current app spec
  const appRes = await fetch(`https://api.digitalocean.com/v2/apps/${DO_APP_ID}`, {
    headers: { Authorization: `Bearer ${DO_API_TOKEN}` },
  });
  const appData = await appRes.json();
  const spec = appData.app?.spec;

  if (!spec) return { success: false, error: "Could not fetch app config." };

  // Check if domain already exists in spec
  const existingDomains: Array<{ domain: string; type: string; zone?: string }> = spec.domains || [];
  if (existingDomains.some((d) => d.domain === domain)) {
    return { success: true }; // Already added
  }

  // Add the new domain as ALIAS type (custom domain)
  spec.domains = [...existingDomains, { domain, type: "ALIAS" }];

  // Update the app
  const updateRes = await fetch(`https://api.digitalocean.com/v2/apps/${DO_APP_ID}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${DO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spec }),
  });

  if (!updateRes.ok) {
    const err = await updateRes.json();
    return { success: false, error: err.message || "Failed to register domain with hosting." };
  }

  return { success: true };
}

// Remove a domain from the DO App Platform spec
async function removeDomainFromApp(domain: string): Promise<void> {
  if (!DO_API_TOKEN || !DO_APP_ID) return;

  const appRes = await fetch(`https://api.digitalocean.com/v2/apps/${DO_APP_ID}`, {
    headers: { Authorization: `Bearer ${DO_API_TOKEN}` },
  });
  const appData = await appRes.json();
  const spec = appData.app?.spec;
  if (!spec) return;

  const existingDomains: Array<{ domain: string; type: string }> = spec.domains || [];
  spec.domains = existingDomains.filter((d) => d.domain !== domain);

  await fetch(`https://api.digitalocean.com/v2/apps/${DO_APP_ID}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${DO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ spec }),
  });
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

  // Normalize domain
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

  // Get any previously set domain to remove from DO
  const { data: previousDomain } = await admin
    .from("project_custom_domains")
    .select("domain")
    .eq("project_id", projectId)
    .maybeSingle();

  if (previousDomain && previousDomain.domain !== normalized) {
    await removeDomainFromApp(previousDomain.domain);
  }

  // Register domain with DO App Platform
  const doResult = await addDomainToApp(normalized);
  if (!doResult.success) {
    return { success: false, error: doResult.error };
  }

  // Save to DB
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

  // Get domain to remove from DO
  const { data: domainRecord } = await admin
    .from("project_custom_domains")
    .select("domain")
    .eq("project_id", projectId)
    .maybeSingle();

  if (domainRecord) {
    await removeDomainFromApp(domainRecord.domain);
  }

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

  const { data: link } = await admin
    .from("project_share_links")
    .select("token")
    .eq("project_id", data.project_id)
    .eq("is_active", true)
    .single();

  if (!link) return null;
  return { token: link.token };
}
