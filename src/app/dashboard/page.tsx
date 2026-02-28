"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getUserProjects, deleteProject } from "@/actions/projects";
import { getCredits } from "@/actions/credits";
import type { Project } from "@/types/blueprint";
import {
  Plus,
  Globe,
  Trash2,
  ExternalLink,
  Zap,
  Loader2,
  LogOut,
  CreditCard,
} from "lucide-react";

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState("");
  const [credits, setCredits] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProjects();
    getCredits().then((res) => setCredits(res.credits));
  }, []);

  async function loadProjects() {
    const res = await getUserProjects();
    if (res.success && res.projects) {
      setProjects(res.projects);
    }
    setLoading(false);
  }

  function handleNewProject() {
    if (!url.trim()) return;
    router.push(`/project/new?url=${encodeURIComponent(url.trim())}`);
  }

  async function handleDelete(id: string) {
    await deleteProject(id);
    setProjects((p) => p.filter((proj) => proj.id !== id));
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
              webfacelift<span className="text-indigo-400">.io</span>
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
          <div className="text-center py-20">
            <p className="text-white/30 text-sm">
              No projects yet. Paste a URL above to get started.
            </p>
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
      </div>
    </div>
  );
}
