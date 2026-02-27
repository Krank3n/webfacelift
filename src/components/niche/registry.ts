import dynamic from "next/dynamic";
import type { NicheCategory } from "@/types/niche";
import type { NicheBusinessData } from "@/types/niche";
import type { ComponentType } from "react";

export interface NicheTemplateProps {
  data: NicheBusinessData;
}

const nicheTemplates: Partial<
  Record<NicheCategory, ComponentType<NicheTemplateProps>>
> = {
  "water-sports": dynamic(() => import("./templates/WaterSportsTemplate"), {
    ssr: false,
  }),
};

export function getNicheTemplate(
  niche: NicheCategory
): ComponentType<NicheTemplateProps> | null {
  return nicheTemplates[niche] ?? null;
}
