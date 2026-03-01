"use client";

import type { GalleryBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import Image from "next/image";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import ScrollReveal from "./ScrollReveal";

export default function Gallery({ block, template }: { block: GalleryBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const cols = block.columns || 3;
  const gridClass =
    cols === 2
      ? "grid-cols-1 sm:grid-cols-2"
      : cols === 4
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        {(block.title || block.subtitle) && (
          <ScrollReveal className="text-center mb-12">
            {block.title && (
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                <EditableText field="title">{block.title}</EditableText>
              </h2>
            )}
            {block.subtitle && (
              <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto">
                <EditableText field="subtitle">{block.subtitle}</EditableText>
              </p>
            )}
          </ScrollReveal>
        )}
        <div className={`grid ${gridClass} gap-4`}>
          {block.images.map((img, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div
                className={`group relative aspect-[4/3] rounded-xl overflow-hidden ${t.card}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt || "Gallery image"}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                />
                <EditableImage field={`images.${i}.url`} currentSrc={img.url} />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
