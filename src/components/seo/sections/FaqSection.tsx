"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/data/seo/types";

interface FaqSectionProps {
  faqs: FAQ[];
}

export default function FaqSection({ faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14">
        Frequently asked questions
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="text-sm font-medium text-white pr-4">{faq.question}</span>
              <ChevronDown
                size={16}
                className={`text-white/40 shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5">
                <p className="text-sm text-white/50 leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
