const BLOCKED_DOMAINS: { pattern: string; reason: string }[] = [
  // E-commerce platforms
  { pattern: "myshopify.com", reason: "Shopify stores are too complex to reconstruct (products, cart, checkout)." },
  { pattern: "shopify.com", reason: "Shopify stores are too complex to reconstruct." },
  { pattern: "bigcommerce.com", reason: "BigCommerce stores are too complex to reconstruct." },
  { pattern: "amazon.com", reason: "Amazon pages cannot be reconstructed." },
  { pattern: "amazon.", reason: "Amazon pages cannot be reconstructed." },
  { pattern: "ebay.com", reason: "eBay pages cannot be reconstructed." },
  { pattern: "etsy.com", reason: "Etsy pages cannot be reconstructed." },
  { pattern: "aliexpress.com", reason: "AliExpress pages cannot be reconstructed." },
  { pattern: "walmart.com", reason: "Walmart pages cannot be reconstructed." },
  // Social media
  { pattern: "facebook.com", reason: "Social media pages cannot be reconstructed. Try the business's actual website instead." },
  { pattern: "instagram.com", reason: "Social media pages cannot be reconstructed. Try the business's actual website instead." },
  { pattern: "twitter.com", reason: "Social media pages cannot be reconstructed." },
  { pattern: "x.com", reason: "Social media pages cannot be reconstructed." },
  { pattern: "linkedin.com", reason: "LinkedIn pages cannot be reconstructed." },
  { pattern: "youtube.com", reason: "YouTube pages cannot be reconstructed." },
  { pattern: "tiktok.com", reason: "TikTok pages cannot be reconstructed." },
  { pattern: "reddit.com", reason: "Reddit pages cannot be reconstructed." },
  { pattern: "pinterest.com", reason: "Pinterest pages cannot be reconstructed." },
  // Web apps / SaaS
  { pattern: "docs.google.com", reason: "Google Docs cannot be reconstructed." },
  { pattern: "drive.google.com", reason: "Google Drive cannot be reconstructed." },
  { pattern: "mail.google.com", reason: "Web apps cannot be reconstructed." },
  { pattern: "notion.so", reason: "Notion pages cannot be reconstructed." },
  { pattern: "figma.com", reason: "Figma cannot be reconstructed." },
  { pattern: "canva.com", reason: "Canva cannot be reconstructed." },
  // Dev platforms
  { pattern: "github.com", reason: "GitHub pages cannot be reconstructed. Try the project's actual website instead." },
  { pattern: "gitlab.com", reason: "GitLab pages cannot be reconstructed." },
  { pattern: "stackoverflow.com", reason: "StackOverflow cannot be reconstructed." },
  { pattern: "npmjs.com", reason: "npm cannot be reconstructed." },
  // Blog platforms
  { pattern: "medium.com", reason: "Medium articles cannot be reconstructed. Try the business's own website instead." },
  { pattern: "substack.com", reason: "Substack pages cannot be reconstructed." },
];

export function validateUrl(url: string): { valid: boolean; error?: string } {
  let hostname: string;
  try {
    hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname.toLowerCase();
  } catch {
    return { valid: false, error: "Invalid URL. Please enter a valid website address." };
  }

  for (const { pattern, reason } of BLOCKED_DOMAINS) {
    if (hostname === pattern || hostname.endsWith(`.${pattern}`)) {
      return { valid: false, error: reason };
    }
  }

  return { valid: true };
}
