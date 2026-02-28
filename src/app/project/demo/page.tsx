"use client";

import { useEffect, Suspense, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/store/project-store";
import {
  syncDemoToSession,
  loadDemoFromSession,
  clearDemoSession,
} from "@/store/project-store";
import { createClient } from "@/lib/supabase/client";
import { createProject } from "@/actions/projects";
import ChatPanel from "@/components/workspace/ChatPanel";
import MediaPanel from "@/components/workspace/MediaPanel";
import PagesPanel from "@/components/workspace/PagesPanel";
import PreviewCanvas from "@/components/workspace/PreviewCanvas";
import MobileSheet from "@/components/workspace/MobileSheet";
import {
  Zap,
  MessageSquare,
  ImagePlus,
  FileText,
  ArrowLeft,
  Code2,
  Loader2,
  LogIn,
  Save,
} from "lucide-react";

type Tab = "chat" | "pages" | "media" | "json";

function DemoWorkspaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "";

  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const blueprint = useProjectStore((s) => s.blueprint);
  const chatMessages = useProjectStore((s) => s.chatMessages);
  const uploadedImages = useProjectStore((s) => s.uploadedImages);
  const originalUrl = useProjectStore((s) => s.originalUrl);
  const isChatLoading = useProjectStore((s) => s.isChatLoading);
  const setProjectId = useProjectStore((s) => s.setProjectId);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);
  const setChatMessages = useProjectStore((s) => s.setChatMessages);
  const setOriginalUrl = useProjectStore((s) => s.setOriginalUrl);

  // Check auth status
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsSignedIn(!!user);
    });
  }, []);

  // Set project ID + hydrate from sessionStorage if needed
  useEffect(() => {
    setProjectId("demo");

    if (!blueprint) {
      const saved = loadDemoFromSession();
      if (saved) {
        setBlueprint(saved.blueprint);
        setChatMessages(saved.chatMessages);
        if (saved.originalUrl) setOriginalUrl(saved.originalUrl);
      }
    }
  }, [setProjectId, blueprint, setBlueprint, setChatMessages, setOriginalUrl]);

  // Store original URL from search params
  useEffect(() => {
    if (url) setOriginalUrl(url);
  }, [url, setOriginalUrl]);

  // Sync to sessionStorage on changes
  useEffect(() => {
    if (blueprint) {
      syncDemoToSession({ blueprint, chatMessages, uploadedImages, originalUrl });
    }
  }, [blueprint, chatMessages, uploadedImages, originalUrl]);

  const handleSave = useCallback(async () => {
    if (!blueprint) return;
    setIsSaving(true);
    const siteUrl = originalUrl || url || "unknown";
    const result = await createProject(siteUrl, blueprint);
    if (result.success && result.project) {
      clearDemoSession();
      router.replace(`/project/${result.project.id}`);
    }
    setIsSaving(false);
  }, [blueprint, originalUrl, url, router]);

  const tabs = [
    { key: "chat" as Tab, label: "Chat", icon: MessageSquare },
    { key: "pages" as Tab, label: "Pages", icon: FileText },
    { key: "media" as Tab, label: "Media", icon: ImagePlus },
    { key: "json" as Tab, label: "JSON", icon: Code2 },
  ];

  if (!blueprint) {
    const saved = loadDemoFromSession();
    if (!saved) {
      return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 text-sm mb-4">
              No blueprint found. Generate one first.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
            >
              Go to home
            </button>
          </div>
        </div>
      );
    }
  }

  function renderTabSwitcher() {
    return (
      <div className="px-2 py-2 border-b border-white/[0.06] flex items-center gap-1 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
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
      <header className="h-12 shrink-0 border-b border-white/[0.06] px-3 md:px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <button
            onClick={() => router.push("/")}
            className="p-1 rounded-md hover:bg-white/5 text-white/30 hover:text-white/60 transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-xs font-semibold text-white hidden sm:inline">
              webfacelift<span className="text-indigo-400">.io</span>
            </span>
          </div>
          <span className="text-white/10 hidden sm:inline">/</span>
          <span className="text-xs text-white/40 truncate max-w-[100px] sm:max-w-[200px]">
            {blueprint?.siteName || "Demo"}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isSignedIn === false && (
            <button
              onClick={() =>
                router.push(
                  `/login?redirect=${encodeURIComponent("/project/demo" + (url ? `?url=${encodeURIComponent(url)}` : ""))}`
                )
              }
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-xs text-indigo-300 hover:bg-indigo-600/30 transition-colors"
            >
              <LogIn size={12} />
              <span className="hidden sm:inline">Sign in to save</span>
            </button>
          )}
          {isSignedIn === true && (
            <button
              onClick={handleSave}
              disabled={isSaving || !blueprint}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-xs text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              <span className="hidden sm:inline">Save project</span>
            </button>
          )}
        </div>
      </header>

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
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="text-white/30 animate-spin" />
        </div>
      }
    >
      <DemoWorkspaceContent />
    </Suspense>
  );
}
