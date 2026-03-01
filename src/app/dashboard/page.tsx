"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUserProjects, deleteProject } from "@/actions/projects";
import { getSharedProjects } from "@/actions/sharing";
import { getCredits } from "@/actions/credits";
import type { Project } from "@/types/blueprint";
import type { SharedProject } from "@/types/sharing";
import {
  Plus,
  Globe,
  Trash2,
  ExternalLink,
  Zap,
  Loader2,
  LogOut,
  CreditCard,
  Users,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<SharedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProjects();
    getCredits().then((res) => setCredits(res.credits));
  }, []);

  async function loadProjects() {
    const [res, sharedRes] = await Promise.all([
      getUserProjects(),
      getSharedProjects(),
    ]);
    if (res.success && res.projects) {
      setProjects(res.projects);
    }
    if (sharedRes.success && sharedRes.projects) {
      setSharedWithMe(sharedRes.projects);
    }
    setLoading(false);
  }

  function handleNewProject() {
    if (!url.trim()) return;
    router.push(`/project/new?url=${encodeURIComponent(url.trim())}`);
  }

  async function handleDelete(id: string) {
    try {
      await deleteProject(id);
      setProjects((p) => p.filter((proj) => proj.id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Failed to delete project");
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              webfacelift
            </span>
          </div>
          <div className="flex items-center gap-2">
            {credits !== null && (
              <button
                onClick={() => router.push("/buy")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Zap size={12} className="text-indigo-400" />
                {credits} credit{credits !== 1 ? "s" : ""}
                <CreditCard size={11} className="text-white/30 ml-1" />
              </button>
            )}
            <button
              onClick={async () => {
                const supabase = createClient();
                await supabase.auth.signOut();
                router.push("/");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Your Projects
            </h1>
            <p className="text-sm text-white/40 mt-1">
              Manage your website reconstructions
            </p>
          </div>
        </div>

        {/* New project input */}
        <div className="mb-10 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Plus size={14} className="text-indigo-400" />
            New Reconstruction
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-zinc-900 border border-white/10 focus-within:border-indigo-500/50 transition-colors">
              <Globe size={16} className="text-white/30" />
              <input
                type="url"
                placeholder="https://outdated-business-site.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNewProject()}
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 outline-none"
              />
            </div>
            <button
              onClick={handleNewProject}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all whitespace-nowrap"
            >
              Reconstruct
            </button>
          </div>
        </div>

        {/* Projects grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={20} className="text-white/30 animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="space-y-8">
            {/* Welcome */}
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-600/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Welcome to webfacelift
              </h2>
              <p className="text-sm text-white/40 max-w-md mx-auto">
                Reconstruct any outdated website into a modern design in minutes.
                Here&apos;s how to get started:
              </p>
            </div>

            {/* How it works steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                {
                  step: "1",
                  icon: Globe,
                  title: "Paste a URL",
                  desc: "Enter any business website URL in the input above",
                },
                {
                  step: "2",
                  icon: Sparkles,
                  title: "AI rebuilds it",
                  desc: "Our AI scrapes and reconstructs a modern blueprint",
                },
                {
                  step: "3",
                  icon: MessageSquare,
                  title: "Iterate via chat",
                  desc: "Refine colors, layout, and content through conversation",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <div className="w-6 h-6 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[11px] font-bold text-indigo-400">
                      {item.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-0.5">
                      {item.title}
                    </h3>
                    <p className="text-xs text-white/35 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Try a demo URL */}
            <div className="max-w-lg mx-auto">
              <p className="text-xs text-white/30 text-center mb-3">
                Try one of these example sites to see it in action:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { label: "Local plumber", url: "https://www.acehandymanservices.com" },
                  { label: "Law firm", url: "https://www.legalmatch.com" },
                  { label: "Restaurant", url: "https://www.olivegarden.com" },
                ].map((demo) => (
                  <button
                    key={demo.url}
                    onClick={() => {
                      router.push(
                        `/project/new?url=${encodeURIComponent(demo.url)}`
                      );
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-white/50 hover:text-white hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all"
                  >
                    {demo.label}
                    <ArrowRight size={10} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                      {project.site_name || "Untitled Project"}
                    </h3>
                    <p className="text-xs text-white/30 truncate mt-0.5">
                      {project.original_url}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.original_url, "_blank");
                      }}
                      className="p-1.5 rounded-md hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id);
                      }}
                      className="p-1.5 rounded-md hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-white/20 font-mono">
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Shared with me */}
        {sharedWithMe.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-2 mb-6">
              <Users size={16} className="text-indigo-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">
                Shared with me
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sharedWithMe.map((project) => (
                <div
                  key={project.id}
                  className="group p-5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 transition-all cursor-pointer"
                  onClick={() => router.push(`/project/${project.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">
                        {project.site_name || "Untitled Project"}
                      </h3>
                      <p className="text-xs text-white/30 truncate mt-0.5">
                        {project.original_url}
                      </p>
                    </div>
                    <span
                      className={`ml-2 shrink-0 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        project.role === "editor"
                          ? "bg-indigo-500/15 text-indigo-400"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      {project.role}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/20 truncate">
                      by {project.owner_email}
                    </span>
                    <span className="text-[10px] text-white/20 font-mono">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
