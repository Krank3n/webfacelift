"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadMedia(formData: FormData): Promise<{
  success: boolean;
  url?: string;
  error?: string;
}> {
  const file = formData.get("file") as File | null;

  if (!file) {
    return { success: false, error: "No file provided." };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized." };
  }

  const ext = file.name.split(".").pop();
  const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from("user-uploads")
    .upload(fileName, file);

  if (error) {
    return { success: false, error: error.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("user-uploads").getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}
