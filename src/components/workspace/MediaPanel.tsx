"use client";

import { useState, useRef } from "react";
import { useProjectStore } from "@/store/project-store";
import { uploadMedia } from "@/actions/uploadMedia";
import { ImagePlus, Loader2, Copy, Check, Upload } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export default function MediaPanel() {
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadedImages = useProjectStore((s) => s.uploadedImages);
  const addUploadedImage = useProjectStore((s) => s.addUploadedImage);
  const addChatMessage = useProjectStore((s) => s.addChatMessage);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadMedia(formData);

    if (result.success && result.url) {
      addUploadedImage(result.url);
      addChatMessage({
        id: crypto.randomUUID(),
        role: "system",
        content: `New image uploaded and available: ${result.url}`,
        timestamp: Date.now(),
      });
      toast.success("Image uploaded");
    } else {
      toast.error("Upload failed");
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast.success("Image URL copied");
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <ImagePlus size={14} className="text-indigo-400" />
          Media
        </h2>
        <p className="text-[11px] text-white/30 mt-0.5">
          Upload images for your blueprint
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Upload zone */}
        <label className="block w-full p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/30 bg-white/[0.02] hover:bg-indigo-500/5 transition-all cursor-pointer text-center mb-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="hidden"
          />
          {uploading ? (
            <Loader2 size={20} className="text-indigo-400 animate-spin mx-auto" />
          ) : (
            <Upload size={20} className="text-white/20 mx-auto mb-2" />
          )}
          <p className="text-xs text-white/30">
            {uploading ? "Uploading..." : "Click to upload an image"}
          </p>
        </label>

        {/* Image grid */}
        {uploadedImages.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {uploadedImages.map((url) => (
              <div
                key={url}
                className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10"
              >
                <Image
                  src={url}
                  alt="Uploaded"
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => copyUrl(url)}
                    className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    {copiedUrl === url ? (
                      <Check size={14} className="text-green-400" />
                    ) : (
                      <Copy size={14} className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {uploadedImages.length === 0 && !uploading && (
          <p className="text-center text-xs text-white/20 py-8">
            No images uploaded yet
          </p>
        )}
      </div>
    </div>
  );
}
