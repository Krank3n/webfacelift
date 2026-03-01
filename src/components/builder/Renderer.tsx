"use client";

import { useRef, useEffect } from "react";
import type { BlueprintState, BlueprintBlock, TemplateStyle } from "@/types/blueprint";
import { useProjectStore } from "@/store/project-store";
import { getNicheTemplate } from "@/components/niche/registry";
import { EditPathProvider } from "./EditableText";
import Hero from "./Hero";
import ServiceGrid from "./ServiceGrid";
import ContentSplit from "./ContentSplit";
import ContactCTA from "./ContactCTA";
import Testimonials from "./Testimonials";
import Footer from "./Footer";
import Navbar from "./Navbar";
import PricingGrid from "./PricingGrid";
import StatsBar from "./StatsBar";
import Gallery from "./Gallery";
import FAQ from "./FAQ";
import TeamGrid from "./TeamGrid";
import LogoBar from "./LogoBar";
import SectionDivider, { getDividerVariant } from "./SectionDivider";

/**
 * Dynamically loads a Google Font by injecting a <link> stylesheet into the
 * ownerDocument (works inside iframes). Cleans up on unmount or font change.
 */
function GoogleFontLoader({ font }: { font?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!font) return;

    const doc = ref.current?.ownerDocument;
    if (!doc) return;

    const id = `gfont-${font.replace(/\s+/g, "-")}`;
    if (doc.getElementById(id)) return;

    // Preconnect for faster font loading
    for (const href of [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ]) {
      if (!doc.querySelector(`link[rel="preconnect"][href="${href}"]`)) {
        const pc = doc.createElement("link");
        pc.rel = "preconnect";
        pc.href = href;
        if (href.includes("gstatic")) pc.crossOrigin = "anonymous";
        pc.setAttribute("data-gfont", "");
        doc.head.appendChild(pc);
      }
    }

    const link = doc.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap`;
    doc.head.appendChild(link);

    return () => {
      doc.getElementById(id)?.remove();
    };
  }, [font]);

  return <div ref={ref} style={{ display: "none" }} />;
}

/**
 * Returns the relative luminance of a hex color (0 = black, 1 = white).
 * Uses WCAG 2.0 formula for perceptual brightness.
 */
function getLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  if (clean.length < 6) return 0.5;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** Returns true if the hex color is perceptually dark (needs white text). */
function isColorDark(hex: string): boolean {
  return getLuminance(hex) < 0.35;
}

/**
 * Given a block's bgColor and the global colorScheme, return the correct
 * text color so text is always readable against its section background.
 */
function getAutoTextColor(
  blockBgColor: string | undefined,
  globalBg: string,
  globalText: string
): string | undefined {
  // If block has no explicit bgColor, it inherits the global background →
  // the global text color is already correct (user/AI chose them together).
  if (!blockBgColor || blockBgColor === "transparent") return undefined;

  const bgDark = isColorDark(blockBgColor);
  const textDark = isColorDark(globalText);

  // If both are dark (dark bg + dark text) → override to white
  if (bgDark && textDark) return "#ffffff";
  // If both are light (light bg + light text) → override to near-black
  if (!bgDark && !textDark) return "#1a1a1a";
  // Otherwise the existing text color already contrasts well
  return undefined;
}

/** Map block types to the anchor slugs commonly used in navbar hrefs. */
const typeToSlug: Record<string, string> = {
  hero: "hero",
  serviceGrid: "services",
  contentSplit: "about",
  contactCTA: "contact",
  testimonials: "testimonials",
  pricingGrid: "pricing",
  statsBar: "stats",
  gallery: "gallery",
  faq: "faq",
  teamGrid: "team",
  logoBar: "partners",
  footer: "footer",
};

const componentRegistry: Record<
  string,
  React.ComponentType<{ block: never; template: TemplateStyle }>
> = {
  hero: Hero as React.ComponentType<{ block: never; template: TemplateStyle }>,
  serviceGrid: ServiceGrid as React.ComponentType<{ block: never; template: TemplateStyle }>,
  contentSplit: ContentSplit as React.ComponentType<{ block: never; template: TemplateStyle }>,
  contactCTA: ContactCTA as React.ComponentType<{ block: never; template: TemplateStyle }>,
  testimonials: Testimonials as React.ComponentType<{ block: never; template: TemplateStyle }>,
  footer: Footer as React.ComponentType<{ block: never; template: TemplateStyle }>,
  navbar: Navbar as React.ComponentType<{ block: never; template: TemplateStyle }>,
  pricingGrid: PricingGrid as React.ComponentType<{ block: never; template: TemplateStyle }>,
  statsBar: StatsBar as React.ComponentType<{ block: never; template: TemplateStyle }>,
  gallery: Gallery as React.ComponentType<{ block: never; template: TemplateStyle }>,
  faq: FAQ as React.ComponentType<{ block: never; template: TemplateStyle }>,
  teamGrid: TeamGrid as React.ComponentType<{ block: never; template: TemplateStyle }>,
  logoBar: LogoBar as React.ComponentType<{ block: never; template: TemplateStyle }>,
};

function BlockWrapper({
  block,
  index,
  sectionId,
  template,
  globalBg,
  globalText,
}: {
  block: BlueprintBlock;
  index: number;
  sectionId?: string;
  template: TemplateStyle;
  globalBg: string;
  globalText: string;
}) {
  const previewMode = useProjectStore((s) => s.previewMode);
  const hoveredBlockIndex = useProjectStore((s) => s.hoveredBlockIndex);
  const setHoveredBlockIndex = useProjectStore((s) => s.setHoveredBlockIndex);
  const Component = componentRegistry[block.type];
  const isEditing = previewMode === "edit";

  if (!Component) {
    return (
      <div className="p-4 text-center text-white/40 text-sm">
        Unknown block type: {block.type}
      </div>
    );
  }

  const isHovered = isEditing && hoveredBlockIndex === index;

  // Auto-correct text color when block bgColor conflicts with global text color
  const blockBg = (block as { bgColor?: string }).bgColor;
  const autoText = getAutoTextColor(blockBg, globalBg, globalText);

  return (
    <div
      id={sectionId}
      className="relative group/block"
      style={autoText ? { color: autoText } : undefined}
      onMouseEnter={isEditing ? () => setHoveredBlockIndex(index) : undefined}
      onMouseLeave={isEditing ? () => setHoveredBlockIndex(null) : undefined}
    >
      {isHovered && (
        <div className="absolute inset-0 border border-dashed border-indigo-400/50 rounded-lg z-20 pointer-events-none">
          <span className="absolute -top-6 left-2 text-[10px] text-indigo-400 bg-zinc-900 px-2 py-0.5 rounded font-mono">
            {block.type}
          </span>
        </div>
      )}
      <EditPathProvider prefix={`layout.${index}`}>
        <Component block={block as never} template={template} />
      </EditPathProvider>
    </div>
  );
}

export default function Renderer({
  blueprint,
}: {
  blueprint: BlueprintState;
}) {
  // Niche template path: if nicheTemplate and nicheData exist, render the niche template
  if (blueprint?.nicheTemplate && blueprint?.nicheData) {
    const NicheComponent = getNicheTemplate(blueprint.nicheTemplate);
    if (NicheComponent) {
      return (
        <div
          className="min-h-full"
          style={{ fontFamily: blueprint.font || "inherit" }}
        >
          <GoogleFontLoader font={blueprint.font} />
          <EditPathProvider prefix="nicheData">
            <NicheComponent data={blueprint.nicheData} />
          </EditPathProvider>
        </div>
      );
    }
    // Fall through to block rendering if niche component not found
  }

  // Block rendering path
  if (!blueprint || !blueprint.layout || blueprint.layout.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-white/40 text-sm">
        No blueprint to render. Enter a URL to get started.
      </div>
    );
  }

  const template: TemplateStyle = blueprint.template || "glass";

  return (
    <div
      className="min-h-full"
      style={{
        backgroundColor: blueprint.colorScheme?.background || "#0a0a0a",
        color: blueprint.colorScheme?.text || "#ffffff",
        fontFamily: blueprint.font || "inherit",
        "--brand-primary": blueprint.colorScheme?.primary || "#6366f1",
        "--brand-secondary": blueprint.colorScheme?.secondary || "#8b5cf6",
        "--brand-accent": blueprint.colorScheme?.accent || "#818cf8",
      } as React.CSSProperties}
    >
      <GoogleFontLoader font={blueprint.font} />
      {(() => {
        const slugCounts: Record<string, number> = {};
        const globalBg = blueprint.colorScheme?.background || "#0a0a0a";
        const globalText = blueprint.colorScheme?.text || "#ffffff";
        const elements: React.ReactNode[] = [];
        let dividerIndex = 0;

        blueprint.layout.forEach((block, index) => {
          // Insert divider between content blocks with different backgrounds
          if (index > 0) {
            const prev = blueprint.layout[index - 1];
            const skipTypes = new Set(["navbar", "footer"]);
            if (!skipTypes.has(prev.type) && !skipTypes.has(block.type)) {
              const prevBg = (prev as { bgColor?: string }).bgColor || "transparent";
              const currBg = (block as { bgColor?: string }).bgColor || "transparent";
              if (prevBg !== currBg) {
                const fillColor =
                  currBg !== "transparent" ? currBg : globalBg;
                elements.push(
                  <SectionDivider
                    key={`divider-${index}`}
                    variant={getDividerVariant(template, dividerIndex)}
                    fillColor={fillColor}
                  />
                );
                dividerIndex++;
              }
            }
          }

          // Use explicit sectionId if present, otherwise auto-generate from block type
          const explicitId = (block as { sectionId?: string }).sectionId;
          let sectionId: string | undefined;
          if (explicitId) {
            sectionId = explicitId;
          } else if (block.type !== "navbar") {
            const base = typeToSlug[block.type] || block.type;
            const count = (slugCounts[base] = (slugCounts[base] || 0) + 1);
            sectionId = count === 1 ? base : `${base}-${count}`;
          }
          elements.push(
            <BlockWrapper
              key={`${block.type}-${index}`}
              block={block}
              index={index}
              sectionId={sectionId}
              template={template}
              globalBg={globalBg}
              globalText={globalText}
            />
          );
        });

        return elements;
      })()}
    </div>
  );
}
