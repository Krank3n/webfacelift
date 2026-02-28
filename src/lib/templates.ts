import type { TemplateStyle } from "@/types/blueprint";

export interface TemplateTokens {
  card: string;
  cardHover: string;
  buttonPrimary: string;
  buttonSecondary: string;
  input: string;
  navbarWrapper: string;
  heroOverlay: string;
  heroCta: string;
  iconBox: string;
  quoteCard: string;
  footerWrapper: string;
  // New tokens for brand-aware styling
  gradientAccent: string;
  accentTextMuted: string;
  borderGlow: string;
  imageShadow: string;
}

const glass: TemplateTokens = {
  card: "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-lg shadow-black/20",
  cardHover: "hover:-translate-y-1 hover:shadow-xl hover:shadow-[--brand-primary]/10 hover:border-white/20 transition-all duration-300",
  buttonPrimary: "rounded-xl bg-gradient-to-r from-[--brand-primary] to-[--brand-secondary] text-white shadow-lg shadow-[--brand-primary]/25 hover:shadow-[--brand-primary]/40 hover:brightness-110 transition-all duration-300",
  buttonSecondary: "rounded-xl bg-white/[0.06] border border-white/15 backdrop-blur-sm hover:bg-white/10 hover:border-white/25 transition-all duration-300",
  input: "rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-sm focus:border-[--brand-primary]/50 focus:ring-1 focus:ring-[--brand-primary]/50 focus:outline-none transition-colors",
  navbarWrapper: "backdrop-blur-xl bg-white/[0.03] border-b border-white/[0.06]",
  heroOverlay: "bg-gradient-to-b from-black/70 via-black/50 to-black/80",
  heroCta: "rounded-xl bg-gradient-to-r from-[--brand-primary] to-[--brand-secondary] text-white shadow-lg shadow-[--brand-primary]/25 hover:shadow-[--brand-primary]/40 hover:brightness-110 transition-all duration-300",
  iconBox: "rounded-xl bg-[--brand-primary]/15 border border-[--brand-primary]/20 shadow-inner shadow-[--brand-primary]/10",
  quoteCard: "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md shadow-lg shadow-black/20",
  footerWrapper: "border-t border-white/[0.06] bg-gradient-to-b from-transparent to-white/[0.02]",
  gradientAccent: "from-[--brand-primary]/20 to-[--brand-secondary]/20",
  accentTextMuted: "text-[--brand-primary]/50",
  borderGlow: "bg-gradient-to-r from-transparent via-[--brand-primary]/50 to-transparent",
  imageShadow: "rounded-2xl shadow-lg shadow-[--brand-primary]/20",
};

const bold: TemplateTokens = {
  card: "rounded-lg border-2 border-white/15 bg-white/[0.06] shadow-xl shadow-black/30",
  cardHover: "hover:scale-[1.03] hover:border-[--brand-primary] hover:shadow-2xl hover:shadow-[--brand-primary]/20 transition-all duration-200",
  buttonPrimary: "rounded-lg bg-white text-zinc-900 font-bold shadow-xl shadow-white/20 hover:shadow-white/30 hover:scale-105 transition-all duration-200",
  buttonSecondary: "rounded-lg border-2 border-white/30 font-bold hover:bg-white hover:text-zinc-900 transition-all duration-200",
  input: "rounded-lg bg-white/[0.06] border-2 border-white/15 focus:border-[--brand-primary]/60 focus:ring-1 focus:ring-[--brand-primary]/30 focus:outline-none transition-colors",
  navbarWrapper: "bg-black/80 border-b-2 border-white/10",
  heroOverlay: "bg-gradient-to-br from-black/80 via-black/60 to-transparent",
  heroCta: "rounded-lg bg-white text-zinc-900 font-bold shadow-xl shadow-white/20 hover:shadow-white/30 hover:scale-105 transition-all duration-200",
  iconBox: "rounded-lg bg-[--brand-primary]/10 border-2 border-[--brand-primary]/20",
  quoteCard: "rounded-lg border-2 border-white/15 bg-white/[0.06] shadow-xl shadow-black/30",
  footerWrapper: "border-t-2 border-white/15",
  gradientAccent: "from-white/10 to-white/5",
  accentTextMuted: "text-white/30",
  borderGlow: "bg-gradient-to-r from-transparent via-white/20 to-transparent",
  imageShadow: "rounded-lg shadow-xl shadow-black/30",
};

const minimal: TemplateTokens = {
  card: "rounded-xl border border-white/[0.06] bg-transparent",
  cardHover: "hover:border-white/15 hover:bg-white/[0.02] transition-all duration-500",
  buttonPrimary: "rounded-lg border border-white/20 bg-white text-zinc-900 hover:bg-white/90 transition-colors duration-300",
  buttonSecondary: "rounded-lg border border-white/10 hover:border-white/25 transition-colors duration-300",
  input: "rounded-lg bg-transparent border border-white/10 focus:border-[--brand-primary]/40 focus:outline-none transition-colors duration-300",
  navbarWrapper: "border-b border-white/[0.06]",
  heroOverlay: "bg-black/50",
  heroCta: "rounded-lg border border-white/20 bg-white text-zinc-900 hover:bg-white/90 transition-colors duration-300",
  iconBox: "rounded-lg border border-[--brand-primary]/15",
  quoteCard: "rounded-xl border border-white/[0.06] bg-transparent",
  footerWrapper: "border-t border-white/[0.06]",
  gradientAccent: "from-zinc-800/50 to-zinc-700/30",
  accentTextMuted: "text-white/20",
  borderGlow: "bg-white/[0.06]",
  imageShadow: "rounded-xl",
};

const vibrant: TemplateTokens = {
  card: "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-lg shadow-[--brand-primary]/5",
  cardHover: "hover:-translate-y-2 hover:shadow-xl hover:shadow-[--brand-primary]/15 hover:border-[--brand-primary]/30 transition-all duration-300",
  buttonPrimary: "rounded-2xl bg-gradient-to-r from-[--brand-primary] to-[--brand-secondary] text-white shadow-lg shadow-[--brand-primary]/30 hover:shadow-[--brand-primary]/50 hover:scale-105 transition-all duration-300",
  buttonSecondary: "rounded-2xl bg-white/[0.06] border border-[--brand-primary]/20 hover:bg-[--brand-primary]/10 hover:border-[--brand-primary]/40 transition-all duration-300",
  input: "rounded-2xl bg-white/[0.04] border border-white/10 focus:border-[--brand-primary]/50 focus:ring-1 focus:ring-[--brand-primary]/50 focus:outline-none transition-colors",
  navbarWrapper: "bg-gradient-to-r from-[--brand-primary]/[0.03] to-[--brand-secondary]/[0.03] border-b border-white/[0.06]",
  heroOverlay: "bg-gradient-to-br from-black/60 via-black/40 to-black/70",
  heroCta: "rounded-2xl bg-gradient-to-r from-[--brand-primary] to-[--brand-secondary] text-white shadow-lg shadow-[--brand-primary]/30 hover:shadow-[--brand-primary]/50 hover:scale-105 transition-all duration-300",
  iconBox: "rounded-2xl bg-gradient-to-br from-[--brand-primary]/15 to-[--brand-secondary]/15 border border-[--brand-primary]/20",
  quoteCard: "rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-lg shadow-[--brand-primary]/5",
  footerWrapper: "border-t border-white/[0.06] bg-gradient-to-r from-[--brand-primary]/[0.03] to-[--brand-secondary]/[0.03]",
  gradientAccent: "from-[--brand-primary]/20 to-[--brand-secondary]/20",
  accentTextMuted: "text-[--brand-primary]/50",
  borderGlow: "bg-gradient-to-r from-transparent via-[--brand-primary]/50 to-transparent",
  imageShadow: "rounded-3xl shadow-lg shadow-[--brand-primary]/10",
};

const templates: Record<TemplateStyle, TemplateTokens> = {
  glass,
  bold,
  minimal,
  vibrant,
};

export function getTemplateStyles(template?: TemplateStyle): TemplateTokens {
  return templates[template || "glass"];
}

export type SectionPadding = "compact" | "default" | "spacious";

export function getSectionPadding(padding?: SectionPadding): string {
  switch (padding) {
    case "compact": return "py-8 md:py-12";
    case "spacious": return "py-24 md:py-36";
    default: return "py-16 md:py-24";
  }
}
