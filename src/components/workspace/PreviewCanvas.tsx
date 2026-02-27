"use client";

import { useProjectStore } from "@/store/project-store";
import Renderer from "@/components/builder/Renderer";
import IframePreview from "./IframePreview";
import { Monitor, Tablet, Smartphone } from "lucide-react";

const viewportWidths = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

export default function PreviewCanvas() {
  const blueprint = useProjectStore((s) => s.blueprint);
  const viewportMode = useProjectStore((s) => s.viewportMode);
  const setViewportMode = useProjectStore((s) => s.setViewportMode);
  const isGenerating = useProjectStore((s) => s.isGenerating);

  return (
    <div className="flex flex-col h-full">
      {/* Floating viewport controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 glass rounded-xl px-2 py-1.5 flex items-center gap-1 border border-white/10">
        {[
          { mode: "desktop" as const, icon: Monitor, label: "Desktop" },
          { mode: "tablet" as const, icon: Tablet, label: "Tablet" },
          { mode: "mobile" as const, icon: Smartphone, label: "Mobile" },
        ].map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewportMode(mode)}
            className={`p-1.5 rounded-lg transition-colors ${
              viewportMode === mode
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
            title={label}
          >
            <Icon size={14} />
          </button>
        ))}
      </div>

      {/* Canvas container — no overflow, iframe scrolls internally */}
      <div className="flex-1 flex flex-col p-6 pt-14 bg-zinc-950/50 min-h-0">
        <div
          className="mx-auto flex-1 min-h-0 transition-all duration-300 ease-out rounded-xl overflow-hidden bg-zinc-900 border border-white/[0.06] shadow-2xl shadow-black/50"
          style={{
            width: viewportWidths[viewportMode],
            maxWidth: "100%",
          }}
        >
          {isGenerating ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center mx-auto mb-3 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-indigo-400" />
                </div>
                <p className="text-sm text-white/30">
                  Generating blueprint...
                </p>
              </div>
            </div>
          ) : blueprint ? (
            <IframePreview>
              <Renderer blueprint={blueprint} />
            </IframePreview>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-white/20">
                No blueprint loaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
