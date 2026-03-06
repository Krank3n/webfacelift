import { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseSlug, getAllSlugs } from "@/data/seo/utils";
import { getIndustry } from "@/data/seo/industries";
import { getLocation } from "@/data/seo/locations";
import { getIndustryContent } from "@/data/seo/industry-content";
import { getLocationContent } from "@/data/seo/location-content";
import IndustryPage from "@/components/seo/IndustryPage";
import LocationPage from "@/components/seo/LocationPage";
import ComboPage from "@/components/seo/ComboPage";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webfacelift.com";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return {};

  let title = "";
  let description = "";

  if (parsed.type === "industry" && parsed.industrySlug) {
    const industry = getIndustry(parsed.industrySlug)!;
    title = `Website Redesign for ${industry.plural} | AI-Powered`;
    description = `Transform your ${industry.name.toLowerCase()} website into a modern, lead-generating machine. AI-powered redesign in minutes — no coding or design skills needed. From $9.`;
  } else if (parsed.type === "location" && parsed.locationSlug) {
    const location = getLocation(parsed.locationSlug)!;
    title = `Website Redesign in ${location.name} | AI-Powered`;
    description = `${location.name} businesses deserve modern websites. AI-powered website redesign that transforms outdated sites into stunning, mobile-friendly designs in minutes.`;
  } else if (parsed.type === "combo" && parsed.industrySlug && parsed.locationSlug) {
    const industry = getIndustry(parsed.industrySlug)!;
    const location = getLocation(parsed.locationSlug)!;
    title = `Website Redesign for ${industry.plural} in ${location.name}`;
    description = `${location.name} ${industry.plural.toLowerCase()} — modernise your website with AI. Get a professional redesign in minutes, not months. Mobile-friendly, SEO-optimised, from $9.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${slug}`,
      siteName: "webfacelift",
      type: "website",
      images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${BASE_URL}/${slug}`,
    },
  };
}

export default async function SeoPage({ params }: Props) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) notFound();

  // Schema.org JSON-LD
  let jsonLd: Record<string, unknown> = {};

  if (parsed.type === "industry" && parsed.industrySlug) {
    const industry = getIndustry(parsed.industrySlug)!;
    const content = getIndustryContent(parsed.industrySlug);

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Website Redesign for ${industry.plural}`,
      description: content.subheadline,
      provider: {
        "@type": "Organization",
        name: "webfacelift",
        url: BASE_URL,
      },
      serviceType: "Website Redesign",
      areaServed: { "@type": "Country", name: "Australia" },
    };

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <IndustryPage industry={industry} content={content} />
      </>
    );
  }

  if (parsed.type === "location" && parsed.locationSlug) {
    const location = getLocation(parsed.locationSlug)!;
    const content = getLocationContent(parsed.locationSlug);

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Website Redesign in ${location.name}`,
      description: content.subheadline,
      provider: {
        "@type": "Organization",
        name: "webfacelift",
        url: BASE_URL,
      },
      serviceType: "Website Redesign",
      areaServed: {
        "@type": "City",
        name: location.name,
        containedInPlace: { "@type": "State", name: location.state },
      },
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <LocationPage location={location} content={content} />
      </>
    );
  }

  if (parsed.type === "combo" && parsed.industrySlug && parsed.locationSlug) {
    const industry = getIndustry(parsed.industrySlug)!;
    const location = getLocation(parsed.locationSlug)!;
    const industryContent = getIndustryContent(parsed.industrySlug);
    const locationContent = getLocationContent(parsed.locationSlug);

    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: `Website Redesign for ${industry.plural} in ${location.name}`,
      description: `AI-powered website redesign for ${industry.plural.toLowerCase()} in ${location.name}`,
      provider: {
        "@type": "Organization",
        name: "webfacelift",
        url: BASE_URL,
      },
      serviceType: "Website Redesign",
      areaServed: {
        "@type": "City",
        name: location.name,
        containedInPlace: { "@type": "State", name: location.state },
      },
    };

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: industryContent.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <ComboPage
          industry={industry}
          location={location}
          industryContent={industryContent}
          locationContent={locationContent}
        />
      </>
    );
  }

  notFound();
}
