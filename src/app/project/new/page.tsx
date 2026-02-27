"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { scrapeAndGenerate } from "@/actions/scrapeAndGenerate";
import { createProject } from "@/actions/projects";
import { useProjectStore } from "@/store/project-store";
import { Zap, Loader2, AlertCircle, Globe } from "lucide-react";

const statusMessages = [
  "Connecting to target site...",
  "Scraping original content...",
  "Analyzing site structure...",
  "Extracting key content blocks...",
  "Designing modern blueprint...",
  "Generating component layout...",
  "Applying modern aesthetics...",
  "Finalizing blueprint...",
];

function NewProjectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "";
  const hasStarted = useRef(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);

  const runGeneration = useCallback(async () => {
    if (!url) {
      setError("No URL provided.");
      return;
    }

    const result = await scrapeAndGenerate(url);

    if (!result.success || !result.blueprint) {
      setError(result.error || "Generation failed.");
      return;
    }

    setBlueprint(result.blueprint);

    // Try to save as a project (may fail if not authenticated)
    const projectRes = await createProject(url, result.blueprint);

    if (projectRes.success && projectRes.project) {
      router.replace(`/project/${projectRes.project.id}`);
    } else {
      // If not authenticated, go to a demo workspace
      router.replace(`/project/demo?url=${encodeURIComponent(url)}`);
    }
  }, [url, setBlueprint, router]);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    runGeneration();
  }, [runGeneration]);

  useEffect(() => {
    if (error) return;
    const interval = setInterval(() => {
      setStatusIdx((prev) =>
        prev < statusMessages.length - 1 ? prev + 1 : prev
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [error]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={20} className="text-red-400" />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2">
            Generation Failed
          </h2>
          <p className="text-sm text-white/50 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
          >
            Try another URL
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-8">
          <Zap size={24} className="text-indigo-400 animate-pulse" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          Reconstructing the bones
        </h2>

        <div className="flex items-center gap-2 justify-center text-white/30 text-xs mb-8">
          <Globe size={12} />
          <span className="truncate max-w-[200px]">{url}</span>
        </div>

        <div className="space-y-2">
          {statusMessages.map((msg, i) => (
            <div
              key={msg}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500 ${
                i < statusIdx
                  ? "bg-white/[0.02] text-white/40"
                  : i === statusIdx
                  ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
                  : "text-white/10"
              }`}
            >
              {i < statusIdx ? (
                <div className="w-4 h-4 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>
              ) : i === statusIdx ? (
                <Loader2
                  size={14}
                  className="text-indigo-400 animate-spin shrink-0"
                />
              ) : (
                <div className="w-4 h-4 rounded-full border border-white/10 shrink-0" />
              )}
              <span className="text-sm text-left">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NewProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="text-white/30 animate-spin" />
        </div>
      }
    >
      <NewProjectContent />
    </Suspense>
  );
}
