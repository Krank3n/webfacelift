"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/project-store";
import { getProject } from "@/actions/projects";
import ChatPanel from "@/components/workspace/ChatPanel";
import MediaPanel from "@/components/workspace/MediaPanel";
import PagesPanel from "@/components/workspace/PagesPanel";
import PreviewCanvas from "@/components/workspace/PreviewCanvas";
import MobileSheet from "@/components/workspace/MobileSheet";
import type { BlueprintState } from "@/types/blueprint";
import ShareModal from "@/components/workspace/ShareModal";
import { getMyPermission } from "@/actions/sharing";
import {
  Zap,
  MessageSquare,
  ImagePlus,
  FileText,
  ArrowLeft,
  Loader2,
  Code2,
  Share2,
  Eye,
} from "lucide-react";

type Tab = "chat" | "pages" | "media" | "json";

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [loading, setLoading] = useState(true);
  const [showJson, setShowJson] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const projectId = useProjectStore((s) => s.projectId);
  const blueprint = useProjectStore((s) => s.blueprint);
  const isChatLoading = useProjectStore((s) => s.isChatLoading);
  const setProjectId = useProjectStore((s) => s.setProjectId);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);
  const setOriginalUrl = useProjectStore((s) => s.setOriginalUrl);
  const permission = useProjectStore((s) => s.permission);
  const setPermission = useProjectStore((s) => s.setPermission);
  const setPreviewMode = useProjectStore((s) => s.setPreviewMode);

  useEffect(() => {
    async function load() {
      // Demo mode: blueprint already in store from new page
      if (id === "demo") {
        setProjectId("demo");
        setPermission("owner");
        setLoading(false);
        return;
      }

      // If we already have this project loaded, skip fetch
      if (projectId === id && blueprint) {
        setLoading(false);
        return;
      }

      // Fetch project and permission in parallel
      const [res, permRes] = await Promise.all([
        getProject(id),
        getMyPermission(id),
      ]);

      if (res.success && res.project) {
        setProjectId(res.project.id);
        setOriginalUrl(res.project.original_url);
        if (res.project.current_json_state) {
          setBlueprint(res.project.current_json_state);
        }
      }

      if (permRes.success) {
        setPermission(permRes.permission);
        // Viewers are forced into preview mode
        if (permRes.permission === "viewer") {
          setPreviewMode("preview");
        }
      }

      setLoading(false);
    }

    load();
  }, [id, projectId, blueprint, setProjectId, setBlueprint, setOriginalUrl, setPermission, setPreviewMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={20} className="text-white/30 animate-spin" />
      </div>
    );
  }

  const isViewer = permission === "viewer";

  const tabs = isViewer
    ? [
        { key: "pages" as Tab, label: "Pages", icon: FileText },
        { key: "json" as Tab, label: "JSON", icon: Code2 },
      ]
    : [
        { key: "chat" as Tab, label: "Chat", icon: MessageSquare },
        { key: "pages" as Tab, label: "Pages", icon: FileText },
        { key: "media" as Tab, label: "Media", icon: ImagePlus },
        { key: "json" as Tab, label: "JSON", icon: Code2 },
      ];

  function renderTabSwitcher() {
    return (
      <div className="px-2 py-2 border-b border-white/[0.06] flex items-center gap-1 shrink-0">
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
    );
  }

  function renderTabContent() {
    return (
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" && <ChatPanel />}
        {activeTab === "pages" && <PagesPanel />}
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
    );
  }

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
              webfacelift
            </span>
          </div>
          {blueprint?.siteName && (
            <>
              <span className="text-white/10">/</span>
              <span className="text-xs text-white/40 truncate max-w-[120px] md:max-w-[200px]">
                {blueprint.siteName}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isViewer && (
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] text-white/40">
              <Eye size={11} />
              View only
            </span>
          )}
          {permission === "owner" && id !== "demo" && (
            <button
              onClick={() => setShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Share2 size={13} />
              Share
            </button>
          )}
        </div>
      </header>

      {/* Main workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar — hidden on mobile */}
        <div className="hidden md:flex w-[300px] shrink-0 border-r border-white/[0.06] flex-col bg-zinc-950">
          {renderTabSwitcher()}
          {renderTabContent()}
        </div>

        {/* Preview Canvas — full width on mobile */}
        <div className="flex-1 relative overflow-hidden">
          <PreviewCanvas />
        </div>
      </div>

      {/* Mobile: FAB + Bottom Sheet */}
      <div className="md:hidden">
        {!sheetOpen && (
          <button
            onClick={() => setSheetOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 active:scale-90 transition-transform"
          >
            <MessageSquare size={22} className="text-white" />
            {isChatLoading && (
              <span className="absolute inset-0 rounded-full border-2 border-indigo-400/60 animate-ping" />
            )}
          </button>
        )}

        <MobileSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)}>
          {renderTabSwitcher()}
          {renderTabContent()}
        </MobileSheet>
      </div>

      {/* Share Modal — only rendered for owners */}
      {permission === "owner" && id !== "demo" && (
        <ShareModal
          open={shareOpen}
          projectId={id}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
