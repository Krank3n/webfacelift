import { ParsedSlug } from "./types";
import { industries, getIndustry } from "./industries";
import { locations, getLocation } from "./locations";

const PREFIX = "website-redesign";

export function parseSlug(slug: string): ParsedSlug | null {
  // Pattern: website-redesign-for-[industry]-in-[location]
  const comboMatch = slug.match(/^website-redesign-for-(.+?)-in-(.+)$/);
  if (comboMatch) {
    const [, industrySlug, locationSlug] = comboMatch;
    if (getIndustry(industrySlug) && getLocation(locationSlug)) {
      return { type: "combo", industrySlug, locationSlug };
    }
    return null;
  }

  // Pattern: website-redesign-for-[industry]
  const industryMatch = slug.match(/^website-redesign-for-(.+)$/);
  if (industryMatch) {
    const [, industrySlug] = industryMatch;
    if (getIndustry(industrySlug)) {
      return { type: "industry", industrySlug };
    }
    return null;
  }

  // Pattern: website-redesign-[location]
  const locationMatch = slug.match(/^website-redesign-(.+)$/);
  if (locationMatch) {
    const [, locationSlug] = locationMatch;
    if (getLocation(locationSlug)) {
      return { type: "location", locationSlug };
    }
    return null;
  }

  return null;
}

export function generateIndustrySlug(industrySlug: string): string {
  return `${PREFIX}-for-${industrySlug}`;
}

export function generateLocationSlug(locationSlug: string): string {
  return `${PREFIX}-${locationSlug}`;
}

export function generateComboSlug(industrySlug: string, locationSlug: string): string {
  return `${PREFIX}-for-${industrySlug}-in-${locationSlug}`;
}

export function getAllSlugs(): string[] {
  const slugs: string[] = [];

  for (const industry of industries) {
    slugs.push(generateIndustrySlug(industry.slug));
  }

  for (const location of locations) {
    slugs.push(generateLocationSlug(location.slug));
  }

  for (const industry of industries) {
    for (const location of locations) {
      slugs.push(generateComboSlug(industry.slug, location.slug));
    }
  }

  return slugs;
}

export function getRelatedIndustryPages(currentIndustrySlug: string, limit = 8): string[] {
  return industries
    .filter((i) => i.slug !== currentIndustrySlug)
    .slice(0, limit)
    .map((i) => generateIndustrySlug(i.slug));
}

export function getRelatedLocationPages(currentLocationSlug: string, limit = 8): string[] {
  return locations
    .filter((l) => l.slug !== currentLocationSlug)
    .slice(0, limit)
    .map((l) => generateLocationSlug(l.slug));
}

export function getComboPages(industrySlug: string, limit = 8): string[] {
  return locations
    .slice(0, limit)
    .map((l) => generateComboSlug(industrySlug, l.slug));
}

export function getComboPagesForLocation(locationSlug: string, limit = 8): string[] {
  return industries
    .slice(0, limit)
    .map((i) => generateComboSlug(i.slug, locationSlug));
}
