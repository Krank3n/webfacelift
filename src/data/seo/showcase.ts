import { ShowcaseItem } from "./types";

export const showcaseItems: ShowcaseItem[] = [
  {
    industry: "plumbers",
    businessName: "Reliable Plumbing Co",
    location: "Sydney",
    beforeDescription: "Cluttered layout with tiny text, no mobile responsiveness, and buried contact information.",
    afterDescription: "Clean, modern design with prominent emergency CTA, service grid, and trust badges.",
    improvements: ["Mobile-responsive", "Emergency CTA", "Service showcase", "Google reviews integration"],
  },
  {
    industry: "restaurants",
    businessName: "Bella Cucina",
    location: "Melbourne",
    beforeDescription: "PDF menu, no online booking, and food photos that looked amateur on mobile.",
    afterDescription: "Stunning food photography layout, interactive menu, and integrated reservation system.",
    improvements: ["Interactive menu", "Online reservations", "Food gallery", "Mobile-first design"],
  },
  {
    industry: "dentists",
    businessName: "Bright Smiles Dental",
    location: "Brisbane",
    beforeDescription: "Clinical and cold design that amplified dental anxiety instead of reducing it.",
    afterDescription: "Warm, welcoming layout with team photos, treatment guides, and online booking.",
    improvements: ["Patient-friendly design", "Treatment pages", "Online booking", "Before/after gallery"],
  },
  {
    industry: "electricians",
    businessName: "Sparks Electrical",
    location: "Perth",
    beforeDescription: "Generic template with no clear service areas, hidden licence information.",
    afterDescription: "Professional design with licence badges, service area map, and 24/7 emergency banner.",
    improvements: ["Licence display", "Service area clarity", "Emergency banner", "Click-to-call"],
  },
  {
    industry: "lawyers",
    businessName: "Anderson & Associates",
    location: "Adelaide",
    beforeDescription: "Dated corporate design with walls of text and no clear practice area navigation.",
    afterDescription: "Authoritative layout with clear practice areas, team profiles, and consultation booking.",
    improvements: ["Practice area pages", "Team profiles", "Consultation CTA", "Trust indicators"],
  },
  {
    industry: "beauty-salons",
    businessName: "Luxe Beauty Studio",
    location: "Gold Coast",
    beforeDescription: "Wix template that didn't reflect the salon's premium positioning or services.",
    afterDescription: "Elegant, on-brand design with service menu, before/after gallery, and online booking.",
    improvements: ["Brand alignment", "Service pricing", "Online booking", "Instagram integration"],
  },
];

export function getShowcaseByIndustry(industrySlug: string): ShowcaseItem[] {
  return showcaseItems.filter((item) => item.industry === industrySlug);
}
