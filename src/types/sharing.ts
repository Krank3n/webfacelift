export interface ShareLink {
  id: string;
  project_id: string;
  token: string;
  is_active: boolean;
  password_hash: string | null;
  created_at: string;
  updated_at: string;
}

export interface Collaborator {
  id: string;
  project_id: string;
  invited_by: string;
  email: string;
  user_id: string | null;
  role: "viewer" | "editor";
  status: "pending" | "accepted" | "declined";
  invite_token: string | null;
  created_at: string;
  updated_at: string;
}

export type SharePermission = "owner" | "editor" | "viewer" | "none";

export interface SharedProject {
  id: string;
  site_name: string | null;
  original_url: string;
  created_at: string;
  role: "viewer" | "editor";
  owner_email: string;
}
