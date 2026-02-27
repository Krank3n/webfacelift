"use client";

import type { HeroBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function Hero({ block, template }: { block: HeroBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);

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
      <div
        className="relative z-10 max-w-5xl mx-auto px-6 py-28 md:py-36 lg:py-44 flex flex-col items-center text-center animate-fade-in-up"
        style={{ color: block.textColor || "#ffffff" }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-4xl">
          {block.heading}
        </h1>
        <p className="mt-6 text-lg md:text-xl opacity-80 max-w-2xl leading-relaxed">
          {block.subheading}
        </p>
        {block.ctaText && (
          <a
            href={block.ctaLink || "#"}
            className={cn(
              "mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm text-white",
              t.heroCta
            )}
          >
            {block.ctaText}
            <ArrowRight size={16} />
          </a>
        )}
      </div>
    </section>
  );
}
