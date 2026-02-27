"use client";

import { useState } from "react";

interface FAQAccordionProps {
  items: { question: string; answer: string }[];
  accentColor?: string;
}

export default function FAQAccordion({
  items,
  accentColor = "#6366f1",
}: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3 max-w-3xl mx-auto">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="border border-white/10 rounded-xl overflow-hidden transition-colors"
            style={{
              borderColor: isOpen ? `${accentColor}40` : undefined,
            }}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-white/[0.03] transition-colors"
            >
              <span>{item.question}</span>
              <svg
                className={`w-4 h-4 shrink-0 ml-3 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-4 text-sm opacity-70 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
