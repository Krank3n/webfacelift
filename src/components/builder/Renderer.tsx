"use client";

import type { BlueprintState, BlueprintBlock, TemplateStyle } from "@/types/blueprint";
import { useProjectStore } from "@/store/project-store";
import { getNicheTemplate } from "@/components/niche/registry";
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
  template,
  globalBg,
  globalText,
}: {
  block: BlueprintBlock;
  index: number;
  template: TemplateStyle;
  globalBg: string;
  globalText: string;
}) {
  const hoveredBlockIndex = useProjectStore((s) => s.hoveredBlockIndex);
  const setHoveredBlockIndex = useProjectStore((s) => s.setHoveredBlockIndex);
  const Component = componentRegistry[block.type];

  if (!Component) {
    return (
      <div className="p-4 text-center text-white/40 text-sm">
        Unknown block type: {block.type}
      </div>
    );
  }

  const isHovered = hoveredBlockIndex === index;

  // Auto-correct text color when block bgColor conflicts with global text color
  const blockBg = (block as { bgColor?: string }).bgColor;
  const autoText = getAutoTextColor(blockBg, globalBg, globalText);

  return (
    <div
      className="relative group"
      style={autoText ? { color: autoText } : undefined}
      onMouseEnter={() => setHoveredBlockIndex(index)}
      onMouseLeave={() => setHoveredBlockIndex(null)}
    >
      {isHovered && (
        <div className="absolute inset-0 border border-dashed border-indigo-400/50 rounded-lg z-20 pointer-events-none">
          <span className="absolute -top-6 left-2 text-[10px] text-indigo-400 bg-zinc-900 px-2 py-0.5 rounded font-mono">
            {block.type}
          </span>
        </div>
      )}
      <Component block={block as never} template={template} />
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
          <NicheComponent data={blueprint.nicheData} />
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
      }}
    >
      {blueprint.layout.map((block, index) => (
        <BlockWrapper
          key={`${block.type}-${index}`}
          block={block}
          index={index}
          template={template}
          globalBg={blueprint.colorScheme?.background || "#0a0a0a"}
          globalText={blueprint.colorScheme?.text || "#ffffff"}
        />
      ))}
    </div>
  );
}
