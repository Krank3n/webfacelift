"use client";

import { useState, useEffect, useRef } from "react";

interface NicheNavbarProps {
  brand: string;
  links: { label: string; href: string }[];
  ctaText?: string;
  ctaLink?: string;
  statusBadge?: { label: string; variant: "open" | "closed" };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export default function NicheNavbar({
  brand,
  links,
  ctaText,
  ctaLink,
  statusBadge,
  colorScheme,
}: NicheNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const scrollParent = el.closest("[style*='transform']")?.querySelector("[class*='overflow']")?.parentElement ?? el.parentElement;
    if (!scrollParent) return;
    const container = scrollParent.closest(".overflow-auto") ?? scrollParent.closest("[style*='overflow']") ?? window;
    const handler = () => {
      if (container instanceof Window) {
        setScrolled(window.scrollY > 40);
      } else {
        setScrolled((container as HTMLElement).scrollTop > 40);
      }
    };
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "shadow-lg backdrop-blur-xl" : ""
      }`}
      style={{
        backgroundColor: scrolled
          ? `${colorScheme.background}ee`
          : `${colorScheme.background}88`,
        color: colorScheme.text,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight">{brand}</span>
            {statusBadge && (
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  statusBadge.variant === "open"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {statusBadge.label}
              </span>
            )}
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </a>
            ))}
            {ctaText && (
              <a
                href={ctaLink || "#"}
                className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 hover:brightness-110"
                style={{
                  backgroundColor: colorScheme.accent,
                  color: colorScheme.background,
                }}
              >
                {ctaText}
              </a>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-3 py-2 text-sm opacity-70 hover:opacity-100 rounded-lg transition-opacity"
              >
                {link.label}
              </a>
            ))}
            {ctaText && (
              <a
                href={ctaLink || "#"}
                className="block px-3 py-2 text-sm font-semibold rounded-lg text-center"
                style={{
                  backgroundColor: colorScheme.accent,
                  color: colorScheme.background,
                }}
              >
                {ctaText}
              </a>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
