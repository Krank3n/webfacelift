import { Industry } from "./types";

export const industries: Industry[] = [
  // Trades
  { slug: "plumbers", name: "Plumber", category: "trades", plural: "Plumbers" },
  { slug: "electricians", name: "Electrician", category: "trades", plural: "Electricians" },
  { slug: "builders", name: "Builder", category: "trades", plural: "Builders" },
  { slug: "painters", name: "Painter", category: "trades", plural: "Painters" },
  { slug: "landscapers", name: "Landscaper", category: "trades", plural: "Landscapers" },
  { slug: "roofers", name: "Roofer", category: "trades", plural: "Roofers" },
  { slug: "tilers", name: "Tiler", category: "trades", plural: "Tilers" },
  { slug: "concreters", name: "Concreter", category: "trades", plural: "Concreters" },
  { slug: "carpenters", name: "Carpenter", category: "trades", plural: "Carpenters" },
  { slug: "pest-control", name: "Pest Control", category: "trades", plural: "Pest Control Services" },

  // Hospitality
  { slug: "restaurants", name: "Restaurant", category: "hospitality", plural: "Restaurants" },
  { slug: "cafes", name: "Cafe", category: "hospitality", plural: "Cafes" },
  { slug: "bars", name: "Bar", category: "hospitality", plural: "Bars" },
  { slug: "catering", name: "Catering", category: "hospitality", plural: "Catering Companies" },

  // Health & Wellness
  { slug: "dentists", name: "Dentist", category: "health", plural: "Dentists" },
  { slug: "physios", name: "Physiotherapist", category: "health", plural: "Physios" },
  { slug: "chiropractors", name: "Chiropractor", category: "health", plural: "Chiropractors" },
  { slug: "gyms", name: "Gym", category: "health", plural: "Gyms" },
  { slug: "beauty-salons", name: "Beauty Salon", category: "health", plural: "Beauty Salons" },
  { slug: "barbers", name: "Barber", category: "health", plural: "Barbers" },

  // Professional Services
  { slug: "accountants", name: "Accountant", category: "professional", plural: "Accountants" },
  { slug: "lawyers", name: "Lawyer", category: "professional", plural: "Lawyers" },
  { slug: "real-estate-agents", name: "Real Estate Agent", category: "professional", plural: "Real Estate Agents" },
  { slug: "financial-advisers", name: "Financial Adviser", category: "professional", plural: "Financial Advisers" },

  // Lifestyle & Other
  { slug: "auto-mechanics", name: "Auto Mechanic", category: "lifestyle", plural: "Auto Mechanics" },
  { slug: "pet-groomers", name: "Pet Groomer", category: "lifestyle", plural: "Pet Groomers" },
  { slug: "photographers", name: "Photographer", category: "lifestyle", plural: "Photographers" },
  { slug: "cleaning-services", name: "Cleaning Service", category: "other", plural: "Cleaning Services" },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((i) => i.slug === slug);
}
