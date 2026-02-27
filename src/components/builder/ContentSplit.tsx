"use client";

import type { ContentSplitBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const placeholderGradients: Record<TemplateStyle, string> = {
  glass: "from-indigo-500/20 to-violet-500/20",
  bold: "from-white/10 to-white/5",
  minimal: "from-zinc-800/50 to-zinc-700/30",
  vibrant: "from-pink-500/20 to-orange-500/20",
};

const imageRounding: Record<TemplateStyle, string> = {
  glass: "rounded-2xl shadow-lg shadow-black/20",
  bold: "rounded-lg shadow-xl shadow-black/30",
  minimal: "rounded-xl",
  vibrant: "rounded-3xl shadow-lg shadow-pink-500/10",
};

export default function ContentSplit({ block, template }: { block: ContentSplitBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const isLeft = block.alignment === "left";

  return (
    <section
      className="w-full py-16 md:py-24 px-6"
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center ${
          isLeft ? "" : "md:[direction:rtl]"
        }`}
      >
        {/* Text side */}
        <div className={isLeft ? "" : "md:[direction:ltr]"}>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {block.heading}
          </h2>
          <p className="mt-4 opacity-60 leading-relaxed text-base md:text-lg">
            {block.body}
          </p>
          {block.ctaText && (
            <a
              href={block.ctaLink || "#"}
              className={cn(
                "mt-6 inline-flex items-center gap-2 px-5 py-2.5 font-medium text-sm text-white",
                t.buttonPrimary
              )}
            >
              {block.ctaText}
              <ArrowRight size={16} />
            </a>
          )}
        </div>

        {/* Image side */}
        <div className={isLeft ? "" : "md:[direction:ltr]"}>
          {block.image ? (
            <div className={cn("relative aspect-[4/3] overflow-hidden bg-white/5", imageRounding[template])}>
              <Image
                src={block.image}
                alt={block.heading}
                fill
                className="object-cover hover:scale-[1.02] transition-transform duration-500"
                unoptimized
              />
            </div>
          ) : (
            <div className={cn(
              "aspect-[4/3] bg-gradient-to-br border border-white/10",
              placeholderGradients[template],
              imageRounding[template]
            )} />
          )}
        </div>
      </div>
    </section>
  );
}
