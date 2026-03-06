import type { Industry } from "@/data/seo/types";
import type { IndustryContent } from "@/data/seo/types";
import { getShowcaseByIndustry } from "@/data/seo/showcase";
import { getRelatedIndustryPages, getComboPages } from "@/data/seo/utils";
import SeoHero from "./sections/SeoHero";
import PainPoints from "./sections/PainPoints";
import HowItWorks from "./sections/HowItWorks";
import Features from "./sections/Features";
import BeforeAfter from "./sections/BeforeAfter";
import Testimonials from "./sections/Testimonials";
import FaqSection from "./sections/FaqSection";
import InternalLinks from "./sections/InternalLinks";
import CtaBanner from "./sections/CtaBanner";

interface IndustryPageProps {
  industry: Industry;
  content: IndustryContent;
}

export default function IndustryPage({ industry, content }: IndustryPageProps) {
  const showcaseItems = getShowcaseByIndustry(industry.slug);
  const relatedIndustries = getRelatedIndustryPages(industry.slug, 8);
  const comboPages = getComboPages(industry.slug, 8);

  return (
    <>
      <SeoHero
        headline={content.headline}
        subheadline={content.subheadline}
        badge={`Website Redesign for ${industry.plural}`}
      />
      <PainPoints painPoints={content.painPoints} industryName={industry.name} />
      <HowItWorks />
      <Features features={content.features} industryName={industry.name} />
      <BeforeAfter items={showcaseItems} />
      <Testimonials />
      <FaqSection faqs={content.faqs} />
      <InternalLinks slugs={comboPages} title={`${industry.name} website redesign by city`} />
      <InternalLinks slugs={relatedIndustries} title="Other industries" />
      <CtaBanner
        headline={`Modernise your ${industry.name.toLowerCase()} website today`}
        subheadline={`Join hundreds of ${industry.plural.toLowerCase()} who've upgraded their online presence with AI-powered redesign.`}
      />
    </>
  );
}
