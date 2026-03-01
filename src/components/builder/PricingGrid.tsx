"use client";

import type { PricingGridBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import EditableText from "./EditableText";
import ScrollReveal from "./ScrollReveal";

export default function PricingGrid({ block, template }: { block: PricingGridBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);

  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <EditableText field="title">{block.title}</EditableText>
          </h2>
          {block.subtitle && (
            <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto">
              <EditableText field="subtitle">{block.subtitle}</EditableText>
            </p>
          )}
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {block.tiers.map((tier, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <div
                className={cn(
                  "p-6 flex flex-col h-full",
                  t.card,
                  t.cardHover,
                  tier.highlighted && "ring-2 ring-white/20 scale-[1.02]"
                )}
              >
                {tier.highlighted && (
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-3 opacity-60">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">
                  <EditableText field={`tiers.${i}.name`}>{tier.name}</EditableText>
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    <EditableText field={`tiers.${i}.price`}>{tier.price}</EditableText>
                  </span>
                  {tier.period && (
                    <span className="text-sm opacity-50">/{tier.period}</span>
                  )}
                </div>
                <ul className="mt-5 space-y-2.5 flex-1">
                  {tier.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm opacity-80">
                      <Check size={14} className="mt-0.5 shrink-0 opacity-60" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={cn("mt-6 w-full py-2.5 text-sm font-semibold", t.buttonPrimary)}>
                  <EditableText field={`tiers.${i}.ctaText`}>{tier.ctaText || "Get Started"}</EditableText>
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
