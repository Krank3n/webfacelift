import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/data/seo/utils";
import { industries } from "@/data/seo/industries";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webfacelift.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/buy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/showcase`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Showcase industry pages
  const showcasePages: MetadataRoute.Sitemap = industries.map((ind) => ({
    url: `${BASE_URL}/showcase/${ind.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Programmatic SEO pages
  const seoPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: slug.includes("-in-") ? 0.7 : 0.8,
  }));

  return [...staticPages, ...showcasePages, ...seoPages];
}
