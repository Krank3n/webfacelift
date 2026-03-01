"use client";

import { useEffect } from "react";
import { useProjectStore } from "@/store/project-store";

export function useUndoRedoShortcuts() {
  const undo = useProjectStore((s) => s.undo);
  const redo = useProjectStore((s) => s.redo);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);
}

/**
 * Extended workspace shortcuts: Cmd+S to save, ? for help overlay.
 */
export function useWorkspaceShortcuts({
  onSave,
  onToggleHelp,
}: {
  onSave?: () => void;
  onToggleHelp?: () => void;
}) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      // Ignore if focus is in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const mod = e.metaKey || e.ctrlKey;

      if (mod && e.key === "s") {
        e.preventDefault();
        onSave?.();
      }

      if (e.key === "?" && !mod) {
        e.preventDefault();
        onToggleHelp?.();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave, onToggleHelp]);
}
