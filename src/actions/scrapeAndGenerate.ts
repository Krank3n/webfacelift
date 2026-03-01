"use server";

import {
  anthropic,
  CONTENT_ANALYSIS_SYSTEM_PROMPT,
  BLUEPRINT_SYSTEM_PROMPT,
} from "@/lib/anthropic";
import { getGeminiDesignGuide } from "@/lib/gemini";
import type { BlueprintState } from "@/types/blueprint";
import type { ContentBrief } from "@/types/content-brief";
import { validateUrl } from "@/lib/url-validation";
import { deductCredit } from "@/actions/credits";
import { buildDiscoveredPages } from "@/lib/blueprint-utils";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

interface ScrapeResult {
  success: boolean;
  markdown?: string;
  screenshotUrl?: string;
  extractedImages?: string[];
  extractedVideos?: string[];
  extractedColors?: string[];
  internalLinks?: string[];
  error?: string;
}

interface MultiPageScrapeResult {
  success: boolean;
  combinedMarkdown: string;
  screenshotUrl?: string;
  allImages: string[];
  allVideos: string[];
  allColors: string[];
  discoveredUrls: string[];
  error?: string;
}

/* ================================================================== */
/*  Wix image URL upscaling                                            */
/* ================================================================== */

/**
 * Wix serves images via their CDN at whatever size the page requested.
 * Scraped pages often have tiny thumbnails (w_277). We detect Wix media
 * URLs and replace the size parameters with high-resolution versions.
 */
function upscaleWixImageUrl(url: string): string {
  // Match: static.wixstatic.com/media/{ID}/v1/fill/w_...,h_...,.../{filename}
  const wixFillRegex = /(https?:\/\/static\.wixstatic\.com\/media\/[^/]+)\/v1\/fill\/[^/]+\/(.*)/;
  const match = url.match(wixFillRegex);
  if (match) {
    const mediaBase = match[1];
    const filename = match[2] || "image.jpg";
    return `${mediaBase}/v1/fill/w_1440,h_900,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/${filename}`;
  }
  return url;
}

/**
 * Process all extracted images: upscale Wix URLs, filter junk
 */
function processImageUrls(urls: string[]): string[] {
  return urls.map((url) => {
    if (url.includes("static.wixstatic.com")) {
      return upscaleWixImageUrl(url);
    }
    return url;
  });
}

/* ================================================================== */
/*  Image extraction — handles many source patterns                    */
/* ================================================================== */

function extractImageUrls(content: string, baseOrigin?: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;

  // 1. Markdown images: ![alt](url)
  const mdRegex = /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g;
  while ((match = mdRegex.exec(content)) !== null) urls.push(match[1]);

  // 2. HTML img tags: <img src="url"> and <img data-src="url">
  const imgSrcRegex = /<img[^>]+(?:src|data-src)=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  while ((match = imgSrcRegex.exec(content)) !== null) urls.push(match[1]);

  // 3. srcset attribute (pick the largest/first URL)
  const srcsetRegex = /srcset=["']([^"']+)["']/gi;
  while ((match = srcsetRegex.exec(content)) !== null) {
    const firstUrl = match[1].split(",")[0].trim().split(/\s+/)[0];
    if (firstUrl.startsWith("http")) urls.push(firstUrl);
  }

  // 4. CSS background-image: url(...)
  const bgImageRegex = /background(?:-image)?:\s*url\(["']?(https?:\/\/[^"')]+)["']?\)/gi;
  while ((match = bgImageRegex.exec(content)) !== null) urls.push(match[1]);

  // 5. Wix-specific: static.wixstatic.com media URLs embedded anywhere
  const wixMediaRegex = /(https?:\/\/static\.wixstatic\.com\/media\/[^\s"')<>]+)/gi;
  while ((match = wixMediaRegex.exec(content)) !== null) urls.push(match[1]);

  // 6. Wix video poster / data attributes
  const wixDataRegex = /data-(?:src|image-href|pin-media|poster)=["'](https?:\/\/[^"']+)["']/gi;
  while ((match = wixDataRegex.exec(content)) !== null) urls.push(match[1]);

  // 7. Bare image URLs
  const bareUrlRegex = /(?:^|\s|["'(])(https?:\/\/[^\s"')]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"')]*)?)/gi;
  while ((match = bareUrlRegex.exec(content)) !== null) urls.push(match[1]);

  // 8. Relative image URLs (resolve against base)
  if (baseOrigin) {
    const relativeRegex = /(?:src|data-src|href)=["'](\/[^"']+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^"']*)?)["']/gi;
    while ((match = relativeRegex.exec(content)) !== null) {
      try {
        urls.push(new URL(match[1], baseOrigin).href);
      } catch { /* skip invalid */ }
    }
  }

  // Filter junk
  const filtered = urls.filter((url) => {
    const lower = url.toLowerCase();
    if (lower.includes("favicon")) return false;
    if (lower.includes("tracking") || lower.includes("pixel")) return false;
    if (lower.includes("1x1") || lower.includes("spacer")) return false;
    if (lower.includes(".gif") && lower.includes("track")) return false;
    if (lower.includes("data:image")) return false;
    if (lower.endsWith(".svg") && !lower.includes("logo")) return false;
    // Skip tiny Wix thumbnails (less than 100px wide)
    if (lower.includes("wixstatic.com") && /w_[1-9][0-9]?,/.test(lower)) return false;
    return true;
  });

  return [...new Set(filtered)];
}

/* ================================================================== */
/*  Video extraction                                                   */
/* ================================================================== */

function extractVideoUrls(content: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;

  // Direct video file URLs (.mp4, .webm)
  const videoFileRegex = /(https?:\/\/[^\s"')]+\.(?:mp4|webm)(?:\?[^\s"')]*)?)/gi;
  while ((match = videoFileRegex.exec(content)) !== null) urls.push(match[1]);

  // Wix video URLs (video.wixstatic.com)
  const wixVideoRegex = /(https?:\/\/video\.wixstatic\.com\/video\/[^\s"')<>]+)/gi;
  while ((match = wixVideoRegex.exec(content)) !== null) urls.push(match[1]);

  // HTML video/source tags
  const videoSrcRegex = /<(?:video|source)[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  while ((match = videoSrcRegex.exec(content)) !== null) urls.push(match[1]);

  // OG video meta tags (both orderings)
  const ogVideoRegex = /<meta[^>]+(?:property|name)=["']og:video["'][^>]+content=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  while ((match = ogVideoRegex.exec(content)) !== null) urls.push(match[1]);
  const ogVideoRegex2 = /<meta[^>]+content=["'](https?:\/\/[^"']+)["'][^>]+(?:property|name)=["']og:video["'][^>]*>/gi;
  while ((match = ogVideoRegex2.exec(content)) !== null) urls.push(match[1]);

  return [...new Set(urls)];
}

/* ================================================================== */
/*  CSS color extraction — pull actual brand colors from HTML/CSS      */
/* ================================================================== */

function extractCssColors(html: string): string[] {
  const colorCounts = new Map<string, number>();

  // Helper: normalize a hex color to 6-char lowercase
  function normalizeHex(hex: string): string | null {
    let clean = hex.replace("#", "").toLowerCase();
    if (clean.length === 3) clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    if (clean.length !== 6 || !/^[0-9a-f]{6}$/.test(clean)) return null;
    return `#${clean}`;
  }

  // Helper: rgb(r,g,b) → hex
  function rgbToHex(r: number, g: number, b: number): string | null {
    if ([r, g, b].some((v) => v < 0 || v > 255)) return null;
    return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  }

  // Helper: check if a color is "boring" (pure white, black, or near-transparent grays)
  function isBoring(hex: string): boolean {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    // Pure black/white
    if ((r === 0 && g === 0 && b === 0) || (r === 255 && g === 255 && b === 255)) return true;
    // Near-black or near-white grays (r ≈ g ≈ b, and either very dark or very light)
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    if (spread < 10 && (r < 30 || r > 230)) return true;
    return false;
  }

  function addColor(hex: string | null) {
    if (!hex || isBoring(hex)) return;
    colorCounts.set(hex, (colorCounts.get(hex) || 0) + 1);
  }

  let match: RegExpExecArray | null;

  // 1. Hex colors in inline styles and CSS: #abc, #aabbcc
  const hexRegex = /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*(#[0-9a-fA-F]{3,8})/gi;
  while ((match = hexRegex.exec(html)) !== null) addColor(normalizeHex(match[1]));

  // 2. rgb/rgba values
  const rgbRegex = /(?:color|background(?:-color)?|border(?:-color)?|fill|stroke)\s*:\s*rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi;
  while ((match = rgbRegex.exec(html)) !== null) addColor(rgbToHex(+match[1], +match[2], +match[3]));

  // 3. CSS custom properties that look like colors
  const cssVarRegex = /--[a-zA-Z-]+:\s*(#[0-9a-fA-F]{3,8})/gi;
  while ((match = cssVarRegex.exec(html)) !== null) addColor(normalizeHex(match[1]));

  // 4. CSS custom property rgb values
  const cssVarRgbRegex = /--[a-zA-Z-]+:\s*rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/gi;
  while ((match = cssVarRgbRegex.exec(html)) !== null) addColor(rgbToHex(+match[1], +match[2], +match[3]));

  // 5. Standalone hex colors in style attributes (more permissive)
  const inlineHexRegex = /style="[^"]*?(#[0-9a-fA-F]{3,6})[^"]*?"/gi;
  while ((match = inlineHexRegex.exec(html)) !== null) addColor(normalizeHex(match[1]));

  // Sort by frequency (most used first), return top 15
  return [...colorCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([hex, count]) => `${hex} (used ${count}x)`);
}

/* ================================================================== */
/*  OG image extraction                                                */
/* ================================================================== */

function extractOgImages(content: string): string[] {
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  const r1 = /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  while ((match = r1.exec(content)) !== null) urls.push(match[1]);
  const r2 = /<meta[^>]+content=["'](https?:\/\/[^"']+)["'][^>]+(?:property|name)=["']og:image["'][^>]*>/gi;
  while ((match = r2.exec(content)) !== null) urls.push(match[1]);
  return [...new Set(urls)];
}

/* ================================================================== */
/*  Internal link extraction                                           */
/* ================================================================== */

function extractInternalLinks(content: string, baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const links: string[] = [];
  let match: RegExpExecArray | null;

  // href="..." from HTML
  const hrefRegex = /href=["'](\/[^"'#]+|https?:\/\/[^"'#]+)["']/gi;
  while ((match = hrefRegex.exec(content)) !== null) {
    try {
      const resolved = new URL(match[1], base.origin);
      if (resolved.hostname === base.hostname) {
        links.push(resolved.href.replace(/\/$/, ""));
      }
    } catch { /* skip */ }
  }

  // Markdown links: [text](url)
  const mdLinkRegex = /\[[^\]]*\]\((\/[^)#]+|https?:\/\/[^)#]+)\)/g;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    try {
      const resolved = new URL(match[1], base.origin);
      if (resolved.hostname === base.hostname) {
        links.push(resolved.href.replace(/\/$/, ""));
      }
    } catch { /* skip */ }
  }

  // Deduplicate, remove homepage, filter out assets
  const homeUrl = base.origin + (base.pathname === "/" ? "" : base.pathname.replace(/\/$/, ""));
  return [...new Set(links)].filter((link) => {
    if (link === homeUrl || link === base.origin) return false;
    const path = new URL(link).pathname.toLowerCase();
    // Skip asset files, anchors, external links
    if (/\.(js|css|xml|txt|pdf|zip|ico)$/.test(path)) return false;
    if (path.includes("/_") || path.includes("/api/")) return false;
    return true;
  });
}

/* ================================================================== */
/*  Prioritize subpage URLs by relevance                               */
/* ================================================================== */

function prioritizeSubpages(links: string[], maxPages: number): string[] {
  // High-value keywords for discovering content-rich subpages
  const highPriority = [
    "gallery", "photo", "image", "media",
    "pricing", "price", "rates", "cost",
    "services", "activities", "what-we-do",
    "about", "story", "team",
    "wake", "aqua", "surf", "kayak", "paddle",
    "book", "session", "package",
    "contact", "location", "find-us",
    "shop", "store", "gift",
    "faq", "reviews", "testimonial",
  ];

  const scored = links.map((link) => {
    const path = new URL(link).pathname.toLowerCase();
    let score = 0;
    for (const kw of highPriority) {
      if (path.includes(kw)) score += 10;
    }
    // Prefer shorter paths (more likely to be main section pages)
    const depth = path.split("/").filter(Boolean).length;
    score -= depth * 2;
    return { link, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxPages).map((s) => s.link);
}

/* ================================================================== */
/*  Single page scrape via Firecrawl                                   */
/* ================================================================== */

/* ================================================================== */
/*  Basic fetch helper (works without any API key)                     */
/* ================================================================== */

async function fetchPage(url: string, timeout = 15000): Promise<ScrapeResult> {
  const baseOrigin = new URL(url).origin;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(timeout),
    });
    if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
    const html = await res.text();

    // Extract from raw HTML before stripping tags
    const ogImages = extractOgImages(html);
    const regularImages = extractImageUrls(html, baseOrigin);
    const extractedImages = [...new Set([...ogImages, ...regularImages])];
    const extractedVideos = extractVideoUrls(html);
    const extractedColors = extractCssColors(html);
    const internalLinks = extractInternalLinks(html, url);

    // Strip to plain text for markdown content
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 25000);

    return { success: true, markdown: text, extractedImages, extractedVideos, extractedColors, internalLinks };
  } catch (err) {
    return { success: false, error: `Fetch failed: ${err instanceof Error ? err.message : "Unknown"}` };
  }
}

/* ================================================================== */
/*  Single page scrape via Firecrawl (with basic-fetch fallback)       */
/* ================================================================== */

async function scrapeOnePage(url: string, apiKey: string | undefined): Promise<ScrapeResult> {
  // No Firecrawl key → use basic fetch
  if (!apiKey) return fetchPage(url);

  const baseOrigin = new URL(url).origin;
  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "rawHtml", "screenshot", "links"],
        waitFor: 5000,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      // Firecrawl failed — fall back to basic fetch
      return fetchPage(url);
    }

    const data = await response.json();
    const markdown = data.data?.markdown || "";
    const rawHtml = data.data?.rawHtml || "";
    const screenshotUrl = data.data?.screenshot || undefined;
    const firecrawlLinks: string[] = data.data?.links || [];

    const combinedContent = markdown + "\n" + rawHtml;

    // Extract OG images (high priority)
    const ogImages = extractOgImages(rawHtml);
    const regularImages = extractImageUrls(combinedContent, baseOrigin);
    const extractedImages = [...new Set([...ogImages, ...regularImages])];

    // Extract videos
    const extractedVideos = extractVideoUrls(combinedContent);

    // Extract CSS colors from rawHtml
    const extractedColors = extractCssColors(rawHtml);

    // Extract internal links from both Firecrawl links output and HTML
    const htmlLinks = extractInternalLinks(combinedContent, url);
    const allLinks = [...new Set([...firecrawlLinks, ...htmlLinks])].filter((link) => {
      try {
        return new URL(link).hostname === new URL(url).hostname;
      } catch { return false; }
    });

    return {
      success: true,
      markdown: markdown.slice(0, 25000),
      screenshotUrl,
      extractedImages,
      extractedVideos,
      extractedColors,
      internalLinks: allLinks,
    };
  } catch {
    // Network error — fall back to basic fetch
    return fetchPage(url);
  }
}

/* ================================================================== */
/*  Subpage scrape (lighter — markdown + rawHtml only, no screenshot)  */
/* ================================================================== */

async function scrapeSubpage(url: string, apiKey: string | undefined): Promise<ScrapeResult> {
  // No Firecrawl key → use basic fetch
  if (!apiKey) {
    const result = await fetchPage(url, 12000);
    if (result.success && result.markdown) {
      result.markdown = result.markdown.slice(0, 15000);
    }
    return result;
  }

  const baseOrigin = new URL(url).origin;
  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "rawHtml"],
        waitFor: 5000,
      }),
      signal: AbortSignal.timeout(25000),
    });

    if (!response.ok) {
      // Fall back to basic fetch
      const result = await fetchPage(url, 12000);
      if (result.success && result.markdown) {
        result.markdown = result.markdown.slice(0, 15000);
      }
      return result;
    }

    const data = await response.json();
    const markdown = data.data?.markdown || "";
    const rawHtml = data.data?.rawHtml || "";
    const combined = markdown + "\n" + rawHtml;

    const ogImages = extractOgImages(rawHtml);
    const regularImages = extractImageUrls(combined, baseOrigin);
    const extractedImages = [...new Set([...ogImages, ...regularImages])];
    const extractedVideos = extractVideoUrls(combined);
    const extractedColors = extractCssColors(rawHtml);

    return {
      success: true,
      markdown: markdown.slice(0, 15000),
      extractedImages,
      extractedVideos,
      extractedColors,
    };
  } catch {
    // Fall back to basic fetch
    return fetchPage(url, 12000);
  }
}

/* ================================================================== */
/*  Firecrawl Map — discover all site URLs                             */
/* ================================================================== */

async function discoverSiteUrls(url: string, apiKey: string): Promise<string[]> {
  try {
    const response = await fetch("https://api.firecrawl.dev/v1/map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ url, limit: 50 }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.links || data.data || []) as string[];
  } catch {
    return [];
  }
}

/* ================================================================== */
/*  Scrape limits — free tier vs paid (future)                         */
/* ================================================================== */

const SCRAPE_LIMITS = {
  maxSubpages: 2,      // free tier: homepage + 2 subpages
  maxImages: 20,        // enough for hero, gallery, activities
  maxVideos: 4,
  maxMarkdownChars: 20000,
  subpageMarkdownCap: 8000,
};

/* ================================================================== */
/*  Multi-page scrape orchestrator                                     */
/* ================================================================== */

async function scrapeMultiPage(url: string): Promise<MultiPageScrapeResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY || undefined;

  // Step 1: Scrape the homepage
  const homePage = await scrapeOnePage(url, apiKey);
  if (!homePage.success || !homePage.markdown) {
    return {
      success: false,
      combinedMarkdown: "",
      allImages: [],
      allVideos: [],
      allColors: [],
      discoveredUrls: [],
      error: homePage.error || "Failed to scrape homepage",
    };
  }

  let allImages = [...(homePage.extractedImages || [])];
  let allVideos = [...(homePage.extractedVideos || [])];
  let allColors = [...(homePage.extractedColors || [])];
  const markdownParts = [`=== HOMEPAGE (${url}) ===\n${homePage.markdown?.slice(0, SCRAPE_LIMITS.maxMarkdownChars)}`];

  // Step 2: Discover subpages
  let discoveredLinks: string[] = [...(homePage.internalLinks || [])];

  if (apiKey) {
    try {
      const mapUrls = await discoverSiteUrls(url, apiKey);
      discoveredLinks = [...new Set([...discoveredLinks, ...mapUrls])];
    } catch { /* map failed — continue with homepage links */ }
  }

  // Step 3: Pick best subpages
  const subpageUrls = prioritizeSubpages(discoveredLinks, SCRAPE_LIMITS.maxSubpages);

  if (subpageUrls.length > 0) {
    const subpageResults = await Promise.all(
      subpageUrls.map((subUrl) => scrapeSubpage(subUrl, apiKey))
    );

    for (let i = 0; i < subpageResults.length; i++) {
      const result = subpageResults[i];
      if (result.success && result.markdown) {
        markdownParts.push(
          `\n\n=== SUBPAGE: ${subpageUrls[i]} ===\n${result.markdown.slice(0, SCRAPE_LIMITS.subpageMarkdownCap)}`
        );
        if (result.extractedImages) allImages.push(...result.extractedImages);
        if (result.extractedVideos) allVideos.push(...result.extractedVideos);
        if (result.extractedColors) allColors.push(...result.extractedColors);
      }
    }
  }

  // Deduplicate, upscale Wix URLs, and cap
  allImages = processImageUrls([...new Set(allImages)]).slice(0, SCRAPE_LIMITS.maxImages);
  allVideos = [...new Set(allVideos)].slice(0, SCRAPE_LIMITS.maxVideos);
  allColors = [...new Set(allColors)].slice(0, 15);

  // Combine markdown with total cap
  const combinedMarkdown = markdownParts.join("\n").slice(0, SCRAPE_LIMITS.maxMarkdownChars);

  // Filter discovered links: remove homepage and URLs that were already scraped as subpages
  const scrapedSet = new Set([url, ...subpageUrls]);
  const remainingDiscovered = discoveredLinks.filter((link) => !scrapedSet.has(link));

  return {
    success: true,
    combinedMarkdown,
    screenshotUrl: homePage.screenshotUrl,
    allImages,
    allVideos,
    allColors,
    discoveredUrls: remainingDiscovered,
  };
}

/* ================================================================== */
/*  Main pipeline: scrape → analyze → design guide → blueprint         */
/* ================================================================== */

export async function scrapeAndGenerate(url: string): Promise<{
  success: boolean;
  blueprint?: BlueprintState;
  error?: string;
}> {
  // Deduct credit before doing any work
  const creditResult = await deductCredit();
  if (!creditResult.success) {
    return { success: false, error: "NO_CREDITS" };
  }

  // Validate URL before doing any work
  const validation = validateUrl(url);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Step 1: Multi-page scrape
  const scrapeResult = await scrapeMultiPage(url);

  if (!scrapeResult.success || !scrapeResult.combinedMarkdown) {
    return {
      success: false,
      error: scrapeResult.error || "Failed to scrape the website.",
    };
  }

  // Step 2: Stage 1 — Content Analysis (Sonnet — fast & cost-effective for extraction)
  let contentBrief: ContentBrief;

  // Build the user prompt with content, images, and videos
  const buildStage1Prompt = (markdown: string, images: string[], videos: string[], colors: string[]) => {
    let prompt = `Analyze the following scraped website content and produce a structured content brief as JSON.\n\nURL: ${url}\n\nSCRAPED CONTENT:\n${markdown}`;
    if (images.length > 0) {
      prompt += `\n\n=== IMAGES FOUND (${images.length}) ===\nCatalog ALL images in imageCatalog. Best photo = hero (priority 1).\n${images.map((img, i) => `${i + 1}. ${img}`).join("\n")}`;
    }
    if (videos.length > 0) {
      prompt += `\n\n=== VIDEOS FOUND ===\n${videos.map((vid, i) => `${i + 1}. ${vid}`).join("\n")}`;
    }
    if (colors.length > 0) {
      prompt += `\n\n=== BRAND COLORS EXTRACTED FROM CSS ===\nThese are the actual colors used on the original website, sorted by frequency. Use these to inform your templateRecommendation and pass them through so the design guide and blueprint can match the original brand palette.\n${colors.join("\n")}`;
    }
    prompt += "\n\nReturn ONLY the JSON object.";
    return prompt;
  };

  // Try with full content, then retry with trimmed content if truncated
  const attempts = [
    { markdown: scrapeResult.combinedMarkdown, images: scrapeResult.allImages, videos: scrapeResult.allVideos, colors: scrapeResult.allColors },
    { markdown: scrapeResult.combinedMarkdown.slice(0, 12000), images: scrapeResult.allImages.slice(0, 12), videos: scrapeResult.allVideos.slice(0, 2), colors: scrapeResult.allColors },
  ];

  let lastError = "";
  for (const attempt of attempts) {
    try {
      const stage1Message = await anthropic.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 12000,
        system: CONTENT_ANALYSIS_SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildStage1Prompt(attempt.markdown, attempt.images, attempt.videos, attempt.colors) }],
      });

      // Truncated → try again with less content
      if (stage1Message.stop_reason === "max_tokens") {
        lastError = "Response truncated";
        continue;
      }

      const stage1Text = stage1Message.content.find((c) => c.type === "text");
      if (!stage1Text || stage1Text.type !== "text") {
        lastError = "No text response";
        continue;
      }

      let jsonStr = stage1Text.text.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }

      contentBrief = JSON.parse(jsonStr) as ContentBrief;

      if (!contentBrief.business?.name || !contentBrief.contentSections?.length) {
        lastError = "Missing required fields in content brief";
        continue;
      }

      // Success — break out of retry loop
      break;
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
      continue;
    }
  }

  // @ts-expect-error — contentBrief is assigned inside the loop on success
  if (!contentBrief) {
    return { success: false, error: `Stage 1: Content analysis failed: ${lastError}` };
  }

  // Step 3.5: Stage 1.5 — Gemini Design Consultant
  let designGuideContext = "";
  const contentBriefStr = JSON.stringify(contentBrief, null, 2);
  try {
    const geminiResult = await getGeminiDesignGuide(contentBriefStr, url);
    if (geminiResult.success && geminiResult.guide) {
      designGuideContext = `\n\n=== DESIGN GUIDE FROM SENIOR DESIGNER ===
A senior designer has reviewed the content brief and produced the following design layout guide.
You MUST follow these design directions closely — they specify exact section ordering, visual treatments, spacing, and interaction patterns.
If the guide conflicts with default niche template behavior, prefer the guide's recommendations.

${geminiResult.guide}

=== END DESIGN GUIDE ===`;
    }
  } catch {
    // Silently continue — design guide is an enhancement, not a requirement
  }

  // Step 4: Stage 2 — Blueprint Generation
  try {
    const stage2Message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 16384,
      system: BLUEPRINT_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a complete, modern website blueprint from this content brief. Return ONLY the BlueprintState JSON object.

CONTENT BRIEF:
${contentBriefStr}${designGuideContext}`,
        },
      ],
    });

    // Check for truncation
    if (stage2Message.stop_reason === "max_tokens") {
      return { success: false, error: "Stage 2: Blueprint response was truncated." };
    }

    const stage2Text = stage2Message.content.find((c) => c.type === "text");
    if (!stage2Text || stage2Text.type !== "text") {
      return { success: false, error: "Stage 2: No text response from AI." };
    }

    let jsonStr = stage2Text.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const blueprint: BlueprintState = JSON.parse(jsonStr);

    // Validate: accept either niche path or block path
    const isNichePath = blueprint.nicheTemplate && blueprint.nicheData;
    const isBlockPath = blueprint.layout && Array.isArray(blueprint.layout) && blueprint.layout.length > 0;

    if (!isNichePath && !isBlockPath) {
      return { success: false, error: "Stage 2: Invalid blueprint: must have either nicheTemplate+nicheData or a non-empty layout array." };
    }

    if (!blueprint.layout) blueprint.layout = [];

    if (!blueprint.colorScheme) {
      return { success: false, error: "Stage 2: Invalid blueprint: missing colorScheme." };
    }

    // Attach discovered pages from the scrape step
    if (scrapeResult.discoveredUrls.length > 0) {
      blueprint.discoveredPages = buildDiscoveredPages(scrapeResult.discoveredUrls);
    }

    return { success: true, blueprint };
  } catch (err) {
    return {
      success: false,
      error: `Stage 2: Blueprint generation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
