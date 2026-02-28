"use client";

import type { TeamGridBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles } from "@/lib/templates";
import { cn } from "@/lib/utils";
import Image from "next/image";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";

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
            <EditableText field="title">{block.title}</EditableText>
          </h2>
          {block.subtitle && (
            <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto">
              <EditableText field="subtitle">{block.subtitle}</EditableText>
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
                  <EditableImage field={`members.${i}.image`} currentSrc={member.image} />
                </div>
              ) : (
                <div className="relative w-20 h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center text-xl font-bold mb-4 opacity-60">
                  {member.name.charAt(0)}
                  <EditableImage field={`members.${i}.image`} currentSrc={undefined} />
                </div>
              )}
              <h3 className="text-lg font-semibold">
                <EditableText field={`members.${i}.name`}>{member.name}</EditableText>
              </h3>
              <p className="text-sm opacity-60 mt-1">
                <EditableText field={`members.${i}.role`}>{member.role}</EditableText>
              </p>
              {member.bio && (
                <p className="text-sm opacity-50 mt-3 leading-relaxed line-clamp-3">
                  <EditableText field={`members.${i}.bio`} multiline>{member.bio}</EditableText>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
