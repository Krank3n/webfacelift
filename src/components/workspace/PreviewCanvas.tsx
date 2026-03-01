"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useProjectStore } from "@/store/project-store";
import { getBlueprintPages } from "@/lib/blueprint-utils";
import Renderer from "@/components/builder/Renderer";
import IframePreview from "./IframePreview";
import TextEditModal from "./TextEditModal";
import ImagePickerModal from "./ImagePickerModal";
import { EditContext, setDeepValue } from "@/components/builder/EditableText";
import { Monitor, Tablet, Smartphone, Pencil, Eye, Maximize, Minimize } from "lucide-react";

const viewportWidths = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

interface ModalState {
  open: boolean;
  path: string;
  value: string;
  multiline?: boolean;
}

interface ImageModalState {
  open: boolean;
  path: string;
  currentUrl: string | undefined;
}

export default function PreviewCanvas() {
  const blueprint = useProjectStore((s) => s.blueprint);
  const setBlueprint = useProjectStore((s) => s.setBlueprint);
  const activePageId = useProjectStore((s) => s.activePageId);
  const viewportMode = useProjectStore((s) => s.viewportMode);
  const setViewportMode = useProjectStore((s) => s.setViewportMode);
  const previewMode = useProjectStore((s) => s.previewMode);
  const setPreviewMode = useProjectStore((s) => s.setPreviewMode);
  const isGenerating = useProjectStore((s) => s.isGenerating);
  const isEditing = previewMode === "edit";
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!canvasRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      canvasRef.current.requestFullscreen();
    }
  }, []);

  const activePageBlueprint = useMemo(() => {
    if (!blueprint) return null;
    const pages = getBlueprintPages(blueprint);
    const page = (activePageId ? pages.find((p) => p.id === activePageId) : null) ?? pages[0];
    if (!page) return blueprint;
    return {
      ...blueprint,
      layout: page.layout,
      nicheTemplate: page.nicheTemplate,
      nicheData: page.nicheData,
    };
  }, [blueprint, activePageId]);

  const [modal, setModal] = useState<ModalState>({
    open: false,
    path: "",
    value: "",
  });

  const [imageModal, setImageModal] = useState<ImageModalState>({
    open: false,
    path: "",
    currentUrl: undefined,
  });

  const handleEditText = useCallback(
    (path: string, currentValue: string, multiline?: boolean) => {
      setModal({ open: true, path, value: currentValue, multiline });
    },
    []
  );

  const handleEditImage = useCallback(
    (path: string, currentUrl: string | undefined) => {
      setImageModal({ open: true, path, currentUrl });
    },
    []
  );

  const handleSaveText = useCallback(
    (path: string, newValue: string) => {
      if (!blueprint) return;
      const updated = setDeepValue(blueprint, path, newValue);
      setBlueprint(updated);
    },
    [blueprint, setBlueprint]
  );

  const handleImageSelect = useCallback(
    (path: string, newUrl: string) => {
      if (!blueprint) return;
      const updated = setDeepValue(blueprint, path, newUrl || undefined);
      setBlueprint(updated);
      setImageModal((m) => ({ ...m, open: false }));
    },
    [blueprint, setBlueprint]
  );

  const handleCloseModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
  }, []);

  const handleCloseImageModal = useCallback(() => {
    setImageModal((m) => ({ ...m, open: false }));
  }, []);

  return (
    <div ref={canvasRef} className="flex flex-col h-full bg-zinc-950">
      {/* Floating viewport controls — hidden on mobile */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 glass rounded-xl px-2 py-1.5 hidden md:flex items-center gap-1 border border-white/10">
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

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Edit / Preview toggle */}
        {([
          { mode: "edit" as const, icon: Pencil, label: "Edit mode" },
          { mode: "preview" as const, icon: Eye, label: "Preview mode" },
        ]).map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setPreviewMode(mode)}
            className={`p-1.5 rounded-lg transition-colors ${
              previewMode === mode
                ? "bg-indigo-500/20 text-indigo-400"
                : "text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
            title={label}
          >
            <Icon size={14} />
          </button>
        ))}

        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-lg transition-colors text-white/30 hover:text-white/60 hover:bg-white/5"
          title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>
      </div>

      {/* Canvas container — full-bleed on mobile, padded on desktop */}
      <div className="flex-1 flex flex-col p-0 md:p-6 md:pt-14 bg-zinc-950/50 min-h-0">
        <div
          className="mx-auto flex-1 min-h-0 transition-all duration-300 ease-out overflow-hidden bg-zinc-900 rounded-none md:rounded-xl border-0 md:border md:border-white/[0.06] shadow-none md:shadow-2xl md:shadow-black/50"
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
          ) : activePageBlueprint ? (
            <IframePreview>
              <EditContext.Provider value={isEditing ? { onEditText: handleEditText, onEditImage: handleEditImage } : null}>
                <Renderer blueprint={activePageBlueprint} />
              </EditContext.Provider>
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

      {/* Text edit modal — rendered in parent document, outside iframe */}
      <TextEditModal
        open={modal.open}
        path={modal.path}
        value={modal.value}
        multiline={modal.multiline}
        onSave={handleSaveText}
        onClose={handleCloseModal}
      />

      {/* Image picker modal — rendered in parent document, outside iframe */}
      <ImagePickerModal
        open={imageModal.open}
        path={imageModal.path}
        currentUrl={imageModal.currentUrl}
        onSelect={handleImageSelect}
        onClose={handleCloseImageModal}
      />
    </div>
  );
}
