"use client";

import { useState, useEffect, useRef } from "react";

interface StickyBottomBarProps {
  text: string;
  buttonText: string;
  buttonLink?: string;
  colorScheme: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export default function StickyBottomBar({
  text,
  buttonText,
  buttonLink,
  colorScheme,
}: StickyBottomBarProps) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    // Find the scrollable container (PreviewCanvas has overflow-auto)
    const scrollParent = el.closest(".overflow-auto") as HTMLElement | null;
    if (!scrollParent) return;
    const handler = () => setVisible(scrollParent.scrollTop > 400);
    scrollParent.addEventListener("scroll", handler, { passive: true });
    return () => scrollParent.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      ref={barRef}
      className={`sticky bottom-0 z-40 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
      style={{
        backgroundColor: `${colorScheme.background}f0`,
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${colorScheme.accent}30`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <span
          className="text-sm font-medium hidden sm:block"
          style={{ color: colorScheme.text }}
        >
          {text}
        </span>
        <a
          href={buttonLink || "#"}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110 sm:ml-auto"
          style={{
            backgroundColor: colorScheme.accent,
            color: colorScheme.background,
          }}
        >
          {buttonText}
        </a>
      </div>
    </div>
  );
}
