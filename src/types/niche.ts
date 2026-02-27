export type NicheCategory =
  | "water-sports"
  | "restaurant"
  | "fitness"
  | "professional-services";

// Per-niche custom data types

export interface WaterSportsCustom {
  activities: {
    name: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    price?: string;
    image?: string;
  }[];
  bookingUrl?: string;
  parkStatus?: {
    openTime: string; // e.g. "09:00"
    closeTime: string; // e.g. "18:00"
    timezone?: string; // e.g. "Australia/Brisbane"
    seasonStart?: string; // e.g. "May"
    seasonEnd?: string; // e.g. "September"
  };
  heroVideoUrl?: string;
  secondaryVideoUrl?: string;
  giftCardsUrl?: string;
  proShopUrl?: string;
  socialLinks?: { platform: string; url: string }[];
  whyChooseUs?: {
    icon: string;
    title: string;
    description: string;
  }[];
  pricingCategories?: {
    category: string;
    items: {
      name: string;
      price: string;
      note?: string;
    }[];
  }[];
  combos?: {
    name: string;
    adultPrice: string;
    childPrice?: string;
    description?: string;
    highlighted?: boolean;
  }[];
  specialSessions?: {
    name: string;
    day: string;
    time: string;
  }[];
}

// Shared fields for all niche business data
export interface NicheBusinessData {
  businessName: string;
  tagline: string;
  description: string;
  heroImage?: string;
  logo?: string;
  phone?: string;
  email?: string;
  address?: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  hours?: { day: string; hours: string }[];
  stats?: { label: string; value: string }[];
  testimonials?: {
    quote: string;
    author: string;
    role?: string;
    rating?: number;
    avatar?: string;
  }[];
  gallery?: { url: string; alt?: string }[];
  pricing?: {
    name: string;
    price: string;
    period?: string;
    features: string[];
    highlighted?: boolean;
  }[];
  faq?: { question: string; answer: string }[];
  team?: {
    name: string;
    role: string;
    image?: string;
    bio?: string;
  }[];
  cta?: {
    heading: string;
    description?: string;
    buttonText: string;
    buttonLink?: string;
  };
  navLinks?: { label: string; href: string }[];
  socialLinks?: { platform: string; url: string }[];
  custom?: WaterSportsCustom | Record<string, unknown>;
}
