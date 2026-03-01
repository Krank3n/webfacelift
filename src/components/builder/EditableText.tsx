"use client";

import { createContext, useContext, type ReactNode } from "react";

// ── Context for the edit callback (provided by PreviewCanvas) ──
export interface EditContextValue {
  onEditText: (path: string, currentValue: string, multiline?: boolean) => void;
  onEditImage: (path: string, currentUrl: string | undefined) => void;
}

export const EditContext = createContext<EditContextValue | null>(null);

// ── Context for translation resolution (provided by PreviewCanvas) ──
export interface TranslationContextValue {
  activeLanguage: string;
  defaultLanguage: string;
  translations: Record<string, Record<string, string>>;
}

export const TranslationContext = createContext<TranslationContextValue | null>(null);

// ── Context for the path prefix (provided by Renderer's BlockWrapper / niche path) ──
export const EditPathContext = createContext<string>("");

export function EditPathProvider({
  prefix,
  children,
}: {
  prefix: string;
  children: ReactNode;
}) {
  return (
    <EditPathContext.Provider value={prefix}>
      {children}
    </EditPathContext.Provider>
  );
}

// ── Deep-set utility ──
export function setDeepValue(obj: any, path: string, value: any): any {
  const result = structuredClone(obj);
  const keys = path.split(".");
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = /^\d+$/.test(keys[i]) ? Number(keys[i]) : keys[i];
    current = current[key];
  }
  const lastKey = /^\d+$/.test(keys.at(-1)!)
    ? Number(keys.at(-1)!)
    : keys.at(-1)!;
  current[lastKey] = value;
  return result;
}

// ── EditableText wrapper ──
export default function EditableText({
  field,
  path,
  value,
  multiline,
  children,
}: {
  /** Field name relative to the path prefix (e.g. "heading", "services.0.title") */
  field?: string;
  /** Absolute path override — ignores prefix */
  path?: string;
  /** Explicit text value — use when children contain React elements (not plain text) */
  value?: string;
  /** Whether to show a textarea in the modal */
  multiline?: boolean;
  children: ReactNode;
}) {
  const ctx = useContext(EditContext);
  const prefix = useContext(EditPathContext);
  const translationCtx = useContext(TranslationContext);

  // If no edit context is provided, render children as-is (e.g. export/static)
  if (!ctx) {
    // Still resolve translations for preview/export mode
    if (translationCtx) {
      const fp = path ?? (prefix ? `${prefix}.${field}` : field ?? "");
      const translated = resolveTranslation(translationCtx, fp);
      if (translated !== undefined) return <>{translated}</>;
    }
    return <>{children}</>;
  }

  const fullPath = path ?? (prefix ? `${prefix}.${field}` : field ?? "");

  // Resolve translated text if viewing a non-default language
  const translated = resolveTranslation(translationCtx, fullPath);
  const originalText = value ?? extractText(children);
  const displayText = translated ?? originalText;

  return (
    <span
      className="editable-text"
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        ctx.onEditText(fullPath, displayText, multiline);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          e.preventDefault();
          ctx.onEditText(fullPath, displayText, multiline);
        }
      }}
    >
      {translated !== undefined ? translated : children}
    </span>
  );
}

function resolveTranslation(
  ctx: TranslationContextValue | null,
  fullPath: string
): string | undefined {
  if (!ctx || !fullPath) return undefined;
  if (ctx.activeLanguage === ctx.defaultLanguage) return undefined;
  return ctx.translations[ctx.activeLanguage]?.[fullPath];
}

function extractText(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  // Traverse React element children
  if (node && typeof node === "object" && "props" in node) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return "";
}
