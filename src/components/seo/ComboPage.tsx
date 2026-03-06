import type { Industry, Location, IndustryContent, LocationContent } from "@/data/seo/types";
import {
  generateIndustrySlug,
  generateLocationSlug,
  getComboPages,
  getComboPagesForLocation,
} from "@/data/seo/utils";
import SeoHero from "./sections/SeoHero";
import PainPoints from "./sections/PainPoints";
import LocalStats from "./sections/LocalStats";
import HowItWorks from "./sections/HowItWorks";
import Features from "./sections/Features";
import FaqSection from "./sections/FaqSection";
import InternalLinks from "./sections/InternalLinks";
import CtaBanner from "./sections/CtaBanner";

interface ComboPageProps {
  industry: Industry;
  location: Location;
  industryContent: IndustryContent;
  locationContent: LocationContent;
}

export default function ComboPage({ industry, location, industryContent, locationContent }: ComboPageProps) {
  const sameIndustryOtherCities = getComboPages(industry.slug, 8);
  const sameCityOtherIndustries = getComboPagesForLocation(location.slug, 8);
  const parentPages = [
    generateIndustrySlug(industry.slug),
    generateLocationSlug(location.slug),
  ];

  return (
    <>
      <SeoHero
        headline={`Website Redesign for ${industry.plural} in ${location.name}`}
        subheadline={`${location.name} ${industry.plural.toLowerCase()} deserve a modern website. AI-powered redesign that helps you win more local customers.`}
        badge={`${industry.plural} in ${location.name}`}
      />
      <PainPoints painPoints={industryContent.painPoints} industryName={industry.name} />
      <LocalStats
        locationName={location.name}
        stats={locationContent.marketStats}
        facts={locationContent.localFacts}
      />
      <HowItWorks />
      <Features features={industryContent.features} industryName={industry.name} />
      <FaqSection faqs={industryContent.faqs} />
      <InternalLinks slugs={parentPages} title="Related pages" />
      <InternalLinks slugs={sameIndustryOtherCities} title={`${industry.plural} in other cities`} />
      <InternalLinks slugs={sameCityOtherIndustries} title={`Other industries in ${location.name}`} />
      <CtaBanner
        headline={`Ready to modernise your ${industry.name.toLowerCase()} website in ${location.name}?`}
        subheadline={`Join ${location.name} ${industry.plural.toLowerCase()} who've already upgraded their online presence.`}
      />
    </>
  );
}
