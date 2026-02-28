"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

/**
 * Renders children inside an iframe so CSS media queries
 * respond to the iframe width (not the browser viewport).
 * This makes responsive previews actually work at 375px/768px/etc.
 */
export default function IframePreview({ children }: { children: ReactNode }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rootRef = useRef<Root | null>(null);
  const observerRef = useRef<MutationObserver | null>(null);
  const childrenRef = useRef<ReactNode>(children);
  childrenRef.current = children;

  // Setup iframe: copy styles, create React root
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setup = () => {
      const doc = iframe.contentDocument;
      if (!doc) return;

      // Copy all parent stylesheets into the iframe
      const syncStyles = () => {
        doc.head.querySelectorAll("[data-synced]").forEach((el) => el.remove());
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach(
          (el) => {
            const clone = el.cloneNode(true) as HTMLElement;
            clone.setAttribute("data-synced", "");
            doc.head.appendChild(clone);
          }
        );
      };

      // Add <base> so relative font URLs (/_next/static/media/...)
      // resolve against the parent origin instead of about:srcdoc
      const base = doc.createElement("base");
      base.href = window.location.origin;
      doc.head.appendChild(base);

      // Copy font CSS variable classes from parent <html> to iframe <html>
      // so next/font CSS variables (--font-inter) resolve inside the iframe
      const parentClasses = document.documentElement.className;
      if (parentClasses) {
        doc.documentElement.className = parentClasses;
      }

      syncStyles();

      // Watch for new styles (Next.js HMR in dev mode)
      observerRef.current = new MutationObserver(() => syncStyles());
      observerRef.current.observe(document.head, {
        childList: true,
        subtree: true,
      });

      // Intercept link clicks so they work correctly inside the preview
      doc.addEventListener("click", (e) => {
        const anchor = (e.target as HTMLElement).closest("a");
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href) return;

        // Let tel: and mailto: links work normally
        if (href.startsWith("tel:") || href.startsWith("mailto:")) return;

        e.preventDefault();

        // Hash-only links → smooth scroll within the iframe
        if (href.startsWith("#")) {
          if (href === "#") return; // no-op for bare "#"
          const target = doc.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
          return;
        }

        // External/absolute links → open in a new tab
        window.open(href, "_blank", "noopener,noreferrer");
      });

      // Setup body
      doc.body.style.margin = "0";
      doc.body.style.overflow = "auto";
      doc.body.style.backgroundColor = "transparent";

      // Create mount point
      const mount = doc.createElement("div");
      mount.id = "preview-root";
      mount.style.minHeight = "100%";
      doc.body.appendChild(mount);

      // Create a separate React root inside the iframe
      // This ensures event delegation works correctly within the iframe
      rootRef.current = createRoot(mount);
      rootRef.current.render(childrenRef.current);
    };

    // iframe with srcdoc fires load event when ready
    iframe.addEventListener("load", setup, { once: true });

    return () => {
      iframe.removeEventListener("load", setup);
      observerRef.current?.disconnect();
      const root = rootRef.current;
      if (root) {
        // Defer unmount to avoid React warnings
        setTimeout(() => root.unmount(), 0);
      }
    };
  }, []);

  // Re-render iframe content when children change
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.render(children);
    }
  }, [children]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full h-full border-0"
      title="Site preview"
      srcDoc="<!DOCTYPE html><html><head></head><body></body></html>"
    />
  );
}
