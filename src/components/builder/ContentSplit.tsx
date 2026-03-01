"use client";

import type { ContentSplitBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import ScrollReveal from "./ScrollReveal";


export default function ContentSplit({ block, template }: { block: ContentSplitBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const isLeft = block.alignment === "left";

  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
          isLeft ? "" : "md:[direction:rtl]"
        }`}
      >
        {/* Text side */}
        <ScrollReveal className={isLeft ? "" : "md:[direction:ltr]"}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            <EditableText field="heading">{block.heading}</EditableText>
          </h2>
          <p className="mt-4 opacity-60 leading-relaxed text-base md:text-lg">
            <EditableText field="body" multiline>{block.body}</EditableText>
          </p>
          {block.ctaText && (
            <a
              href={block.ctaLink || "#"}
              className={cn(
                "mt-6 inline-flex items-center gap-2 px-5 py-2.5 font-medium text-sm text-white",
                t.buttonPrimary
              )}
            >
              <EditableText field="ctaText">{block.ctaText}</EditableText>
              <ArrowRight size={16} />
            </a>
          )}
        </ScrollReveal>

        {/* Image side */}
        <ScrollReveal delay={150} className={isLeft ? "" : "md:[direction:ltr]"}>
          {block.image ? (
            <div className={cn("relative aspect-[4/3] overflow-hidden bg-white/5", t.imageShadow)}>
              <Image
                src={block.image}
                alt={block.heading}
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-500"
                unoptimized
              />
              <EditableImage field="image" currentSrc={block.image} />
            </div>
          ) : (
            <div className={cn(
              "aspect-[4/3] bg-gradient-to-br border border-white/10",
              t.gradientAccent,
              t.imageShadow
            )} />
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
