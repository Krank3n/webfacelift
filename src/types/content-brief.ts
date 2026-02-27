export interface ContentBriefBusiness {
  name: string;
  industry: string;
  type: string;
  url: string;
}

export interface ContentBriefTone {
  personality: string;
  targetAudience: string;
  brandKeywords: string[];
}

export interface ContentSection {
  id: string;
  type: "hero" | "about" | "services" | "testimonials" | "contact" | "pricing" | "faq" | "team" | "gallery" | "stats" | "other";
  title: string;
  summary: string;
  keyPoints: string[];
}

export interface ImageCatalogEntry {
  url: string;
  description: string;
  recommendedPlacement: "hero" | "content-split" | "gallery" | "team" | "logo" | "background" | "other";
  priority: number;
}

export interface ContentBriefContact {
  phone?: string;
  email?: string;
  address?: string;
  hours?: string;
  socialLinks?: { platform: string; url: string }[];
}

export interface NicheDetection {
  detectedNiche: string | null;
  confidence: "high" | "medium" | "low";
  reasoning: string;
  nicheSignals: string[];
}

export interface TemplateRecommendation {
  template: "glass" | "bold" | "minimal" | "vibrant";
  reasoning: string;
}

export interface PersonEntry {
  name: string;
  role: string;
  image?: string;
  bio?: string;
}

export interface TestimonialEntry {
  quote: string;
  author: string;
  role?: string;
}

export interface ServiceOrProduct {
  name: string;
  description: string;
  price?: string;
  icon?: string;
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface StatEntry {
  label: string;
  value: string;
}

export interface ContentBrief {
  business: ContentBriefBusiness;
  tone: ContentBriefTone;
  contentSections: ContentSection[];
  imageCatalog: ImageCatalogEntry[];
  contact: ContentBriefContact;
  nicheDetection: NicheDetection;
  templateRecommendation: TemplateRecommendation;
  statistics: StatEntry[];
  people: PersonEntry[];
  testimonials: TestimonialEntry[];
  servicesOrProducts: ServiceOrProduct[];
  pricingTiers: PricingTier[];
  faqItems: FAQItem[];
}
