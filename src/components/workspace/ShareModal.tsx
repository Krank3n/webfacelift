"use client";

import { useState, useEffect } from "react";
import ModalOverlay from "@/components/ui/ModalOverlay";
import {
  X,
  Link2,
  Copy,
  Check,
  Users,
  Loader2,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  createShareLink,
  getShareLink,
  toggleShareLink,
  getProjectCollaborators,
  inviteCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
} from "@/actions/sharing";
import type { ShareLink, Collaborator } from "@/types/sharing";
import { toast } from "sonner";

interface ShareModalProps {
  open: boolean;
  projectId: string;
  onClose: () => void;
}

type Tab = "link" | "people";

export default function ShareModal({ open, projectId, onClose }: ShareModalProps) {
  const [tab, setTab] = useState<Tab>("link");
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [linkLoading, setLinkLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "editor">("viewer");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    if (!open) return;
    loadShareLink();
    loadCollaborators();
  }, [open, projectId]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  async function loadShareLink() {
    setLinkLoading(true);
    const res = await getShareLink(projectId);
    if (res.success) setShareLink(res.shareLink ?? null);
    setLinkLoading(false);
  }

  async function loadCollaborators() {
    setPeopleLoading(true);
    const res = await getProjectCollaborators(projectId);
    if (res.success && res.collaborators) setCollaborators(res.collaborators);
    setPeopleLoading(false);
  }

  async function handleCreateLink() {
    setLinkLoading(true);
    const res = await createShareLink(projectId);
    if (res.success && res.shareLink) setShareLink(res.shareLink);
    setLinkLoading(false);
  }

  async function handleToggleLink() {
    if (!shareLink) return;
    const newActive = !shareLink.is_active;
    await toggleShareLink(projectId, newActive);
    setShareLink({ ...shareLink, is_active: newActive });
  }

  function getShareUrl() {
    if (!shareLink) return "";
    return `${window.location.origin}/share/${shareLink.token}`;
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied to clipboard");
  }

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError("");
    const res = await inviteCollaborator(projectId, inviteEmail.trim(), inviteRole);
    if (res.success) {
      setInviteEmail("");
      loadCollaborators();
      toast.success("Invitation sent");
    } else {
      setInviteError(res.error || "Failed to invite.");
      toast.error(res.error || "Failed to send invitation");
    }
    setInviting(false);
  }

  async function handleRemove(collaboratorId: string) {
    await removeCollaborator(projectId, collaboratorId);
    setCollaborators((c) => c.filter((x) => x.id !== collaboratorId));
    toast.success("Collaborator removed");
  }

  async function handleRoleChange(collaboratorId: string, role: "viewer" | "editor") {
    await updateCollaboratorRole(projectId, collaboratorId, role);
    setCollaborators((c) =>
      c.map((x) => (x.id === collaboratorId ? { ...x, role } : x))
    );
  }

  return (
    <ModalOverlay open={open} onClose={onClose} label="Share Project">
      <div className="w-full max-w-md mx-4 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl shadow-black/50 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-sm font-medium text-white">Share Project</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          {([
            { key: "link" as Tab, label: "Link", icon: Link2 },
            { key: "people" as Tab, label: "People", icon: Users },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs transition-colors ${
                tab === key
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 min-h-[200px]">
          {tab === "link" && (
            <div className="space-y-4">
              {linkLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={16} className="text-white/30 animate-spin" />
                </div>
              ) : !shareLink ? (
                <div className="text-center py-4">
                  <p className="text-xs text-white/40 mb-4">
                    Create a public link anyone can use to view this project.
                  </p>
                  <button
                    onClick={handleCreateLink}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                  >
                    Create Share Link
                  </button>
                </div>
              ) : (
                <>
                  {/* Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">Public link</p>
                      <p className="text-[11px] text-white/30">
                        {shareLink.is_active
                          ? "Anyone with the link can view"
                          : "Link is disabled"}
                      </p>
                    </div>
                    <button
                      onClick={handleToggleLink}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        shareLink.is_active ? "bg-indigo-600" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          shareLink.is_active ? "left-5.5 translate-x-0" : "left-0.5"
                        }`}
                        style={{
                          left: shareLink.is_active ? "22px" : "2px",
                        }}
                      />
                    </button>
                  </div>

                  {/* URL + Copy */}
                  {shareLink.is_active && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-800 border border-white/10">
                      <span className="flex-1 text-xs text-white/60 truncate font-mono">
                        {getShareUrl()}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors shrink-0"
                        title="Copy link"
                      >
                        {copied ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {tab === "people" && (
            <div className="space-y-4">
              {/* Invite form */}
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 text-white text-sm placeholder:text-white/30 outline-none focus:border-indigo-500/50"
                />
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as "viewer" | "editor")
                    }
                    className="appearance-none px-3 py-2 pr-7 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs outline-none cursor-pointer"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                  />
                </div>
                <button
                  onClick={handleInvite}
                  disabled={inviting || !inviteEmail.trim()}
                  className="px-3 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-40"
                >
                  {inviting ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    "Invite"
                  )}
                </button>
              </div>

              {inviteError && (
                <p className="text-xs text-red-400">{inviteError}</p>
              )}

              {/* Collaborator list */}
              {peopleLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 size={16} className="text-white/30 animate-spin" />
                </div>
              ) : collaborators.length === 0 ? (
                <p className="text-xs text-white/30 text-center py-6">
                  No collaborators yet. Invite someone by email.
                </p>
              ) : (
                <div className="space-y-2">
                  {collaborators.map((collab) => (
                    <div
                      key={collab.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/50 border border-white/[0.06]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white truncate">
                          {collab.email}
                        </p>
                        <p className="text-[10px] text-white/30 capitalize">
                          {collab.status}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <div className="relative">
                          <select
                            value={collab.role}
                            onChange={(e) =>
                              handleRoleChange(
                                collab.id,
                                e.target.value as "viewer" | "editor"
                              )
                            }
                            className="appearance-none px-2 py-1 pr-6 rounded bg-zinc-700 border border-white/10 text-white text-[11px] outline-none cursor-pointer"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="editor">Editor</option>
                          </select>
                          <ChevronDown
                            size={10}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                          />
                        </div>
                        <button
                          onClick={() => handleRemove(collab.id)}
                          className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
}
