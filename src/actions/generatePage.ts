"use server";

import { anthropic } from "@/lib/anthropic";
import type { BlueprintState, BlueprintPage } from "@/types/blueprint";

const PAGE_GENERATION_PROMPT = `You are an expert web designer AI that generates a single page layout as JSON for an existing multi-page website.

CRITICAL RULES:
1. Return ONLY valid JSON. No markdown, no explanation, no code fences.
2. Your output must be a JSON object with a "layout" array of blocks following the BlueprintState block schema.
3. Design this page to match the existing site's color scheme, font, and template style.
4. Use ONLY the scraped content — do not invent content. If very little content is available, create a minimal but well-designed page.
5. NEVER fabricate image URLs — only use URLs found in the scraped content.

BLOCK TYPES AVAILABLE:
navbar, hero, serviceGrid, contentSplit, contactCTA, testimonials, pricingGrid, statsBar, gallery, faq, teamGrid, logoBar, footer

Each block supports a "variant" field and "sectionPadding": "compact" | "default" | "spacious".

OUTPUT FORMAT:
{
  "layout": [ ...array of blocks... ]
}

Generate a complete, well-structured page with navbar, content sections, and footer.`;

/**
 * Scrape a single page via Firecrawl (or fetch fallback) and generate a layout.
 */
export async function generatePage(
  pageUrl: string,
  pageName: string,
  existingBlueprint: BlueprintState
): Promise<{
  success: boolean;
  page?: BlueprintPage;
  error?: string;
}> {
  const apiKey = process.env.FIRECRAWL_API_KEY || undefined;

  // Step 1: Scrape the page
  let markdown = "";
  let images: string[] = [];

  if (apiKey) {
    try {
      const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: pageUrl,
          formats: ["markdown", "rawHtml"],
          waitFor: 5000,
        }),
        signal: AbortSignal.timeout(25000),
      });

      if (response.ok) {
        const data = await response.json();
        markdown = (data.data?.markdown || "").slice(0, 15000);
        const rawHtml = data.data?.rawHtml || "";
        // Quick image extraction from raw HTML
        const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+)["'][^>]*>/gi;
        let match;
        while ((match = imgRegex.exec(rawHtml)) !== null) images.push(match[1]);
        images = [...new Set(images)].slice(0, 10);
      }
    } catch {
      // Fall through to fetch fallback
    }
  }

  if (!markdown) {
    try {
      const res = await fetch(pageUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        const html = await res.text();
        markdown = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 15000);
      }
    } catch {
      // Scrape failed entirely
    }
  }

  if (!markdown) {
    return { success: false, error: "Failed to scrape the page." };
  }

  // Step 2: Generate layout via Claude
  const designContext = {
    siteName: existingBlueprint.siteName,
    colorScheme: existingBlueprint.colorScheme,
    font: existingBlueprint.font,
    template: existingBlueprint.template,
  };

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8000,
      system: PAGE_GENERATION_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate a "${pageName}" page layout for the site "${existingBlueprint.siteName}".

EXISTING SITE DESIGN CONTEXT (match this style):
${JSON.stringify(designContext, null, 2)}

SCRAPED PAGE CONTENT:
${markdown}${images.length > 0 ? `\n\nIMAGES FOUND:\n${images.map((img, i) => `${i + 1}. ${img}`).join("\n")}` : ""}

Return ONLY the JSON object with a "layout" array.`,
        },
      ],
    });

    const textBlock = message.content.find((c) => c.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return { success: false, error: "No response from AI." };
    }

    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const result = JSON.parse(jsonStr);
    const layout = result.layout;

    if (!Array.isArray(layout)) {
      return { success: false, error: "Invalid layout response." };
    }

    const slug = pageName.toLowerCase().replace(/\s+/g, "-");

    const page: BlueprintPage = {
      id: crypto.randomUUID(),
      name: pageName,
      slug,
      layout,
    };

    return { success: true, page };
  } catch (err) {
    return {
      success: false,
      error: `Page generation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
