"use client";

import type { FooterBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";

export default function Footer({ block, template }: { block: FooterBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const showGradientBorder = template === "glass" || template === "vibrant";

  return (
    <footer
      className={cn("w-full px-6 py-10 relative", t.footerWrapper)}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      {showGradientBorder && (
        <div className={cn(
          "absolute top-0 left-0 right-0 h-px",
          template === "glass"
            ? "bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"
            : "bg-gradient-to-r from-transparent via-pink-500/50 to-transparent"
        )} />
      )}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold">
          {block.companyName}
        </span>

        {block.links && block.links.length > 0 && (
          <div className="flex items-center gap-6">
            {block.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs opacity-50 hover:opacity-80 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        <span className="text-xs opacity-40">
          {block.copyright || `\u00A9 ${new Date().getFullYear()} ${block.companyName}. All rights reserved.`}
        </span>
      </div>
    </footer>
  );
}
