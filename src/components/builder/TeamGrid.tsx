"use client";

import type { TeamGridBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function TeamGrid({ block, template }: { block: TeamGridBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const cols = block.columns || 3;
  const gridClass =
    cols === 2
      ? "grid-cols-1 md:grid-cols-2"
      : cols === 4
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className="w-full py-16 md:py-24 px-6"
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            {block.title}
          </h2>
          {block.subtitle && (
            <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto">
              {block.subtitle}
            </p>
          )}
        </div>
        <div className={`grid ${gridClass} gap-6`}>
          {block.members.map((member, i) => (
            <div key={i} className={cn("p-6 text-center", t.card, t.cardHover)}>
              {member.image ? (
                <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center text-xl font-bold mb-4 opacity-60">
                  {member.name.charAt(0)}
                </div>
              )}
              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm opacity-60 mt-1">{member.role}</p>
              {member.bio && (
                <p className="text-sm opacity-50 mt-3 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
