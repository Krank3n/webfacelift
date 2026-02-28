"use client";

import { useState } from "react";
import type { FAQBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import EditableText from "./EditableText";

export default function FAQ({ block, template }: { block: FAQBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      className="w-full py-16 md:py-24 px-6"
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <EditableText field="title">{block.title}</EditableText>
          </h2>
          {block.subtitle && (
            <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto">
              <EditableText field="subtitle">{block.subtitle}</EditableText>
            </p>
          )}
        </div>
        <div className="space-y-3">
          {block.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={cn("overflow-hidden", t.card)}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-white/[0.03] transition-colors"
                >
                  <span>
                    <EditableText field={`items.${i}.question`}>{item.question}</EditableText>
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 ml-3 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm opacity-70 leading-relaxed">
                      <EditableText field={`items.${i}.answer`} multiline>{item.answer}</EditableText>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
