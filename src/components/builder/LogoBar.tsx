"use client";

import type { LogoBarBlock, TemplateStyle } from "@/types/blueprint";
import Image from "next/image";

export default function LogoBar({ block }: { block: LogoBarBlock; template: TemplateStyle }) {
  return (
    <section
      className="w-full py-12 px-6"
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        {block.title && (
          <p className="text-center text-sm font-medium opacity-40 uppercase tracking-wider mb-8">
            {block.title}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
