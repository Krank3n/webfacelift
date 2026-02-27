"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/project-store";
import { getProject } from "@/actions/projects";
import ChatPanel from "@/components/workspace/ChatPanel";
import MediaPanel from "@/components/workspace/MediaPanel";
import PreviewCanvas from "@/components/workspace/PreviewCanvas";
import type { BlueprintState } from "@/types/blueprint";
import {
  Zap,
  MessageSquare,
  ImagePlus,
  ArrowLeft,
  Loader2,
  Code2,
} from "lucide-react";

type Tab = "chat" | "media" | "json";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);

  const projectId = useProjectStore((s) => s.projectId);
  const blueprint = useProjectStore((s) => s.blueprint);
  const setProjectId = useProjectStore((s) => s.setProjectId);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);
  const setOriginalUrl = useProjectStore((s) => s.setOriginalUrl);

  useEffect(() => {
    async function load() {
      // Demo mode: blueprint already in store from new page
      if (id === "demo") {
        setProjectId("demo");
        setLoading(false);
        return;
      }

      // If we already have this project loaded, skip fetch
      if (projectId === id && blueprint) {
        setLoading(false);
        return;
      }

      const res = await getProject(id);
      if (res.success && res.project) {
        setProjectId(res.project.id);
        setOriginalUrl(res.project.original_url);
        if (res.project.current_json_state) {
          setBlueprint(res.project.current_json_state);
        }
      }
      setLoading(false);
    }

    load();
  }, [id, projectId, blueprint, setProjectId, setBlueprint, setOriginalUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={20} className="text-white/30 animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: "chat" as Tab, label: "Chat", icon: MessageSquare },
    { key: "media" as Tab, label: "Media", icon: ImagePlus },
    { key: "json" as Tab, label: "JSON", icon: Code2 },
  ];

  return (
    <div className="h-screen flex flex-col bg-zinc-950 overflow-hidden">
      {/* Top bar */}
      <header className="h-12 shrink-0 border-b border-white/[0.06] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-1 rounded-md hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-white">
              webfacelift<span className="text-indigo-400">.io</span>
            </span>
          </div>
          {blueprint?.siteName && (
            <>
              <span className="text-white/10">/</span>
              <span className="text-xs text-white/40 truncate max-w-[200px]">
                {blueprint.siteName}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left pane - 300px fixed */}
        <div className="w-[300px] shrink-0 border-r border-white/[0.06] flex flex-col bg-zinc-950">
          {/* Tab switcher */}
          <div className="px-2 py-2 border-b border-white/[0.06] flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (tab.key === "json") setShowJson(true);
                  else setShowJson(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors ${
                  activeTab === tab.key
                    ? "bg-white/5 text-white"
                    : "text-white/30 hover:text-white/50 hover:bg-white/[0.02]"
                }`}
              >
                <tab.icon size={12} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" && <ChatPanel />}
            {activeTab === "media" && <MediaPanel />}
            {activeTab === "json" && (
              <div className="h-full overflow-auto p-4">
                <pre className="text-[11px] text-white/40 font-mono leading-relaxed whitespace-pre-wrap break-all">
                  {blueprint
                    ? JSON.stringify(blueprint, null, 2)
                    : "No blueprint loaded"}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right pane - Preview Canvas */}
        <div className="flex-1 relative overflow-hidden">
          <PreviewCanvas />
        </div>
      </div>
    </div>
  );
}
