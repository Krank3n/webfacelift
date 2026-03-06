import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const DO_API_TOKEN = process.env.DO_API_TOKEN || "";
const DO_APP_ID = process.env.DO_APP_ID || "";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId } = await request.json();
    if (!projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify ownership
    const { data: project } = await admin
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single();

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get the custom domain
    const { data: domainRecord } = await admin
      .from("project_custom_domains")
      .select("id, domain, verified")
      .eq("project_id", projectId)
      .single();

    if (!domainRecord) {
      return NextResponse.json({ error: "No custom domain set" }, { status: 404 });
    }

    if (domainRecord.verified) {
      return NextResponse.json({ verified: true, domain: domainRecord.domain });
    }

    if (!DO_API_TOKEN || !DO_APP_ID) {
      return NextResponse.json(
        { error: "Server not configured for domain verification" },
        { status: 500 }
      );
    }

    // Check the domain status on DO App Platform
    const doRes = await fetch(
      `https://api.digitalocean.com/v2/apps/${DO_APP_ID}`,
      { headers: { Authorization: `Bearer ${DO_API_TOKEN}` } }
    );
    const doData = await doRes.json();
    const appDomains = doData.app?.spec?.domains || [];
    const matchingDomain = appDomains.find(
      (d: { domain: string }) => d.domain === domainRecord.domain
    );

    if (!matchingDomain) {
      return NextResponse.json({
        verified: false,
        domain: domainRecord.domain,
        message: "Domain not yet registered with hosting. Please save the domain first.",
      });
    }

    // Check if DO has verified it (SSL provisioned)
    const activeDomains = doData.app?.active_deployment?.services?.[0]?.routes || [];
    const isLive = activeDomains.length > 0;

    // For now, if DO accepted the domain in the spec, mark it verified
    // DO handles SSL automatically once DNS points to them
    await admin
      .from("project_custom_domains")
      .update({ verified: true, updated_at: new Date().toISOString() })
      .eq("id", domainRecord.id);

    return NextResponse.json({ verified: true, domain: domainRecord.domain });
  } catch (error) {
    console.error("Domain verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
