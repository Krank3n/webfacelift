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
  Globe,
  Mail,
  Rocket,
  CheckCircle2,
  Circle,
  ExternalLink,
  ArrowRight,
  Shield,
  Sparkles,
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
import {
  getCustomDomain,
  setCustomDomain,
  removeCustomDomain,
  setContactEmail,
  getContactEmail,
} from "@/actions/domains";
import type { ShareLink, Collaborator } from "@/types/sharing";
import { toast } from "sonner";

interface ShareModalProps {
  open: boolean;
  projectId: string;
  onClose: () => void;
}

type Tab = "publish" | "link" | "people";

export default function ShareModal({ open, projectId, onClose }: ShareModalProps) {
  const [tab, setTab] = useState<Tab>("publish");
  const [shareLink, setShareLink] = useState<ShareLink | null>(null);
  const [linkLoading, setLinkLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [peopleLoading, setPeopleLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "editor">("viewer");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // Publish tab state
  const [domain, setDomain] = useState("");
  const [savedDomain, setSavedDomain] = useState("");
  const [domainVerified, setDomainVerified] = useState(false);
  const [domainLoading, setDomainLoading] = useState(true);
  const [domainSaving, setDomainSaving] = useState(false);
  const [contactEmailValue, setContactEmailValue] = useState("");
  const [contactEmailSaved, setContactEmailSaved] = useState(false);
  const [contactEmailSaving, setContactEmailSaving] = useState(false);
  const [domainVerifying, setDomainVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [dnsCopied, setDnsCopied] = useState<string | null>(null);

  // Expand/collapse steps
  const [expandedStep, setExpandedStep] = useState<"email" | "domain" | null>(null);

  useEffect(() => {
    if (!open) return;
    loadShareLink();
    loadCollaborators();
    loadPublishSettings();
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

  async function loadPublishSettings() {
    setDomainLoading(true);
    const [domainRes, emailRes] = await Promise.all([
      getCustomDomain(projectId),
      getContactEmail(projectId),
    ]);
    if (domainRes.success && domainRes.domain) {
      setDomain(domainRes.domain.domain);
      setSavedDomain(domainRes.domain.domain);
      setDomainVerified(domainRes.domain.verified);
    }
    if (emailRes.success && emailRes.email) {
      setContactEmailValue(emailRes.email);
      setContactEmailSaved(true);
    }
    setDomainLoading(false);

    // Auto-expand first incomplete step
    if (!emailRes.email) {
      setExpandedStep("email");
    } else if (!domainRes.domain?.domain) {
      setExpandedStep("domain");
    }
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

  async function handleCopyDns(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setDnsCopied(key);
    setTimeout(() => setDnsCopied(null), 2000);
    toast.success("Copied to clipboard");
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

  async function handleSaveDomain() {
    if (!domain.trim()) return;
    setDomainSaving(true);
    const res = await setCustomDomain(projectId, domain.trim());
    if (res.success) {
      setSavedDomain(domain.trim());
      setDomainVerified(false);
      toast.success("Domain saved! Now point your DNS to complete setup.");
    } else {
      toast.error(res.error || "Failed to save domain");
    }
    setDomainSaving(false);
  }

  async function handleRemoveDomain() {
    setDomainSaving(true);
    const res = await removeCustomDomain(projectId);
    if (res.success) {
      setDomain("");
      setSavedDomain("");
      setDomainVerified(false);
      toast.success("Custom domain removed");
    } else {
      toast.error(res.error || "Failed to remove domain");
    }
    setDomainSaving(false);
  }

  async function handleVerifyDomain() {
    setDomainVerifying(true);
    setVerifyMessage("");
    try {
      const res = await fetch("/api/domains/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });
      const result = await res.json();
      if (result.verified) {
        setDomainVerified(true);
        setVerifyMessage("");
        toast.success("Domain verified and live!");
      } else {
        setVerifyMessage(result.message || "DNS not detected yet. Changes can take up to 48 hours.");
      }
    } catch {
      setVerifyMessage("Could not verify domain. Try again in a moment.");
    }
    setDomainVerifying(false);
  }

  async function handleSaveContactEmail() {
    if (!contactEmailValue.trim()) return;
    setContactEmailSaving(true);
    const res = await setContactEmail(projectId, contactEmailValue.trim());
    if (res.success) {
      setContactEmailSaved(true);
      toast.success("Contact email saved — form submissions will be sent here");
    } else {
      toast.error(res.error || "Failed to save email");
    }
    setContactEmailSaving(false);
  }

  // Checklist status
  const shareLinkReady = shareLink?.is_active ?? false;
  const emailReady = contactEmailSaved && !!contactEmailValue.trim();
  const domainReady = !!savedDomain && domainVerified;
  const completedSteps = [shareLinkReady, emailReady, domainReady].filter(Boolean).length;

  return (
    <ModalOverlay open={open} onClose={onClose} label="Share & Publish">
      <div className="w-full max-w-lg mx-4 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl shadow-black/50 animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Rocket size={14} className="text-white" />
            </div>
            <div>
              <span className="text-sm font-semibold text-white">Go Live</span>
              <p className="text-[10px] text-white/30">Publish & share your site</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 px-1">
          {([
            { key: "publish" as Tab, label: "Publish", icon: Rocket },
            { key: "link" as Tab, label: "Share Link", icon: Link2 },
            { key: "people" as Tab, label: "People", icon: Users },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-all relative ${
                tab === key
                  ? "text-white"
                  : "text-white/35 hover:text-white/55"
              }`}
            >
              <Icon size={13} />
              {label}
              {tab === key && (
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-5 min-h-[280px] max-h-[70vh] overflow-y-auto">
          {/* ───── PUBLISH TAB ───── */}
          {tab === "publish" && (
            <div className="space-y-4">
              {domainLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 size={20} className="text-indigo-400 animate-spin" />
                  <p className="text-xs text-white/30">Loading publish settings...</p>
                </div>
              ) : (
                <>
                  {/* Progress overview */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-indigo-500/[0.08] to-violet-500/[0.08] border border-indigo-500/20">
                    <div className="relative w-10 h-10 shrink-0">
                      <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="14" fill="none" stroke="currentColor" strokeWidth="3" className="text-white/[0.06]" />
                        <circle
                          cx="18" cy="18" r="14" fill="none" stroke="url(#progressGrad)" strokeWidth="3"
                          strokeDasharray={`${(completedSteps / 3) * 88} 88`}
                          strokeLinecap="round"
                          className="transition-all duration-700"
                        />
                        <defs>
                          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white">
                        {completedSteps}/3
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">
                        {completedSteps === 3 ? "Your site is live!" : "Launch checklist"}
                      </p>
                      <p className="text-[11px] text-white/40 mt-0.5">
                        {completedSteps === 0 && "Complete these steps to go live"}
                        {completedSteps === 1 && "Great start — keep going"}
                        {completedSteps === 2 && "Almost there — one more step"}
                        {completedSteps === 3 && "Everything is set up and running"}
                      </p>
                    </div>
                    {completedSteps === 3 && (
                      <Sparkles size={18} className="text-indigo-400 shrink-0" />
                    )}
                  </div>

                  {/* ── Step 1: Share Link ── */}
                  <div className={`rounded-xl border transition-all ${
                    shareLinkReady
                      ? "border-green-500/20 bg-green-500/[0.03]"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      {shareLinkReady ? (
                        <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                      ) : (
                        <Circle size={18} className="text-white/20 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white">Enable share link</p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {shareLinkReady ? "Your site is publicly accessible" : "Required to make your site viewable"}
                        </p>
                      </div>
                      {!shareLinkReady && (
                        <button
                          onClick={async () => {
                            if (!shareLink) {
                              await handleCreateLink();
                            } else {
                              await handleToggleLink();
                            }
                          }}
                          disabled={linkLoading}
                          className="px-3 py-1.5 text-[11px] font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-40 flex items-center gap-1.5"
                        >
                          {linkLoading ? <Loader2 size={11} className="animate-spin" /> : <ArrowRight size={11} />}
                          Enable
                        </button>
                      )}
                      {shareLinkReady && (
                        <button
                          onClick={handleCopy}
                          className="px-2.5 py-1.5 text-[11px] text-white/40 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                          {copied ? "Copied" : "Copy URL"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Step 2: Contact Email ── */}
                  <div className={`rounded-xl border transition-all ${
                    emailReady
                      ? "border-green-500/20 bg-green-500/[0.03]"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}>
                    <button
                      onClick={() => setExpandedStep(expandedStep === "email" ? null : "email")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      {emailReady ? (
                        <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                      ) : (
                        <div className="relative shrink-0">
                          <Circle size={18} className="text-indigo-400" />
                          <span className="absolute inset-0 rounded-full border-2 border-indigo-400/40 animate-ping" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white flex items-center gap-1.5">
                          <Mail size={11} className="text-white/40" />
                          Contact form email
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {emailReady
                            ? `Submissions sent to ${contactEmailValue}`
                            : "Where should contact form messages go?"}
                        </p>
                      </div>
                      <ChevronDown size={14} className={`text-white/20 transition-transform ${expandedStep === "email" ? "rotate-180" : ""}`} />
                    </button>

                    {expandedStep === "email" && (
                      <div className="px-4 pb-4 pt-0 space-y-3">
                        <div className="ml-[30px] space-y-3">
                          <p className="text-[11px] text-white/40 leading-relaxed">
                            When visitors fill out the contact form on your site, their message will be emailed to this address.
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                              <input
                                type="email"
                                placeholder="you@yourbusiness.com"
                                value={contactEmailValue}
                                onChange={(e) => {
                                  setContactEmailValue(e.target.value);
                                  setContactEmailSaved(false);
                                }}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveContactEmail()}
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-sm placeholder:text-white/20 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              />
                            </div>
                            <button
                              onClick={handleSaveContactEmail}
                              disabled={contactEmailSaving || !contactEmailValue.trim()}
                              className="px-4 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-40 shrink-0 flex items-center gap-1.5"
                            >
                              {contactEmailSaving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : contactEmailSaved ? (
                                <>
                                  <Check size={12} />
                                  Saved
                                </>
                              ) : (
                                "Save"
                              )}
                            </button>
                          </div>
                          {!contactEmailSaved && (
                            <p className="text-[10px] text-white/20 flex items-center gap-1">
                              <Shield size={9} />
                              If not set, submissions go to your account email.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Step 3: Custom Domain ── */}
                  <div className={`rounded-xl border transition-all ${
                    domainReady
                      ? "border-green-500/20 bg-green-500/[0.03]"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}>
                    <button
                      onClick={() => setExpandedStep(expandedStep === "domain" ? null : "domain")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left"
                    >
                      {domainReady ? (
                        <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                      ) : (
                        <Circle size={18} className="text-white/20 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white flex items-center gap-1.5">
                          <Globe size={11} className="text-white/40" />
                          Custom domain
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {domainReady
                            ? `Live at ${savedDomain}`
                            : savedDomain && !domainVerified
                              ? `${savedDomain} — awaiting DNS verification`
                              : "Use your own domain (e.g., yourbusiness.com)"}
                        </p>
                      </div>
                      <ChevronDown size={14} className={`text-white/20 transition-transform ${expandedStep === "domain" ? "rotate-180" : ""}`} />
                    </button>

                    {expandedStep === "domain" && (
                      <div className="px-4 pb-4 pt-0 space-y-3">
                        <div className="ml-[30px] space-y-3">
                          {/* Domain input */}
                          <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
                              <input
                                type="text"
                                placeholder="yourbusiness.com"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSaveDomain()}
                                className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-sm placeholder:text-white/20 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                              />
                            </div>
                            <button
                              onClick={handleSaveDomain}
                              disabled={domainSaving || !domain.trim()}
                              className="px-4 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-40 shrink-0"
                            >
                              {domainSaving ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                "Connect"
                              )}
                            </button>
                            {savedDomain && (
                              <button
                                onClick={handleRemoveDomain}
                                disabled={domainSaving}
                                className="p-2.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
                                title="Remove domain"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          {/* DNS instructions — shown after saving domain */}
                          {savedDomain && !domainVerified && (
                            <div className="space-y-3">
                              <div className="p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/15">
                                <div className="flex items-start gap-2.5 mb-3">
                                  <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <span className="text-[10px] font-bold text-amber-400">!</span>
                                  </div>
                                  <div>
                                    <p className="text-xs font-medium text-amber-300">Point your DNS</p>
                                    <p className="text-[11px] text-amber-400/60 mt-0.5">
                                      Add this record at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
                                    </p>
                                  </div>
                                </div>

                                {/* DNS Record Table */}
                                <div className="rounded-lg overflow-hidden border border-amber-500/10">
                                  <div className="grid grid-cols-3 text-[10px] text-amber-400/50 font-medium uppercase tracking-wider bg-black/30 px-3 py-1.5">
                                    <span>Type</span>
                                    <span>Host</span>
                                    <span>Value</span>
                                  </div>
                                  <div className="grid grid-cols-3 items-center bg-black/20 px-3 py-2.5 gap-2">
                                    <span className="text-xs font-mono font-semibold text-amber-300">CNAME</span>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs font-mono text-white/70">@</span>
                                      <button
                                        onClick={() => handleCopyDns("@", "host")}
                                        className="p-0.5 rounded text-white/20 hover:text-white/50 transition-colors"
                                      >
                                        {dnsCopied === "host" ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                      </button>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-xs font-mono text-white/70 truncate">webfacelift.app</span>
                                      <button
                                        onClick={() => handleCopyDns("webfacelift.app", "value")}
                                        className="p-0.5 rounded text-white/20 hover:text-white/50 transition-colors shrink-0"
                                      >
                                        {dnsCopied === "value" ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <p className="text-[10px] text-amber-400/40 mt-2.5 leading-relaxed">
                                  If your registrar doesn&apos;t support CNAME on root (@), use <strong className="text-amber-400/60">www</strong> as the host, or use an ALIAS/ANAME record instead. DNS changes can take up to 48 hours to propagate.
                                </p>
                              </div>

                              {/* Verify button */}
                              <button
                                onClick={handleVerifyDomain}
                                disabled={domainVerifying}
                                className="w-full px-4 py-2.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                              >
                                {domainVerifying ? (
                                  <>
                                    <Loader2 size={13} className="animate-spin" />
                                    Checking DNS...
                                  </>
                                ) : (
                                  <>
                                    <Globe size={13} />
                                    Verify Domain
                                  </>
                                )}
                              </button>

                              {verifyMessage && (
                                <p className="text-[11px] text-amber-400/60 text-center">{verifyMessage}</p>
                              )}
                            </div>
                          )}

                          {/* Domain verified success state */}
                          {savedDomain && domainVerified && (
                            <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/[0.06] border border-green-500/15">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="text-green-400" />
                                <div>
                                  <p className="text-xs font-medium text-green-400">Domain verified & live</p>
                                  <p className="text-[10px] text-green-400/50 mt-0.5">SSL certificate active</p>
                                </div>
                              </div>
                              <a
                                href={`https://${savedDomain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] text-green-400 hover:bg-green-500/10 transition-colors"
                              >
                                Visit <ExternalLink size={10} />
                              </a>
                            </div>
                          )}

                          {!savedDomain && (
                            <p className="text-[10px] text-white/20 leading-relaxed">
                              Optional — your site is always available via its share link. A custom domain gives it a professional URL.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ───── LINK TAB ───── */}
          {tab === "link" && (
            <div className="space-y-4">
              {linkLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={16} className="text-white/30 animate-spin" />
                </div>
              ) : !shareLink ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                    <Link2 size={20} className="text-white/20" />
                  </div>
                  <p className="text-xs text-white/40 mb-4">
                    Create a public link anyone can use to view this project.
                  </p>
                  <button
                    onClick={handleCreateLink}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                  >
                    Create Share Link
                  </button>
                </div>
              ) : (
                <>
                  {/* Toggle */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.08]">
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
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        shareLink.is_active ? "bg-indigo-600" : "bg-zinc-700"
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${
                          shareLink.is_active ? "left-[22px]" : "left-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* URL + Copy */}
                  {shareLink.is_active && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800 border border-white/10">
                      <span className="flex-1 text-xs text-white/50 truncate font-mono">
                        {getShareUrl()}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors shrink-0"
                        title="Copy link"
                      >
                        {copied ? (
                          <Check size={14} className="text-green-400" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <a
                        href={getShareUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-white transition-colors shrink-0"
                        title="Open in new tab"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ───── PEOPLE TAB ───── */}
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
                  className="flex-1 px-3 py-2.5 rounded-lg bg-zinc-800 border border-white/10 text-white text-sm placeholder:text-white/20 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                />
                <div className="relative">
                  <select
                    value={inviteRole}
                    onChange={(e) =>
                      setInviteRole(e.target.value as "viewer" | "editor")
                    }
                    className="appearance-none px-3 py-2.5 pr-7 rounded-lg bg-zinc-800 border border-white/10 text-white text-xs outline-none cursor-pointer"
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
                  className="px-4 py-2.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-40"
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
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
                    <Users size={20} className="text-white/20" />
                  </div>
                  <p className="text-xs text-white/30">
                    No collaborators yet. Invite someone by email.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {collaborators.map((collab) => (
                    <div
                      key={collab.id}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-zinc-800/50 border border-white/[0.06]"
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
                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
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
