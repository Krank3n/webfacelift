"use client";

import { useContext } from "react";
import { Camera } from "lucide-react";
import { EditContext, EditPathContext } from "./EditableText";

export default function EditableImage({
  field,
  path,
  currentSrc,
}: {
  /** Field name relative to the path prefix (e.g. "image", "images.0.url") */
  field?: string;
  /** Absolute path override — ignores prefix */
  path?: string;
  /** Current image URL */
  currentSrc: string | undefined;
}) {
  const ctx = useContext(EditContext);
  const prefix = useContext(EditPathContext);

  if (!ctx) return null;

  const fullPath = path ?? (prefix ? `${prefix}.${field}` : field ?? "");

  return (
    <div
      className="editable-image-overlay"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        ctx.onEditImage(fullPath, currentSrc);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          e.preventDefault();
          ctx.onEditImage(fullPath, currentSrc);
        }
      }}
    >
      <Camera size={24} className="text-white drop-shadow-lg" />
    </div>
  );
}
