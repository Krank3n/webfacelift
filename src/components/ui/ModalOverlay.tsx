"use client";

import { useEffect, useRef, useCallback } from "react";

interface ModalOverlayProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function ModalOverlay({
  open,
  onClose,
  label,
  children,
  className = "",
}: ModalOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Lock scroll and save/restore focus
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    // Focus first focusable element inside modal
    requestAnimationFrame(() => {
      const el = overlayRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      el?.focus();
    });

    return () => {
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [open]);

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !overlayRef.current) return;

      const focusable = overlayRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm ${className}`}
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
