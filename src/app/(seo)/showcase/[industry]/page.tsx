import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Sparkles } from "lucide-react";
import { industries, getIndustry } from "@/data/seo/industries";
import { getShowcaseByIndustry } from "@/data/seo/showcase";
import BeforeAfter from "@/components/seo/sections/BeforeAfter";
import CtaBanner from "@/components/seo/sections/CtaBanner";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webfacelift.com";

interface Props {
  params: Promise<{ industry: string }>;
}

export async function generateStaticParams() {
  return industries.map((ind) => ({ industry: ind.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  const title = `${industry.name} Website Redesign Showcase`;
  const description = `Before & after website redesigns for ${industry.plural.toLowerCase()}. See how AI transforms outdated ${industry.name.toLowerCase()} websites into modern, lead-generating designs.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/showcase/${slug}`,
      siteName: "webfacelift",
      type: "website",
    },
    alternates: { canonical: `${BASE_URL}/showcase/${slug}` },
  };
}

export default async function IndustryShowcasePage({ params }: Props) {
  const { industry: slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const items = getShowcaseByIndustry(slug);

  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 mb-8">
          <Sparkles size={12} />
          {industry.name} Showcase
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          {industry.name} website transformations
        </h1>
        <p className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto">
          See how {industry.plural.toLowerCase()} have modernised their online presence.
        </p>
      </section>

      <BeforeAfter items={items} />
      <CtaBanner
        headline={`Ready to modernise your ${industry.name.toLowerCase()} website?`}
        subheadline="Paste your URL and get a stunning redesign in minutes."
      />
    </>
  );
}
