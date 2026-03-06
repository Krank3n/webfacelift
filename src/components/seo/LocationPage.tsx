import type { Location, LocationContent } from "@/data/seo/types";
import { getRelatedLocationPages, getComboPagesForLocation } from "@/data/seo/utils";
import SeoHero from "./sections/SeoHero";
import LocalStats from "./sections/LocalStats";
import HowItWorks from "./sections/HowItWorks";
import Features from "./sections/Features";
import Testimonials from "./sections/Testimonials";
import InternalLinks from "./sections/InternalLinks";
import CtaBanner from "./sections/CtaBanner";

const defaultFeatures = [
  { title: "Modern, Professional Design", description: "A clean, contemporary layout that builds instant trust with local customers." },
  { title: "Mobile-First Responsive", description: "Looks perfect on every device — phone, tablet, and desktop." },
  { title: "Local SEO Optimised", description: "Built with local search engines in mind so nearby customers find you first." },
  { title: "Clear Call-to-Action", description: "Strategic placement of contact buttons and enquiry forms to convert visitors." },
  { title: "Fast Loading Speed", description: "Optimised for performance — critical for local customers on mobile networks." },
  { title: "Content Preservation", description: "We keep your existing content and restructure it for maximum impact." },
];

interface LocationPageProps {
  location: Location;
  content: LocationContent;
}

export default function LocationPage({ location, content }: LocationPageProps) {
  const relatedLocations = getRelatedLocationPages(location.slug, 8);
  const comboPages = getComboPagesForLocation(location.slug, 8);

  return (
    <>
      <SeoHero
        headline={content.headline}
        subheadline={content.subheadline}
        badge={`Website Redesign in ${location.name}`}
      />
      <LocalStats
        locationName={location.name}
        stats={content.marketStats}
        facts={content.localFacts}
      />
      <HowItWorks />
      <Features features={defaultFeatures} />
      <Testimonials />
      <InternalLinks slugs={comboPages} title={`${location.name} redesign by industry`} />
      <InternalLinks slugs={relatedLocations} title="Other locations" />
      <CtaBanner
        headline={`Modernise your ${location.name} business website`}
        subheadline={`Local ${location.name} businesses are going online. Make sure your website stands out.`}
      />
    </>
  );
}
