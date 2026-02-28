"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { scrapeAndGenerate } from "@/actions/scrapeAndGenerate";
import { createProject } from "@/actions/projects";
import { useProjectStore } from "@/store/project-store";
import {
  Zap,
  Loader2,
  AlertCircle,
  Globe,
  Check,
  Brain,
  Clock,
  Sparkles,
} from "lucide-react";

/* ================================================================== */
/*  Pipeline stages with realistic thinking messages                   */
/* ================================================================== */

const PIPELINE_STAGES = [
  {
    id: "scraping",
    label: "Scraping website",
    icon: Globe,
    duration: 12,
    thoughts: [
      "Connecting to target site...",
      "Downloading homepage content...",
      "Discovering internal pages...",
      "Scraping priority subpages...",
      "Extracting images & media assets...",
      "Processing and upscaling images...",
    ],
  },
  {
    id: "analyzing",
    label: "Analyzing content",
    icon: Brain,
    duration: 10,
    thoughts: [
      "Identifying business type & niche...",
      "Cataloging content sections...",
      "Mapping navigation structure...",
      "Extracting business information...",
      "Evaluating visual assets...",
      "Building structured content brief...",
    ],
  },
  {
    id: "designing",
    label: "Design consultation",
    icon: Sparkles,
    duration: 6,
    thoughts: [
      "Evaluating layout patterns...",
      "Selecting typography pairings...",
      "Defining color palette...",
      "Planning section flow & rhythm...",
      "Optimizing visual hierarchy...",
    ],
  },
  {
    id: "blueprint",
    label: "Building blueprint",
    icon: Zap,
    duration: 17,
    thoughts: [
      "Mapping content to components...",
      "Constructing hero section...",
      "Designing service showcases...",
      "Building gallery layouts...",
      "Generating pricing displays...",
      "Assembling navigation & footer...",
      "Applying color scheme & styles...",
      "Validating final structure...",
    ],
  },
];

const TOTAL_ESTIMATED_SECONDS = PIPELINE_STAGES.reduce(
  (sum, s) => sum + s.duration,
  0
);

/* ================================================================== */
/*  Component                                                          */
/* ================================================================== */

function NewProjectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "";
  const hasStarted = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);
  const existingBlueprint = useProjectStore((s) => s.blueprint);

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [stageProgress, setStageProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const runGeneration = useCallback(async () => {
    if (!url) {
      setError("No URL provided.");
      return;
    }

    if (existingBlueprint) {
      router.replace(`/project/demo?url=${encodeURIComponent(url)}`);
      return;
    }

    const result = await scrapeAndGenerate(url);

    if (!result.success || !result.blueprint) {
      setError(result.error || "Generation failed.");
      return;
    }

    setIsComplete(true);
    setBlueprint(result.blueprint);

    // Brief pause to show completion state
    await new Promise((r) => setTimeout(r, 800));

    const projectRes = await createProject(url, result.blueprint);

    if (projectRes.success && projectRes.project) {
      router.replace(`/project/${projectRes.project.id}`);
    } else {
      router.replace(`/project/demo?url=${encodeURIComponent(url)}`);
    }
  }, [url, existingBlueprint, setBlueprint, router]);

  // Start generation
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    runGeneration();
  }, [runGeneration]);

  // Elapsed timer
  useEffect(() => {
    if (error || isComplete) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [error, isComplete]);

  // Stage progression based on elapsed time
  useEffect(() => {
    if (error || isComplete) return;
    let accumulated = 0;
    for (let i = 0; i < PIPELINE_STAGES.length; i++) {
      const stageEnd = accumulated + PIPELINE_STAGES[i].duration;
      if (elapsedSeconds < stageEnd) {
        setCurrentStageIndex(i);
        setStageProgress(
          (elapsedSeconds - accumulated) / PIPELINE_STAGES[i].duration
        );
        return;
      }
      accumulated = stageEnd;
    }
    // Past estimated time — stay on last stage
    setCurrentStageIndex(PIPELINE_STAGES.length - 1);
    setStageProgress(1);
  }, [elapsedSeconds, error, isComplete]);

  // Rotate thinking messages
  useEffect(() => {
    if (error || isComplete) return;
    const stage = PIPELINE_STAGES[currentStageIndex];
    const interval = setInterval(() => {
      setCurrentThoughtIndex((prev) => (prev + 1) % stage.thoughts.length);
    }, 2500);
    setCurrentThoughtIndex(0);
    return () => clearInterval(interval);
  }, [currentStageIndex, error, isComplete]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Overall progress 0–100 (capped at 95 until truly complete)
  const overallProgress = isComplete
    ? 100
    : Math.min(
        95,
        ((PIPELINE_STAGES.slice(0, currentStageIndex).reduce(
          (sum, s) => sum + s.duration,
          0
        ) +
          stageProgress * PIPELINE_STAGES[currentStageIndex].duration) /
          TOTAL_ESTIMATED_SECONDS) *
          100
      );

  const currentStage = PIPELINE_STAGES[currentStageIndex];
  const currentThought = currentStage.thoughts[currentThoughtIndex];

  /* ---------------------------------------------------------------- */
  /*  Error state                                                      */
  /* ---------------------------------------------------------------- */
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="max-w-md w-full mx-auto px-6 text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={24} className="text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Generation Failed
          </h2>
          <p className="text-sm text-white/50 mb-8 leading-relaxed">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all duration-200 hover:border-white/20"
          >
            Try another URL
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Loading state                                                    */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center relative overflow-hidden">
      {/* ── Ambient background glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/[0.07] rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-500/[0.05] rounded-full blur-[100px]"
          style={{ animation: "pulse 4s ease-in-out infinite 1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/[0.03] rounded-full blur-[80px]"
          style={{ animation: "pulse 5s ease-in-out infinite 2s" }}
        />
      </div>

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="max-w-lg w-full mx-auto px-6 relative z-10">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          {/* Animated icon with orbiting dot */}
          <div className="relative w-16 h-16 mx-auto mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center">
              <Zap
                size={28}
                className="text-indigo-400"
                style={{ animation: "pulse 2s ease-in-out infinite" }}
              />
            </div>
            <div
              className="absolute w-1.5 h-1.5 rounded-full bg-indigo-400/60"
              style={{
                animation: "orbit 3s linear infinite",
                top: "50%",
                left: "50%",
              }}
            />
          </div>

          <h2 className="text-2xl font-bold text-white mb-1.5 tracking-tight">
            Reconstructing the bones
          </h2>
          <div className="flex items-center gap-2 justify-center text-white/25 text-xs">
            <Globe size={11} />
            <span className="truncate max-w-[220px] font-mono">{url}</span>
          </div>
        </div>

        {/* ── Progress bar ── */}
        <div className="mb-6">
          <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out relative"
              style={{
                width: `${overallProgress}%`,
                background:
                  "linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  animation: "shimmer 2s ease-in-out infinite",
                  backgroundSize: "200% 100%",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Timer row ── */}
        <div className="flex items-center justify-between text-xs mb-8 px-1">
          <div className="flex items-center gap-1.5 text-white/40">
            <Clock size={12} />
            <span className="font-mono tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
            <span className="text-white/20">elapsed</span>
          </div>
          <div className="text-white/20 font-mono tabular-nums">
            ~{formatTime(TOTAL_ESTIMATED_SECONDS)} estimated
          </div>
        </div>

        {/* ── AI Thinking card ── */}
        <div className="mb-8 rounded-xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.04] flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400/60 animate-pulse" />
              <div
                className="w-1.5 h-1.5 rounded-full bg-violet-400/40"
                style={{ animation: "pulse 2s ease-in-out infinite 0.3s" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-indigo-400/30"
                style={{ animation: "pulse 2s ease-in-out infinite 0.6s" }}
              />
            </div>
            <span className="text-[11px] text-white/30 uppercase tracking-wider font-medium">
              AI is thinking
            </span>
          </div>
          <div className="px-4 py-3.5 min-h-[52px] flex items-center">
            <p
              key={`${currentStageIndex}-${currentThoughtIndex}`}
              className="text-sm text-white/50 italic leading-relaxed animate-fade-in"
            >
              &ldquo;{currentThought}&rdquo;
            </p>
          </div>
        </div>

        {/* ── Stage list ── */}
        <div className="space-y-1">
          {PIPELINE_STAGES.map((stage, i) => {
            const StageIcon = stage.icon;
            const isCompleted = isComplete || i < currentStageIndex;
            const isCurrent = !isComplete && i === currentStageIndex;

            return (
              <div
                key={stage.id}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
                  isCompleted
                    ? "text-white/30"
                    : isCurrent
                    ? "bg-indigo-500/[0.08] border border-indigo-500/15 text-indigo-300"
                    : "text-white/10"
                }`}
              >
                {/* Status icon */}
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-indigo-500/15 flex items-center justify-center">
                      <Check size={11} className="text-indigo-400/70" />
                    </div>
                  ) : isCurrent ? (
                    <Loader2
                      size={15}
                      className="text-indigo-400 animate-spin"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-white/[0.08]" />
                  )}
                </div>

                {/* Stage icon */}
                <StageIcon
                  size={14}
                  className={
                    isCompleted
                      ? "text-white/20"
                      : isCurrent
                      ? "text-indigo-400/70"
                      : "text-white/[0.06]"
                  }
                />

                {/* Label */}
                <span className="text-sm font-medium">{stage.label}</span>

                {/* Duration hint for current stage */}
                {isCurrent && (
                  <span className="ml-auto text-[10px] text-indigo-400/40 font-mono tabular-nums">
                    ~{stage.duration}s
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Completion flash ── */}
        {isComplete && (
          <div className="mt-8 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Check size={14} />
              Blueprint ready — loading workspace...
            </div>
          </div>
        )}
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
