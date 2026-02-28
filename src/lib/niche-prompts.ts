export const NICHE_DETECTION_INSTRUCTIONS = `
NICHE TEMPLATE DETECTION:
Before generating a standard block layout, analyze the scraped content to determine if the business fits a known niche category. If it does, generate a rich niche-specific template instead of blocks.

SUPPORTED NICHES:
1. "water-sports" — Wake parks, surf schools, kayak rentals, jet ski, paddleboarding, water sports centers, boat tours
   Signals: words like "wakeboard", "surf", "kayak", "paddle", "boat", "lake", "wave", "swim", "aqua", "water park", "jet ski", booking systems, activity listings with difficulty levels
2. "lists" — Directories, catalogs, curated lists, resource collections, business listings, comparison sites
   Signals: repeated item cards/rows, category navigation, search/filter UI, "browse", "directory", "listings",
   "catalog", numbered/bulleted collections, "submit a listing", rating systems, large item counts

DECISION RULES:
- If you are CONFIDENT the business matches one of the supported niches above (water-sports or lists), output a niche template response.
- For ALL other business types, use the standard block layout. Do NOT attempt niche templates for restaurants, fitness, professional services, or any other category — only water-sports and lists have dedicated templates.
- When in doubt, prefer block layout.
- A niche template response has: nicheTemplate (the niche string), nicheData (the rich business data), and layout: [] (empty array).
- A standard block response has: nicheTemplate absent, nicheData absent, and layout: [...blocks...] (non-empty).

NICHE TEMPLATE RESPONSE FORMAT:
When outputting a niche template, the JSON must include:
{
  "siteName": string,
  "colorScheme": { ... },
  "font": string,
  "template": string,
  "layout": [],
  "nicheTemplate": "water-sports" | "lists",
  "nicheData": { ... NicheBusinessData ... }
}
`;

export const NICHE_DATA_SCHEMA = `
NICHE DATA SCHEMA (nicheData):
{
  "businessName": string (required),
  "tagline": string (required — catchy one-liner),
  "description": string (required — 1-3 sentences),
  "heroImage": string (optional — URL of best hero image from scraped images),
  "logo": string (optional),
  "phone": string (optional),
  "email": string (optional),
  "address": string (optional),
  "colorScheme": {
    "primary": string (hex),
    "secondary": string (hex),
    "accent": string (hex),
    "background": string (hex),
    "text": string (hex)
  },
  "hours": [{ "day": string, "hours": string }] (optional),
  "stats": [{ "label": string, "value": string }] (optional — e.g. {"label": "Happy Customers", "value": "5000+"}),
  "testimonials": [{ "quote": string, "author": string, "role": string (optional), "rating": number 1-5 (optional) }] (optional),
  "gallery": [{ "url": string, "alt": string }] (optional — use scraped images),
  "pricing": [{ "name": string, "price": string, "period": string (optional), "features": [string], "highlighted": boolean }] (optional),
  "faq": [{ "question": string, "answer": string }] (optional — generate relevant FAQs from content),
  "team": [{ "name": string, "role": string, "image": string (optional), "bio": string (optional) }] (optional),
  "cta": { "heading": string, "description": string (optional), "buttonText": string, "buttonLink": string (optional) } (optional),
  "navLinks": [{ "label": string, "href": string }] (optional — section anchor links like "#activities"),
  "socialLinks": [{ "platform": string, "url": string }] (optional),
  "custom": { ... niche-specific fields ... } (required for niche templates)
}

PER-NICHE CUSTOM FIELDS:

For "water-sports" custom:
{
  "activities": [{ "name": string, "description": string, "difficulty": "beginner"|"intermediate"|"advanced", "price": string (optional), "image": string (optional) }],
  "bookingUrl": string (optional — look for FareHarbor, Rezdy, Bookeo, or similar booking system URLs),
  "parkStatus": { "openTime": "HH:MM", "closeTime": "HH:MM", "timezone": string (optional — e.g. "Australia/Brisbane"), "seasonStart": string (optional), "seasonEnd": string (optional) } (optional),
  "heroVideoUrl": string (optional — URL to .mp4/.webm for hero background video),
  "secondaryVideoUrl": string (optional — URL to secondary video, e.g. aqua park promo),
  "giftCardsUrl": string (optional — link to gift card purchase page),
  "proShopUrl": string (optional — link to pro shop / merchandise page),
  "socialLinks": [{ "platform": string, "url": string }] (optional — extracted social media links),
  "whyChooseUs": [{ "icon": string (Lucide icon name), "title": string, "description": string }] (optional — generate 4-6 compelling reasons from the site content),
  "pricingCategories": [{ "category": string, "items": [{ "name": string, "price": string, "note": string (optional) }] }] (optional — multi-tier pricing grouped by category, e.g. "Cable Wakeboarding", "Aqua Park"),
  "combos": [{ "name": string, "adultPrice": string, "childPrice": string (optional), "description": string (optional), "highlighted": boolean (optional) }] (optional — combo/bundle deals),
  "specialSessions": [{ "name": string, "day": string, "time": string }] (optional — special event sessions like "Ladies Night", "Grom Sessions")
}

WATER-SPORTS EXTRACTION RULES (CRITICAL):
- You MUST extract ALL pricing tiers organized by category into pricingCategories. Do NOT flatten pricing into a single list.
- Use the site's ACTUAL prices — do NOT invent or guess prices.
- Extract video URLs found in the VIDEOS FOUND section into heroVideoUrl (first/most prominent) and secondaryVideoUrl.
- Look for booking system URLs (FareHarbor, Rezdy, Bookeo, etc.) for bookingUrl.
- Extract gift card and pro shop URLs if present.
- Extract all social media links (Facebook, Instagram, TikTok, YouTube, etc.).
- Generate a "whyChooseUs" list of 4-6 compelling features/benefits from the content (e.g. "Beginner Friendly", "All Equipment Included").
- Extract any special sessions or events (ladies nights, kids sessions, etc.) into specialSessions.

For "lists" custom:
{
  "categories": [{ "name": string, "slug": string, "icon": string (Lucide icon name), "count": number, "description": string }],
  "items": [{ "name": string, "description": string, "category": string (matches categories[].slug), "url": string, "image": string, "tags": [string], "rating": number (1-5), "featured": boolean, "meta": { key: value } }],
  "submitUrl": string (optional — URL for "Submit a listing" page),
  "totalCount": string (optional — e.g. "500+ listings"),
  "lastUpdated": string (optional — e.g. "Updated weekly"),
  "searchPlaceholder": string (optional — e.g. "Search restaurants..."),
  "sponsoredItems": [{ "name": string, "description": string, "url": string, "image": string, "badge": string (e.g. "Sponsored", "Premium") }] (optional)
}

LISTS EXTRACTION RULES (CRITICAL):
- Extract ALL list items with their names, descriptions, categories, and any metadata
- Organize items into logical categories derived from the site's navigation or groupings
- Extract URLs for each item if they link to external pages
- Use scraped images for item thumbnails where available
- Extract ratings if the site has a rating system
- Mark items as featured if they have visual prominence on the original site
- For meta fields, extract any structured data (location, price, date, type, etc.)
- Generate a searchPlaceholder that matches the site's content type (e.g. "Search restaurants...", "Find tools...")

COLOR PALETTE GUIDELINES:
- water-sports: deep blues (#0c1e3a), cyans (#00bcd4), teal (#009688), white text
- lists: light neutrals (white #ffffff, gray-50 #f9fafb), primary accent from site's brand colors
- For all other sites using block layout: extract real brand colors from the scraped site content
`;
