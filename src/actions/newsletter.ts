"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function subscribeNewsletter(
  email: string
): Promise<{ success: boolean; error?: string }> {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("newsletter_subscribers")
    .upsert(
      { email: email.toLowerCase() },
      { onConflict: "email" }
    );

  if (error) return { success: false, error: "Something went wrong. Please try again." };
  return { success: true };
}
