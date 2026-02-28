import type { BlueprintState, BlueprintPage } from "@/types/blueprint";

export const MAX_FREE_PAGES = 5;

export function getBlueprintPages(blueprint: BlueprintState): BlueprintPage[] {
  if (blueprint.pages?.length) return blueprint.pages;
  return [
    {
      id: "home",
      name: "Home",
      slug: "home",
      layout: blueprint.layout || [],
      nicheTemplate: blueprint.nicheTemplate,
      nicheData: blueprint.nicheData,
    },
  ];
}
