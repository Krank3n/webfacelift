"use client";

import { useState, useRef } from "react";
import { useProjectStore } from "@/store/project-store";
import { uploadMedia } from "@/actions/uploadMedia";
import { ImagePlus, Loader2, Copy, Check, Upload, Film, Trash2 } from "lucide-react";
import { toast } from "sonner";

function isVideoUrl(url: string): boolean {
  return /\.(mp4|webm)(\?|$)/i.test(url) || url.includes("video.wixstatic.com");
}

export default function MediaPanel() {
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadedImages = useProjectStore((s) => s.uploadedImages);
  const addUploadedImage = useProjectStore((s) => s.addUploadedImage);
  const setUploadedImages = useProjectStore((s) => s.setUploadedImages);
  const addChatMessage = useProjectStore((s) => s.addChatMessage);
  const mediaCatalog = useProjectStore((s) => s.blueprint?.mediaCatalog);

  // Split into scraped media (from mediaCatalog) and user-uploaded
  const scrapedUrls = new Set(mediaCatalog?.map((m) => m.url) || []);
  const scrapedMedia = uploadedImages.filter((url) => scrapedUrls.has(url));
  const userUploaded = uploadedImages.filter((url) => !scrapedUrls.has(url));

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
      toast.error(result.error || "Upload failed");
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast.success("URL copied");
  }

  function removeMedia(url: string) {
    setUploadedImages(uploadedImages.filter((u) => u !== url));
  }

  function handleMediaError(url: string) {
    setFailedUrls((prev) => new Set(prev).add(url));
  }

  function renderMediaItem(url: string, showRemove: boolean) {
    const isVideo = isVideoUrl(url);
    const failed = failedUrls.has(url);
    const catalogEntry = mediaCatalog?.find((m) => m.url === url);

    return (
      <div
        key={url}
        className="group relative aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10"
      >
        {failed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/[0.03]">
            <span className="text-[10px] text-white/20 text-center px-2">Failed to load</span>
          </div>
        ) : isVideo ? (
          <video
            src={url}
            muted
            playsInline
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover"
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
            onError={() => handleMediaError(url)}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={url}
            alt={catalogEntry?.description || "Media"}
            crossOrigin="anonymous"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            onError={() => handleMediaError(url)}
          />
        )}

        {/* Video badge */}
        {isVideo && !failed && (
          <div className="absolute top-1.5 left-1.5 bg-black/60 rounded px-1.5 py-0.5 flex items-center gap-1">
            <Film size={10} className="text-white/70" />
            <span className="text-[9px] text-white/70">Video</span>
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => copyUrl(url)}
            className="p-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
            title="Copy URL"
          >
            {copiedUrl === url ? (
              <Check size={14} className="text-green-400" />
            ) : (
              <Copy size={14} className="text-white" />
            )}
          </button>
          {showRemove && (
            <button
              onClick={() => removeMedia(url)}
              className="p-2 rounded-md bg-white/10 hover:bg-red-500/30 transition-colors"
              title="Remove"
            >
              <Trash2 size={14} className="text-white" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-white/[0.06]">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <ImagePlus size={14} className="text-indigo-400" />
          Media
        </h2>
        <p className="text-[11px] text-white/30 mt-0.5">
          Images &amp; videos from the original site + uploads
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {/* Upload zone */}
        <label className="block w-full p-6 rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/30 bg-white/[0.02] hover:bg-indigo-500/5 transition-all cursor-pointer text-center mb-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/mp4,video/webm"
            onChange={handleUpload}
            className="hidden"
          />
          {uploading ? (
            <Loader2 size={20} className="text-indigo-400 animate-spin mx-auto" />
          ) : (
            <Upload size={20} className="text-white/20 mx-auto mb-2" />
          )}
          <p className="text-xs text-white/30">
            {uploading ? "Uploading..." : "Click to upload image or video"}
          </p>
        </label>

        {/* Scraped media from original site */}
        {scrapedMedia.length > 0 && (
          <>
            <p className="text-[11px] text-white/40 font-medium mb-2 uppercase tracking-wider">
              Original Website ({scrapedMedia.length})
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {scrapedMedia.map((url) => renderMediaItem(url, false))}
            </div>
          </>
        )}

        {/* User uploaded media */}
        {userUploaded.length > 0 && (
          <>
            <p className="text-[11px] text-white/40 font-medium mb-2 uppercase tracking-wider">
              Uploaded ({userUploaded.length})
            </p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {userUploaded.map((url) => renderMediaItem(url, true))}
            </div>
          </>
        )}

        {uploadedImages.length === 0 && !uploading && (
          <p className="text-center text-xs text-white/20 py-8">
            No media yet
          </p>
        )}
      </div>
    </div>
  );
}
