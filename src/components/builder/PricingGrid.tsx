"use client";

import type { PricingGridBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function PricingGrid({ block, template }: { block: PricingGridBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);

  return (
    <section
      className="w-full py-16 md:py-24 px-6"
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {block.title}
          </h2>
          {block.subtitle && (
            <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto">
              {block.subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {block.tiers.map((tier, i) => (
            <div
              key={i}
              className={cn(
                "p-6 flex flex-col",
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
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-bold">{tier.price}</span>
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
                {tier.ctaText || "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
