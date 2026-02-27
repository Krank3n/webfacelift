import type { NicheCategory, NicheBusinessData } from "./niche";

export type TemplateStyle = "glass" | "bold" | "minimal" | "vibrant";

export interface HeroBlock {
  type: "hero";
  heading: string;
  subheading: string;
  ctaText: string;
  ctaLink?: string;
  bgImage?: string;
  bgColor?: string;
  textColor?: string;
  overlay?: boolean;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface ServiceGridBlock {
  type: "serviceGrid";
  title: string;
  subtitle?: string;
  services: ServiceItem[];
  columns?: 2 | 3 | 4;
  bgColor?: string;
}

export interface ContentSplitBlock {
  type: "contentSplit";
  heading: string;
  body: string;
  image?: string;
  alignment: "left" | "right";
  bgColor?: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ContactCTABlock {
  type: "contactCTA";
  heading: string;
  subheading?: string;
  showForm: boolean;
  bgColor?: string;
  buttonText?: string;
  fields?: string[];
}

export interface TestimonialsBlock {
  type: "testimonials";
  title: string;
  items: {
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
  }[];
  bgColor?: string;
}

export interface FooterBlock {
  type: "footer";
  companyName: string;
  links?: { label: string; href: string }[];
  copyright?: string;
  bgColor?: string;
}

export interface NavbarBlock {
  type: "navbar";
  brand: string;
  links: { label: string; href: string }[];
  ctaText?: string;
  bgColor?: string;
}

export interface PricingGridBlock {
  type: "pricingGrid";
  title: string;
  subtitle?: string;
  tiers: {
    name: string;
    price: string;
    period?: string;
    features: string[];
    highlighted?: boolean;
    ctaText?: string;
  }[];
  bgColor?: string;
}

export interface StatsBarBlock {
  type: "statsBar";
  stats: { label: string; value: string }[];
  bgColor?: string;
}

export interface GalleryBlock {
  type: "gallery";
  title?: string;
  subtitle?: string;
  images: { url: string; alt?: string }[];
  columns?: 2 | 3 | 4;
  bgColor?: string;
}

export interface FAQBlock {
  type: "faq";
  title: string;
  subtitle?: string;
  items: { question: string; answer: string }[];
  bgColor?: string;
}

export interface TeamGridBlock {
  type: "teamGrid";
  title: string;
  subtitle?: string;
  members: {
    name: string;
    role: string;
    image?: string;
    bio?: string;
  }[];
  columns?: 2 | 3 | 4;
  bgColor?: string;
}

export interface LogoBarBlock {
  type: "logoBar";
  title?: string;
  logos: { url: string; alt: string }[];
  bgColor?: string;
}

export type BlueprintBlock =
  | HeroBlock
  | ServiceGridBlock
  | ContentSplitBlock
  | ContactCTABlock
  | TestimonialsBlock
  | FooterBlock
  | NavbarBlock
  | PricingGridBlock
  | StatsBarBlock
  | GalleryBlock
  | FAQBlock
  | TeamGridBlock
  | LogoBarBlock;

export interface BlueprintState {
  siteName: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  font?: string;
  template?: TemplateStyle;
  layout: BlueprintBlock[];
  nicheTemplate?: NicheCategory;
  nicheData?: NicheBusinessData;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface Project {
  id: string;
  user_id: string;
  original_url: string;
  site_name?: string;
  current_json_state: BlueprintState | null;
  created_at: string;
  updated_at: string;
}
