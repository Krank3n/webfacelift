import type {
  BlueprintState,
  BlueprintPage,
  DiscoveredPage,
} from "@/types/blueprint";

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

/**
 * Convert a URL into a human-readable page name.
 * "/about-us" → "About Us", "/services/web-design" → "Web Design"
 */
export function urlToPageName(url: string): string {
  try {
    const path = new URL(url).pathname.replace(/\/$/, "");
    const lastSegment = path.split("/").filter(Boolean).pop() || "Page";
    return lastSegment
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return "Page";
  }
}

/**
 * Convert discovered URLs into DiscoveredPage objects with smart naming.
 * Filters out junk paths (login, cart, wp-admin, etc.)
 */
export function buildDiscoveredPages(urls: string[]): DiscoveredPage[] {
  const skipPatterns = [
    /\/(wp-admin|wp-login|wp-content|wp-json)/i,
    /\/(login|signup|register|auth|logout|cart|checkout)/i,
    /\/(admin|dashboard|account|profile|settings)/i,
    /\/(search|tag|category|author|archive)\//i,
    /\.(pdf|xml|json|txt|rss)$/i,
    /[?#]/,
  ];

  return urls
    .filter((url) => !skipPatterns.some((p) => p.test(new URL(url).pathname)))
    .map((url) => {
      const name = urlToPageName(url);
      const slug = name.toLowerCase().replace(/\s+/g, "-");
      return { url, name, slug };
    })
    .slice(0, 20); // cap at 20 discovered pages
}
