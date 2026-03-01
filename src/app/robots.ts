import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webfacelift.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/project/", "/api/", "/auth/", "/invite/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
