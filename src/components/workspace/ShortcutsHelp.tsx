"use client";

import ModalOverlay from "@/components/ui/ModalOverlay";
import { X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["Cmd", "Z"], label: "Undo" },
  { keys: ["Cmd", "Shift", "Z"], label: "Redo" },
  { keys: ["Cmd", "S"], label: "Save project" },
  { keys: ["?"], label: "Show this help" },
];

export default function ShortcutsHelp({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ModalOverlay open={open} onClose={onClose} label="Keyboard Shortcuts">
      <div className="w-full max-w-sm mx-4 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl shadow-black/50 animate-fade-in-up">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-sm font-medium text-white/70">
            Keyboard Shortcuts
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 space-y-2">
          {SHORTCUTS.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between py-2 px-2"
            >
              <span className="text-sm text-white/50">{s.label}</span>
              <div className="flex items-center gap-1">
                {s.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[11px] text-white/60 font-mono"
                  >
                    {key === "Cmd" ? "\u2318" : key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalOverlay>
  );
}
