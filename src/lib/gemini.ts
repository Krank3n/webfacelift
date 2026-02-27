/**
 * Gemini Design Consultant — Stage 1.5
 *
 * Takes the content brief from Stage 1 and asks Gemini 3.1 Pro
 * to produce an opinionated, high-end design layout guide.
 * This guide is then fed to Claude in Stage 2 to produce
 * significantly richer blueprint output.
 */

const GEMINI_DESIGN_SYSTEM = `You are an elite web design director at a top creative agency. You produce hyper-specific design layout guides that a junior designer can follow to build a premium website.

You will receive a structured content brief for a business website. Your job is to output a DESIGN GUIDE — a detailed, section-by-section blueprint of the ideal website layout, visual treatment, and interaction patterns.

YOUR OUTPUT MUST BE SPECIFIC, NOT GENERIC. Reference the actual business content, colors, and images from the brief.

OUTPUT FORMAT (plain text, not JSON):

=== DESIGN DIRECTION ===
[2-3 sentences on overall design personality, visual mood, and reference sites]

=== COLOR STRATEGY ===
[How to use the brand colors: which color for backgrounds, text, accents, CTAs, overlays. Include specific opacity values and gradient directions]

=== TYPOGRAPHY HIERARCHY ===
[Font size scale: hero heading, section heading, subheading, body, caption. Weight and letter-spacing for each level]

=== SECTION LAYOUT (ordered) ===
For each section, specify:
- Section name and purpose
- Background treatment (color, gradient, image, video)
- Layout structure (grid columns, max-width, padding)
- Key components and their visual treatment
- Card/element styles (border-radius, shadows, hover effects)
- Spacing rhythm (gap between elements)

=== ANIMATION & INTERACTION ===
[Specific scroll animations, hover effects, loading transitions, micro-interactions]

=== CTA STRATEGY ===
[Where CTAs appear, button styles, urgency patterns, booking flow]

=== TRUST & SOCIAL PROOF PLACEMENT ===
[Where to place stats, testimonials, badges, ratings for maximum impact]

=== MOBILE ADAPTATIONS ===
[Key responsive breakpoints and what changes at each]

RULES:
1. Be SPECIFIC — say "24px border-radius with 1px border at rgba(255,255,255,0.08)" not "rounded with subtle border"
2. Reference the actual business name, services, and images from the brief
3. Order sections for maximum conversion (hook → credibility → detail → social proof → CTA)
4. Design for the specific niche — a water sports park needs energy and adrenaline, a law firm needs authority and trust
5. Include at least 14 sections in your layout. More sections = more visual variety = more premium feel
6. Every section should have a distinct visual treatment — alternate between light/dark backgrounds, full-bleed and contained layouts
7. Think about what HansenDev, Awwwards-winning sites, and top Webflow templates do — parallax, glassmorphism, staggered grids, gradient meshes, animated counters
8. For pricing: always recommend multi-tier card layout with a highlighted "best value" option
9. For hero: always recommend full-viewport with overlay, animated elements, and dual CTA buttons
10. Include "Why Choose Us" feature grid, combo/bundle highlights, and secondary service cards in your layout
11. COLORS MUST MATCH THE ACTUAL BRAND: Extract real brand colors from the content brief (look at business name, industry, any color hints in the scraped content). A construction company might use navy + orange + white. A wake park might use deep blue + cyan + white. A law firm might use navy + gold + cream. NEVER default to generic palettes — always design for THIS specific business.
12. TEXT CONTRAST: For every section in your layout, specify whether text should be light or dark based on the section background. Dark backgrounds (#0a0a0a-#4a4a4a) → white/light text. Light backgrounds (#f0f0f0-#ffffff) → dark text (#1a1a1a). This is non-negotiable.
13. For the CONTACT section: design it to match the site's brand — use the primary/accent colors, match the card style to the rest of the site. It should feel like part of the design, not a generic form. Recommend specific styling: background color, input field styles, button treatment, and layout (side-by-side info+form or stacked).`;

export interface GeminiDesignGuide {
  guide: string;
  success: boolean;
  error?: string;
}

export async function getGeminiDesignGuide(
  contentBriefJson: string,
  businessUrl: string
): Promise<GeminiDesignGuide> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      guide: "",
      error: "GEMINI_API_KEY not configured — skipping design guide step.",
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: GEMINI_DESIGN_SYSTEM }],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Create a premium design layout guide for this website redesign.

ORIGINAL URL: ${businessUrl}

CONTENT BRIEF:
${contentBriefJson}

Produce the full design guide now. Be extremely specific and reference the actual content from the brief.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        }),
        signal: AbortSignal.timeout(60000),
      }
    );

    if (!response.ok) {
      const errBody = await response.text();
      return {
        success: false,
        guide: "",
        error: `Gemini API error (${response.status}): ${errBody.slice(0, 500)}`,
      };
    }

    const data = await response.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!text) {
      return {
        success: false,
        guide: "",
        error: "Gemini returned empty response.",
      };
    }

    return { success: true, guide: text };
  } catch (err) {
    return {
      success: false,
      guide: "",
      error: `Gemini request failed: ${err instanceof Error ? err.message : "Unknown error"}`,
    };
  }
}
