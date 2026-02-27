"use server";

import {
  anthropic,
  CONTENT_ANALYSIS_SYSTEM_PROMPT,
  BLUEPRINT_SYSTEM_PROMPT,
} from "@/lib/anthropic";
import { getGeminiDesignGuide } from "@/lib/gemini";
import type { BlueprintState } from "@/types/blueprint";
import type { ContentBrief } from "@/types/content-brief";

interface ScrapeResult {
  success: boolean;
  markdown?: string;
  screenshotUrl?: string;
  extractedImages?: string[];
  extractedVideos?: string[];
  error?: string;
}

function extractImageUrls(content: string): string[] {
  const urls: string[] = [];

  // 1. Markdown images: ![alt](url)
  const mdRegex = /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g;
  let match;
  while ((match = mdRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  // 2. HTML img tags: <img src="url"> (Firecrawl often leaves these in markdown)
  const imgTagRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  while ((match = imgTagRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  // 3. Bare image URLs (common in markdown output)
  const bareUrlRegex = /(?:^|\s)(https?:\/\/[^\s"')]+\.(?:jpg|jpeg|png|webp|avif)(?:\?[^\s"')]*)?)/gi;
  while ((match = bareUrlRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  // Filter out junk images
  const filtered = urls.filter((url) => {
    const lower = url.toLowerCase();
    if (lower.includes("favicon")) return false;
    if (lower.includes("tracking") || lower.includes("pixel")) return false;
    if (lower.includes("1x1") || lower.includes("spacer")) return false;
    if (lower.includes(".gif") && lower.includes("track")) return false;
    if (lower.includes("data:image")) return false;
    // Keep SVGs only if they look like logos (not icons/decorations)
    if (lower.endsWith(".svg") && !lower.includes("logo")) return false;
    return true;
  });

  // Deduplicate and cap at 30
  return [...new Set(filtered)].slice(0, 30);
}

function extractVideoUrls(content: string): string[] {
  const urls: string[] = [];

  // Direct video file URLs (.mp4, .webm)
  const videoFileRegex = /(https?:\/\/[^\s"')]+\.(?:mp4|webm)(?:\?[^\s"')]*)?)/gi;
  let match;
  while ((match = videoFileRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  // HTML video source tags
  const videoSrcRegex = /<(?:video|source)[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  while ((match = videoSrcRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  // Open Graph video meta tags
  const ogVideoRegex = /<meta[^>]+(?:property|name)=["']og:video["'][^>]+content=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  while ((match = ogVideoRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  // Reverse order OG tags (content before property)
  const ogVideoRegex2 = /<meta[^>]+content=["'](https?:\/\/[^"']+)["'][^>]+(?:property|name)=["']og:video["'][^>]*>/gi;
  while ((match = ogVideoRegex2.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return [...new Set(urls)];
}

function extractOgImages(content: string): string[] {
  const urls: string[] = [];
  const ogImageRegex = /<meta[^>]+(?:property|name)=["']og:image["'][^>]+content=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
  let match;
  while ((match = ogImageRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }
  const ogImageRegex2 = /<meta[^>]+content=["'](https?:\/\/[^"']+)["'][^>]+(?:property|name)=["']og:image["'][^>]*>/gi;
  while ((match = ogImageRegex2.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return [...new Set(urls)];
}

async function scrapeWithFirecrawl(url: string): Promise<ScrapeResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY;

  if (!apiKey) {
    // Fallback: if no Firecrawl key, attempt a basic fetch
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; WebFaceliftBot/1.0; +https://webfacelift.io)",
        },
        signal: AbortSignal.timeout(15000),
      });
      const html = await res.text();
      // Extract images from HTML before stripping tags
      const extractedImages = extractImageUrls(html);
      // Resolve relative image URLs to absolute
      const baseUrl = new URL(url);
      const resolvedImages = extractedImages.map((imgUrl) => {
        try {
          return new URL(imgUrl, baseUrl.origin).href;
        } catch {
          return imgUrl;
        }
      });
      // Extract videos before stripping tags
      const extractedVideos = extractVideoUrls(html);
      // Basic HTML-to-text extraction
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 25000);
      return { success: true, markdown: text, extractedImages: resolvedImages, extractedVideos };
    } catch (err) {
      return {
        success: false,
        error: `Failed to fetch URL: ${err instanceof Error ? err.message : "Unknown error"}`,
      };
    }
  }

  try {
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "html", "screenshot"],
        waitFor: 5000,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return { success: false, error: `Firecrawl error: ${errBody}` };
    }

    const data = await response.json();
    const markdown = data.data?.markdown?.slice(0, 25000) || "";
    const html = data.data?.html || "";
    const screenshotUrl = data.data?.screenshot || undefined;
    const combinedContent = markdown + "\n" + html;
    // Extract OG images first (high priority), then regular images
    const ogImages = extractOgImages(html);
    const regularImages = extractImageUrls(combinedContent);
    // OG images get priority placement at the front
    const extractedImages = [...new Set([...ogImages, ...regularImages])].slice(0, 30);
    // Extract video URLs from both sources
    const extractedVideos = extractVideoUrls(combinedContent);

    return {
      success: true,
      markdown,
      screenshotUrl,
      extractedImages,
      extractedVideos,
    };
  } catch (err) {
    return {
      success: false,
      error: `Firecrawl request failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}

export async function scrapeAndGenerate(url: string): Promise<{
  success: boolean;
  blueprint?: BlueprintState;
  error?: string;
}> {
  // Step 1: Scrape
  const scrapeResult = await scrapeWithFirecrawl(url);

  if (!scrapeResult.success || !scrapeResult.markdown) {
    return {
      success: false,
      error: scrapeResult.error || "Failed to scrape the website.",
    };
  }

  // Step 2: Build image list for Stage 1
  let imageContext = "";
  if (scrapeResult.extractedImages && scrapeResult.extractedImages.length > 0) {
    const imageList = scrapeResult.extractedImages
      .map((img, i) => `${i + 1}. ${img}`)
      .join("\n");
    imageContext = `\n\n=== IMAGES FOUND ON THE SITE ===
You MUST catalog ALL of these images in your imageCatalog output. Do not skip any.

${imageList}`;
  }

  // Step 2b: Build video list for Stage 1
  let videoContext = "";
  if (scrapeResult.extractedVideos && scrapeResult.extractedVideos.length > 0) {
    const videoList = scrapeResult.extractedVideos
      .map((vid, i) => `${i + 1}. ${vid}`)
      .join("\n");
    videoContext = `\n\n=== VIDEOS FOUND ON THE SITE ===
Include these video URLs in the content brief. The first video is likely the hero/background video.

${videoList}`;
  }

  // Step 3: Stage 1 — Content Analysis
  let contentBrief: ContentBrief;
  try {
    const stage1Message = await anthropic.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 8192,
      system: CONTENT_ANALYSIS_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Analyze the following scraped website content and produce a structured content brief as JSON.

URL: ${url}

SCRAPED CONTENT:
${scrapeResult.markdown}${imageContext}${videoContext}

Return ONLY the JSON object.`,
        },
      ],
    });

    const stage1Text = stage1Message.content.find((c) => c.type === "text");
    if (!stage1Text || stage1Text.type !== "text") {
      return { success: false, error: "Stage 1: No text response from AI." };
    }

    let jsonStr = stage1Text.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    contentBrief = JSON.parse(jsonStr) as ContentBrief;

    // Validate Stage 1 output
    if (!contentBrief.business?.name) {
      return { success: false, error: "Stage 1: Missing business.name in content brief." };
    }
    if (!contentBrief.contentSections || contentBrief.contentSections.length === 0) {
      return { success: false, error: "Stage 1: Missing contentSections in content brief." };
    }
  } catch (err) {
    return {
      success: false,
      error: `Stage 1: Content analysis failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
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
    // If Gemini fails, we continue without the guide (graceful degradation)
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

    const stage2Text = stage2Message.content.find((c) => c.type === "text");
    if (!stage2Text || stage2Text.type !== "text") {
      return { success: false, error: "Stage 2: No text response from AI." };
    }

    let jsonStr = stage2Text.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const blueprint: BlueprintState = JSON.parse(jsonStr);

    // Basic validation: accept either niche path or block path
    const isNichePath = blueprint.nicheTemplate && blueprint.nicheData;
    const isBlockPath = blueprint.layout && Array.isArray(blueprint.layout) && blueprint.layout.length > 0;

    if (!isNichePath && !isBlockPath) {
      return { success: false, error: "Stage 2: Invalid blueprint: must have either nicheTemplate+nicheData or a non-empty layout array." };
    }

    // Ensure layout is at least an empty array
    if (!blueprint.layout) {
      blueprint.layout = [];
    }

    if (!blueprint.colorScheme) {
      return { success: false, error: "Stage 2: Invalid blueprint: missing colorScheme." };
    }

    return { success: true, blueprint };
  } catch (err) {
    return {
      success: false,
      error: `Stage 2: Blueprint generation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
