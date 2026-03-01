"use client";

import type { StatsBarBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import EditableText from "./EditableText";
import ScrollReveal from "./ScrollReveal";

export default function StatsBar({ block, template }: { block: StatsBarBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const variant = block.variant || "inline";

  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding || "compact"))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        {variant === "cards" ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {block.stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className={cn("p-6 text-center h-full", t.card)}>
                  <div className="text-3xl md:text-4xl font-bold">
                    <EditableText field={`stats.${i}.value`}>{stat.value}</EditableText>
                  </div>
                  <div className="text-sm mt-2 opacity-60">
                    <EditableText field={`stats.${i}.label`}>{stat.label}</EditableText>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : variant === "bordered" ? (
          <ScrollReveal>
            <div className="flex flex-wrap justify-center divide-x divide-white/10">
              {block.stats.map((stat, i) => (
                <div key={i} className="px-8 md:px-12 py-4 text-center">
                  <div className="text-3xl md:text-4xl font-bold">
                    <EditableText field={`stats.${i}.value`}>{stat.value}</EditableText>
                  </div>
                  <div className="text-sm mt-1 opacity-60">
                    <EditableText field={`stats.${i}.label`}>{stat.label}</EditableText>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {block.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold">
                    <EditableText field={`stats.${i}.value`}>{stat.value}</EditableText>
                  </div>
                  <div className="text-sm mt-1 opacity-60">
                    <EditableText field={`stats.${i}.label`}>{stat.label}</EditableText>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
