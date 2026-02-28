"use client";

import { useRef, useState, useEffect } from "react";

interface MobileSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SNAP_FULL = 5;
const SNAP_HALF = 50;
const SNAP_CLOSED = 100;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export default function MobileSheet({
  isOpen,
  onClose,
  children,
}: MobileSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(SNAP_CLOSED);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ y: 0, ty: 0 });
  const currentRef = useRef(SNAP_CLOSED);

  currentRef.current = translateY;

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setTranslateY(SNAP_HALF);
        currentRef.current = SNAP_HALF;
      });
    } else {
      setTranslateY(SNAP_CLOSED);
      currentRef.current = SNAP_CLOSED;
    }
  }, [isOpen]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setDragging(true);
    startRef.current = {
      y: e.touches[0].clientY,
      ty: currentRef.current,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const sheet = sheetRef.current;
    if (!sheet) return;
    const dy = e.touches[0].clientY - startRef.current.y;
    const pct = (dy / sheet.offsetHeight) * 100;
    const next = clamp(startRef.current.ty + pct, SNAP_FULL, SNAP_CLOSED);
    setTranslateY(next);
    currentRef.current = next;
  };

  const handleTouchEnd = () => {
    setDragging(false);
    const ty = currentRef.current;
    const delta = ty - startRef.current.ty;

    if (delta > 8) {
      // Swiped down
      if (ty > 70) {
        onClose();
      } else {
        setTranslateY(SNAP_HALF);
      }
    } else if (delta < -8) {
      // Swiped up
      if (ty < 30) {
        setTranslateY(SNAP_FULL);
      } else {
        setTranslateY(SNAP_HALF);
      }
    } else {
      // Barely moved — snap to nearest
      const pts = [SNAP_FULL, SNAP_HALF, SNAP_CLOSED] as const;
      const nearest = pts.reduce((a, b) =>
        Math.abs(ty - a) < Math.abs(ty - b) ? a : b
      );
      if (nearest === SNAP_CLOSED) {
        onClose();
      } else {
        setTranslateY(nearest);
      }
    }
  };

  // Also support mouse drag for testing on desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    startRef.current = {
      y: e.clientY,
      ty: currentRef.current,
    };

    const handleMouseMove = (ev: MouseEvent) => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const dy = ev.clientY - startRef.current.y;
      const pct = (dy / sheet.offsetHeight) * 100;
      const next = clamp(startRef.current.ty + pct, SNAP_FULL, SNAP_CLOSED);
      setTranslateY(next);
      currentRef.current = next;
    };

    const handleMouseUp = () => {
      setDragging(false);
      const ty = currentRef.current;
      const delta = ty - startRef.current.ty;

      if (delta > 8) {
        ty > 70 ? onClose() : setTranslateY(SNAP_HALF);
      } else if (delta < -8) {
        ty < 30 ? setTranslateY(SNAP_FULL) : setTranslateY(SNAP_HALF);
      } else {
        const pts = [SNAP_FULL, SNAP_HALF, SNAP_CLOSED] as const;
        const nearest = pts.reduce((a, b) =>
          Math.abs(ty - a) < Math.abs(ty - b) ? a : b
        );
        nearest === SNAP_CLOSED ? onClose() : setTranslateY(nearest);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const backdropOpacity = Math.max(0, (1 - translateY / 100) * 0.6);
  const isVisible = translateY < SNAP_CLOSED;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black ${
          isVisible ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          opacity: backdropOpacity,
          transition: dragging ? "none" : "opacity 0.35s ease-out",
        }}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-zinc-950 rounded-t-2xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.4)]"
        style={{
          height: "calc(100dvh - 48px)",
          transform: `translateY(${translateY}%)`,
          transition: dragging
            ? "none"
            : "transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)",
          willChange: "transform",
        }}
      >
        {/* Drag handle */}
        <div
          className="shrink-0 flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing touch-none select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <div className="w-9 h-1 rounded-full bg-white/20" />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    </>
  );
}
