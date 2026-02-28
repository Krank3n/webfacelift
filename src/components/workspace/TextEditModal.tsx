"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface TextEditModalProps {
  open: boolean;
  path: string;
  value: string;
  multiline?: boolean;
  onSave: (path: string, newValue: string) => void;
  onClose: () => void;
}

function labelFromPath(path: string): string {
  const last = path.split(".").at(-1) ?? path;
  // Convert camelCase to Title Case
  return last
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

export default function TextEditModal({
  open,
  path,
  value,
  multiline,
  onSave,
  onClose,
}: TextEditModalProps) {
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync draft when modal opens with new value
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const label = labelFromPath(path);

  const handleSave = () => {
    if (draft !== value) {
      onSave(path, draft);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl shadow-black/50 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-sm font-medium text-white/70">{label}</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-white/10 text-white text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-white/20"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey) handleSave();
              }}
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-white/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/50 hover:text-white/80 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
