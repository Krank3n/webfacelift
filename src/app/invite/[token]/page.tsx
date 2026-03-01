"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { acceptInvite, declineInvite } from "@/actions/sharing";
import { Zap, Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "accepted" | "declined" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [projectId, setProjectId] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    const res = await acceptInvite(token);
    if (res.success && res.projectId) {
      setStatus("accepted");
      setProjectId(res.projectId);
      setTimeout(() => router.push(`/project/${res.projectId}`), 1500);
    } else {
      setStatus("error");
      setErrorMsg(res.error || "Failed to accept invite.");
    }
    setLoading(false);
  }

  async function handleDecline() {
    setLoading(true);
    const res = await declineInvite(token);
    if (res.success) {
      setStatus("declined");
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setStatus("error");
      setErrorMsg(res.error || "Failed to decline invite.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="max-w-sm w-full mx-4 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4">
          <Zap size={18} className="text-white" />
        </div>

        {status === "idle" && (
          <>
            <h1 className="text-lg font-bold text-white mb-1">
              Project Invitation
            </h1>
            <p className="text-sm text-white/40 mb-6">
              You&apos;ve been invited to collaborate on a project.
            </p>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={handleDecline}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all disabled:opacity-40"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Accept Invite"
                )}
              </button>
            </div>
          </>
        )}

        {status === "accepted" && (
          <>
            <CheckCircle2 size={24} className="text-green-400 mx-auto mb-3" />
            <h2 className="text-sm font-semibold text-white mb-1">
              Invite Accepted
            </h2>
            <p className="text-xs text-white/40">Redirecting to project...</p>
          </>
        )}

        {status === "declined" && (
          <>
            <XCircle size={24} className="text-white/40 mx-auto mb-3" />
            <h2 className="text-sm font-semibold text-white mb-1">
              Invite Declined
            </h2>
            <p className="text-xs text-white/40">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={24} className="text-red-400 mx-auto mb-3" />
            <h2 className="text-sm font-semibold text-white mb-1">Error</h2>
            <p className="text-xs text-red-400/80">{errorMsg}</p>
            <button
              onClick={() => router.push("/dashboard")}
              className="mt-4 px-4 py-2 text-xs text-white/50 hover:text-white/80 rounded-lg hover:bg-white/5 transition-colors"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
