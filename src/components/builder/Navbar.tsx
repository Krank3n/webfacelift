"use client";

import type { NavbarBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import EditableText from "./EditableText";

export default function Navbar({ block, template }: { block: NavbarBlock; template: TemplateStyle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = getTemplateStyles(template);

  return (
    <nav
      className={cn("w-full px-6 py-4 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl", t.navbarWrapper)}
      style={{ backgroundColor: block.bgColor || "rgba(10, 10, 10, 0.85)" }}
    >
      <span className="text-xl font-bold tracking-tight">
        <EditableText field="brand">{block.brand}</EditableText>
      </span>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-8">
        {block.links.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm opacity-70 hover:opacity-100 transition-colors"
          >
            <EditableText field={`links.${i}.label`}>{link.label}</EditableText>
          </a>
        ))}
        {block.ctaText && (
          <button className={cn("px-4 py-2 text-sm", t.buttonSecondary)}>
            <EditableText field="ctaText">{block.ctaText}</EditableText>
          </button>
        )}
      </div>

      {/* Mobile toggle */}
      <button
        className="md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-full left-0 right-0 backdrop-blur-xl bg-zinc-950/90 border-t border-white/10 p-4 flex flex-col gap-3 md:hidden z-50">
          {block.links.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm opacity-70 hover:opacity-100 transition-colors"
            >
              <EditableText field={`links.${i}.label`}>{link.label}</EditableText>
            </a>
          ))}
          {block.ctaText && (
            <button className={cn("mt-2 px-4 py-2 text-sm", t.buttonSecondary)}>
              <EditableText field="ctaText">{block.ctaText}</EditableText>
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
