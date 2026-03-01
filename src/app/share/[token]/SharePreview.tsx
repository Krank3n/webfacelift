"use client";

import { useState, useMemo } from "react";
import type { BlueprintState } from "@/types/blueprint";
import { getBlueprintPages } from "@/lib/blueprint-utils";
import Renderer from "@/components/builder/Renderer";
import IframePreview from "@/components/workspace/IframePreview";
import { Zap } from "lucide-react";

export default function SharePreview({
  blueprint,
  siteName,
}: {
  blueprint: BlueprintState;
  siteName: string;
}) {
  const pages = useMemo(() => getBlueprintPages(blueprint), [blueprint]);
  const [activePageId, setActivePageId] = useState<string | null>(null);

  const activePageBlueprint = useMemo(() => {
    const page =
      (activePageId ? pages.find((p) => p.id === activePageId) : null) ??
      pages[0];
    if (!page) return blueprint;
    return {
      ...blueprint,
      layout: page.layout,
      nicheTemplate: page.nicheTemplate,
      nicheData: page.nicheData,
    };
  }, [blueprint, pages, activePageId]);

  return (
    <div className="h-screen flex flex-col bg-zinc-950">
      {/* Full viewport iframe preview */}
      <div className="flex-1 min-h-0">
        <IframePreview>
          <Renderer blueprint={activePageBlueprint} />
        </IframePreview>
      </div>

      {/* Page nav dots — only if multi-page */}
      {pages.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
          {pages.map((page) => {
            const isActive =
              page.id === (activePageId ?? pages[0]?.id);
            return (
              <button
                key={page.id}
                onClick={() => setActivePageId(page.id)}
                className={`px-3 py-1 rounded-full text-xs transition-colors ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
                title={page.name}
              >
                {page.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Built with badge */}
      <div className="absolute bottom-4 right-4 z-30">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/40 hover:text-white/70 text-[11px] transition-colors"
        >
          <Zap size={10} className="text-indigo-400" />
          Built with webfacelift
        </a>
      </div>
    </div>
  );
}
