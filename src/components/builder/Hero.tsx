"use client";

import type { HeroBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";

export default function Hero({ block, template }: { block: HeroBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const variant = block.variant || "centered";

  if (variant === "split-image") {
    return (
      <section
        className={cn("relative w-full overflow-hidden", getSectionPadding(block.sectionPadding))}
        style={{ backgroundColor: block.bgColor || undefined }}
      >
        <div
          className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          style={{ color: block.textColor || "#ffffff" }}
        >
          <div className="flex flex-col items-start text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <EditableText field="heading">{block.heading}</EditableText>
            </h1>
            <p className="mt-6 text-lg md:text-xl opacity-80 max-w-xl leading-relaxed">
              <EditableText field="subheading" multiline>{block.subheading}</EditableText>
            </p>
            {block.ctaText && (
              <a
                href={block.ctaLink || "#"}
                className={cn(
                  "mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white",
                  t.heroCta
                )}
              >
                <EditableText field="ctaText">{block.ctaText}</EditableText>
                <ArrowRight size={16} />
              </a>
            )}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            {block.bgImage ? (
              <>
                <Image
                  src={block.bgImage}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                  priority
                />
                <EditableImage field="bgImage" currentSrc={block.bgImage} />
              </>
            ) : (
              <div className={cn("w-full h-full bg-gradient-to-br border border-white/10", t.gradientAccent)} />
            )}
          </div>
        </div>
      </section>
    );
  }

  const isLeftAligned = variant === "left-aligned";

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: block.bgColor || undefined }}
    >
      {block.bgImage && (
        <Image
          src={block.bgImage}
          alt=""
          fill
          className="object-cover"
          unoptimized
          priority
        />
      )}
      {block.overlay && block.bgImage && (
        <div className={cn("absolute inset-0", t.heroOverlay)} />
      )}
      <EditableImage field="bgImage" currentSrc={block.bgImage} />
      <div
        className={cn(
          "relative z-10 max-w-5xl mx-auto px-6 py-28 md:py-36 lg:py-44 flex flex-col animate-fade-in-up",
          isLeftAligned
            ? "items-start text-left"
            : "items-center text-center"
        )}
        style={{ color: block.textColor || "#ffffff" }}
      >
        <h1 className={cn(
          "text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight",
          isLeftAligned ? "max-w-3xl" : "max-w-4xl"
        )}>
          <EditableText field="heading">{block.heading}</EditableText>
        </h1>
        <p className="mt-6 text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed">
          <EditableText field="subheading" multiline>{block.subheading}</EditableText>
        </p>
        {block.ctaText && (
          <a
            href={block.ctaLink || "#"}
            className={cn(
              "mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white",
              t.heroCta
            )}
          >
            <EditableText field="ctaText">{block.ctaText}</EditableText>
            <ArrowRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}
