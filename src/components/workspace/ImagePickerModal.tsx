"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Upload, Link, Trash2, Check } from "lucide-react";
import { useProjectStore } from "@/store/project-store";
import { uploadMedia } from "@/actions/uploadMedia";
import Image from "next/image";

interface ImagePickerModalProps {
  open: boolean;
  path: string;
  currentUrl: string | undefined;
  onSelect: (path: string, newUrl: string) => void;
  onClose: () => void;
}

function labelFromPath(path: string): string {
  const last = path.split(".").at(-1) ?? path;
  return last
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

export default function ImagePickerModal({
  open,
  path,
  currentUrl,
  onSelect,
  onClose,
}: ImagePickerModalProps) {
  const uploadedImages = useProjectStore((s) => s.uploadedImages);
  const addUploadedImage = useProjectStore((s) => s.addUploadedImage);

  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset URL input when modal opens
  useEffect(() => {
    if (open) setUrlInput("");
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

  const handleFileUpload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadMedia(formData);
        if (result.success && result.url) {
          addUploadedImage(result.url);
          onSelect(path, result.url);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [path, onSelect, addUploadedImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  if (!open) return null;

  const label = labelFromPath(path);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg mx-4 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl shadow-black/50 animate-fade-in-up max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
          <span className="text-sm font-medium text-white/70">
            {label}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto min-h-0 flex-1 space-y-4">
          {/* Upload zone */}
          <div
            className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
                e.target.value = "";
              }}
            />
            <Upload
              size={20}
              className="mx-auto mb-2 text-white/30"
            />
            <p className="text-xs text-white/40">
              {isUploading
                ? "Uploading..."
                : "Drop an image or click to upload"}
            </p>
          </div>

          {/* URL input */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 border border-white/10 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50">
              <Link size={14} className="text-white/30 shrink-0" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image URL..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && urlInput.trim()) {
                    onSelect(path, urlInput.trim());
                  }
                }}
              />
            </div>
            <button
              onClick={() => {
                if (urlInput.trim()) onSelect(path, urlInput.trim());
              }}
              disabled={!urlInput.trim()}
              className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:hover:bg-indigo-600 rounded-lg transition-colors"
            >
              Use
            </button>
          </div>

          {/* Uploaded images grid */}
          {uploadedImages.length > 0 && (
            <div>
              <p className="text-xs text-white/30 mb-2 font-medium uppercase tracking-wider">
                Media Library
              </p>
              <div className="grid grid-cols-3 gap-2">
                {uploadedImages.map((url) => {
                  const isActive = url === currentUrl;
                  return (
                    <button
                      key={url}
                      onClick={() => onSelect(path, url)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:border-indigo-400/60 ${
                        isActive
                          ? "border-indigo-500 ring-2 ring-indigo-500/30"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-indigo-500/20 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-white/10 shrink-0">
          <button
            onClick={() => {
              onSelect(path, "");
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-400/70 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} />
            Remove
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white/50 hover:text-white/80 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
