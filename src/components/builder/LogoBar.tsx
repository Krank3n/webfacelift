"use client";

import type { LogoBarBlock, TemplateStyle } from "@/types/blueprint";
import { getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import Image from "next/image";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";

export default function LogoBar({ block }: { block: LogoBarBlock; template: TemplateStyle }) {
  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding || "compact"))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        {block.title && (
          <p className="text-center text-sm font-medium opacity-40 uppercase tracking-wider mb-8">
            <EditableText field="title">{block.title}</EditableText>
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {block.logos.map((logo, i) => (
            <div
              key={i}
              className="relative h-8 w-24 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            >
              <Image
                src={logo.url}
                alt={logo.alt}
                fill
                className="object-contain"
                unoptimized
              />
              <EditableImage field={`logos.${i}.url`} currentSrc={logo.url} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
