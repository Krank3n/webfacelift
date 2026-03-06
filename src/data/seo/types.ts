export interface Industry {
  slug: string;
  name: string;
  category: "trades" | "hospitality" | "health" | "professional" | "lifestyle" | "other";
  plural: string;
}

export interface Location {
  slug: string;
  name: string;
  state: string;
  stateShort: string;
  population?: string;
  isCapital: boolean;
}

export interface PainPoint {
  title: string;
  description: string;
  icon: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface IndustryContent {
  slug: string;
  headline: string;
  subheadline: string;
  painPoints: PainPoint[];
  features: Feature[];
  faqs: FAQ[];
}

export interface LocationContent {
  slug: string;
  headline: string;
  subheadline: string;
  marketStats: { label: string; value: string }[];
  localFacts: string[];
}

export interface ShowcaseItem {
  industry: string;
  businessName: string;
  location: string;
  beforeDescription: string;
  afterDescription: string;
  improvements: string[];
}

export type PageType = "industry" | "location" | "combo";

export interface ParsedSlug {
  type: PageType;
  industrySlug?: string;
  locationSlug?: string;
}
