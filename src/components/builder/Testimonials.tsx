"use client";

import type { TestimonialsBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";
import Image from "next/image";

const quoteIconStyle: Record<TemplateStyle, string> = {
  glass: "text-indigo-400/50",
  bold: "text-white/30",
  minimal: "text-white/20",
  vibrant: "text-pink-400/50",
};

export default function Testimonials({ block, template }: { block: TestimonialsBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);

  return (
    <section
      className="w-full py-16 md:py-24 px-6"
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">
          {block.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {block.items.map((item, i) => (
            <div
              key={i}
              className={cn("p-6", t.quoteCard)}
            >
              <Quote size={20} className={cn("mb-4", quoteIconStyle[template])} />
              <p className="opacity-80 text-sm leading-relaxed italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-3">
                {item.avatar && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={item.avatar}
                      alt={item.author}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold">{item.author}</p>
                  {item.role && (
                    <p className="text-xs opacity-50 mt-0.5">{item.role}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
