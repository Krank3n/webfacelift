import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, name, email, phone, message, fields } = body;

    if (!projectId || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Look up the project and its owner's contact email
    const { data: project, error: projectError } = await admin
      .from("projects")
      .select("id, site_name, user_id, contact_email")
      .eq("id", projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Use project's contact_email, fall back to owner's auth email
    let toEmail = project.contact_email;
    if (!toEmail) {
      const {
        data: { user },
      } = await admin.auth.admin.getUserById(project.user_id);
      toEmail = user?.email;
    }

    if (!toEmail) {
      return NextResponse.json(
        { error: "No contact email configured" },
        { status: 400 }
      );
    }

    // Build the email body from all submitted fields
    const extraFields = fields
      ? Object.entries(fields as Record<string, string>)
          .map(([key, val]) => `<p><strong>${key}:</strong> ${val}</p>`)
          .join("")
      : "";

    const htmlBody = `
      <h2>New contact form submission</h2>
      <p><strong>From:</strong> ${name || "Not provided"}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
      ${extraFields}
      <hr />
      <p>${message}</p>
      <br />
      <p style="color: #888; font-size: 12px;">
        Sent from your ${project.site_name || "website"} contact form via WebFacelift
      </p>
    `;

    await resend.emails.send({
      from: `${project.site_name || "Website"} <noreply@${process.env.RESEND_DOMAIN || "webfacelift.com"}>`,
      to: toEmail,
      replyTo: email,
      subject: `Contact form: ${name || "New message"} — ${project.site_name || "Your website"}`,
      html: htmlBody,
    });

    // Store submission in DB for records
    await admin.from("contact_submissions").insert({
      project_id: projectId,
      name: name || null,
      email,
      phone: phone || null,
      message,
      extra_fields: fields || null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
