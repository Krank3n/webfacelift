"use client";

import type { TestimonialsBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import Image from "next/image";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import ScrollReveal from "./ScrollReveal";

function AuthorInfo({ item, index }: { item: TestimonialsBlock["items"][number]; index: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
        {item.avatar ? (
          <Image
            src={item.avatar}
            alt={item.author}
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center text-xs font-bold opacity-60">
            {item.author.charAt(0)}
          </div>
        )}
        <EditableImage field={`items.${index}.avatar`} currentSrc={item.avatar} />
      </div>
      <div>
        <p className="text-sm font-semibold">
          <EditableText field={`items.${index}.author`}>{item.author}</EditableText>
        </p>
        {item.role && (
          <p className="text-xs opacity-50 mt-0.5">
            <EditableText field={`items.${index}.role`}>{item.role}</EditableText>
          </p>
        )}
      </div>
    </div>
  );
}

export default function Testimonials({ block, template }: { block: TestimonialsBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const variant = block.variant || "grid";

  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
            <EditableText field="title">{block.title}</EditableText>
          </h2>
        </ScrollReveal>

        {variant === "single-featured" ? (
          <ScrollReveal className="max-w-3xl mx-auto">
            {block.items.length > 0 && (
              <div className={cn("p-8 md:p-12 text-center", t.quoteCard)}>
                <Quote size={32} className={cn("mx-auto mb-6", t.accentTextMuted)} />
                <p className="text-lg md:text-xl opacity-80 leading-relaxed italic">
                  &ldquo;<EditableText field="items.0.quote" multiline>{block.items[0].quote}</EditableText>&rdquo;
                </p>
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-center">
                  <AuthorInfo item={block.items[0]} index={0} />
                </div>
              </div>
            )}
          </ScrollReveal>
        ) : variant === "alternating" ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {block.items.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div
                  className={cn(
                    "flex",
                    i % 2 === 0 ? "justify-start" : "justify-end"
                  )}
                >
                  <div className={cn("p-6 max-w-xl", t.quoteCard)}>
                    <Quote size={20} className={cn("mb-4", t.accentTextMuted)} />
                    <p className="opacity-80 text-sm leading-relaxed italic">
                      &ldquo;<EditableText field={`items.${i}.quote`} multiline>{item.quote}</EditableText>&rdquo;
                    </p>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <AuthorInfo item={item} index={i} />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {block.items.map((item, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={cn("p-6 h-full", t.quoteCard)}>
                  <Quote size={20} className={cn("mb-4", t.accentTextMuted)} />
                  <p className="opacity-80 text-sm leading-relaxed italic">
                    &ldquo;<EditableText field={`items.${i}.quote`} multiline>{item.quote}</EditableText>&rdquo;
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <AuthorInfo item={item} index={i} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
