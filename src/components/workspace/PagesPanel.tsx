"use client";

import { useState } from "react";
import { useProjectStore } from "@/store/project-store";
import { syncDemoToSession } from "@/store/project-store";
import { updateProjectState } from "@/actions/projects";
import { generatePage } from "@/actions/generatePage";
import { getBlueprintPages, MAX_FREE_PAGES } from "@/lib/blueprint-utils";
import type { DiscoveredPage } from "@/types/blueprint";
import {
  FileText,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Lock,
  Globe,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

export default function PagesPanel() {
  const blueprint = useProjectStore((s) => s.blueprint);
  const projectId = useProjectStore((s) => s.projectId);
  const activePageId = useProjectStore((s) => s.activePageId);
  const setActivePageId = useProjectStore((s) => s.setActivePageId);
  const addPage = useProjectStore((s) => s.addPage);
  const removePage = useProjectStore((s) => s.removePage);
  const renamePage = useProjectStore((s) => s.renamePage);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);
  const generatingPageUrl = useProjectStore((s) => s.generatingPageUrl);
  const setGeneratingPageUrl = useProjectStore((s) => s.setGeneratingPageUrl);
  const markPageGenerated = useProjectStore((s) => s.markPageGenerated);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  if (!blueprint) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-xs text-white/20">No blueprint loaded</p>
      </div>
    );
  }

  const pages = getBlueprintPages(blueprint);
  const resolvedActiveId = activePageId ?? pages[0]?.id;
  const atLimit = pages.length >= MAX_FREE_PAGES;
  const discovered = blueprint.discoveredPages ?? [];

  function handleAdd() {
    const num = pages.length + 1;
    const name = `Page ${num}`;
    addPage({
      id: crypto.randomUUID(),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      layout: [],
    });
  }

  async function handleGenerate(dp: DiscoveredPage) {
    if (!blueprint || atLimit || generatingPageUrl) return;

    setGeneratingPageUrl(dp.url);
    try {
      const result = await generatePage(dp.url, dp.name, blueprint);
      if (result.success && result.page) {
        // Add the generated page to the store
        addPage(result.page);
        // Remove from discovered list
        markPageGenerated(dp.url);

        // Persist
        const state = useProjectStore.getState();
        if (projectId === "demo") {
          syncDemoToSession({
            blueprint: state.blueprint!,
            chatMessages: state.chatMessages,
            uploadedImages: state.uploadedImages,
            originalUrl: state.originalUrl,
          });
        } else if (projectId) {
          updateProjectState(projectId, state.blueprint!);
        }
        toast.success(`Page "${dp.name}" generated`);
      } else {
        toast.error("Failed to generate page");
      }
    } finally {
      setGeneratingPageUrl(null);
    }
  }

  function startRename(id: string, currentName: string) {
    setRenamingId(id);
    setRenameValue(currentName);
  }

  function commitRename() {
    if (renamingId && renameValue.trim()) {
      renamePage(renamingId, renameValue.trim());
    }
    setRenamingId(null);
  }

  function cancelRename() {
    setRenamingId(null);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText size={14} className="text-indigo-400" />
            Pages
          </h2>
          <span className="text-[11px] text-white/30 tabular-nums">
            {pages.length} of {MAX_FREE_PAGES}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Generated pages */}
        <div className="px-2 py-2 space-y-0.5">
          {pages.map((page) => {
            const isActive = page.id === resolvedActiveId;
            const isHome = page.slug === "home" && pages.indexOf(page) === 0;
            const isRenaming = renamingId === page.id;

            return (
              <div
                key={page.id}
                onClick={() => !isRenaming && setActivePageId(page.id)}
                className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                  isActive
                    ? "bg-indigo-500/10 border border-indigo-500/20"
                    : "hover:bg-white/[0.03] border border-transparent"
                }`}
              >
                <FileText
                  size={13}
                  className={isActive ? "text-indigo-400 shrink-0" : "text-white/20 shrink-0"}
                />

                {isRenaming ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitRename();
                        if (e.key === "Escape") cancelRename();
                      }}
                      className="flex-1 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-xs text-white outline-none focus:border-indigo-500/50"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        commitRename();
                      }}
                      className="p-0.5 rounded hover:bg-white/10 text-green-400"
                    >
                      <Check size={11} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelRename();
                      }}
                      className="p-0.5 rounded hover:bg-white/10 text-white/30"
                    >
                      <X size={11} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`flex-1 text-xs truncate ${
                        isActive ? "text-white" : "text-white/50"
                      }`}
                    >
                      {page.name}
                    </span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(page.id, page.name);
                        }}
                        className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/60"
                      >
                        <Pencil size={11} />
                      </button>
                      {!isHome && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removePage(page.id);
                          }}
                          className="p-1 rounded hover:bg-red-500/10 text-white/30 hover:text-red-400"
                        >
                          <Trash2 size={11} />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Discovered pages */}
        {discovered.length > 0 && (
          <div className="px-2 pb-2">
            <div className="flex items-center gap-1.5 px-2.5 py-2 mt-1">
              <Globe size={11} className="text-white/20" />
              <span className="text-[11px] text-white/25 font-medium uppercase tracking-wider">
                Discovered from site
              </span>
            </div>
            <div className="space-y-0.5">
              {discovered.map((dp) => {
                const isGenerating = generatingPageUrl === dp.url;
                const disabled = atLimit || !!generatingPageUrl;

                return (
                  <div
                    key={dp.url}
                    className="group flex items-center gap-2 px-2.5 py-2 rounded-lg border border-transparent"
                  >
                    <FileText size={13} className="text-white/10 shrink-0" />
                    <span className="flex-1 text-xs text-white/30 truncate">
                      {dp.name}
                    </span>
                    {isGenerating ? (
                      <div className="flex items-center gap-1 text-[10px] text-indigo-400">
                        <Loader2 size={11} className="animate-spin" />
                      </div>
                    ) : atLimit ? (
                      <Lock size={10} className="text-white/15 shrink-0" />
                    ) : (
                      <button
                        onClick={() => handleGenerate(dp)}
                        disabled={disabled}
                        className="hidden group-hover:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] text-indigo-400 hover:bg-indigo-500/10 transition-colors disabled:opacity-30"
                      >
                        <Sparkles size={10} />
                        Generate
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add page / limit message */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        {atLimit ? (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06]">
            <Lock size={12} className="text-white/20 shrink-0" />
            <span className="text-[11px] text-white/30">
              Upgrade to add more pages
            </span>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-dashed border-white/10 text-xs text-white/40 hover:text-white/60 hover:border-white/20 hover:bg-white/[0.02] transition-colors"
          >
            <Plus size={13} />
            Add blank page
          </button>
        )}
      </div>
    </div>
  );
}
