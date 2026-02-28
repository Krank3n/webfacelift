"use client";

import type { StatsBarBlock, TemplateStyle } from "@/types/blueprint";
import EditableText from "./EditableText";

export default function StatsBar({ block }: { block: StatsBarBlock; template: TemplateStyle }) {
  return (
    <section
      className="w-full py-10 px-6"
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 md:gap-16">
        {block.stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="text-3xl md:text-4xl font-bold">
              <EditableText field={`stats.${i}.value`}>{stat.value}</EditableText>
            </div>
            <div className="text-sm mt-1 opacity-60">
              <EditableText field={`stats.${i}.label`}>{stat.label}</EditableText>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
