import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { showcaseItems } from "@/data/seo/showcase";
import { industries } from "@/data/seo/industries";
import BeforeAfter from "@/components/seo/sections/BeforeAfter";
import CtaBanner from "@/components/seo/sections/CtaBanner";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webfacelift.com";

export const metadata: Metadata = {
  title: "Website Redesign Showcase | Before & After",
  description:
    "See real before & after website redesigns across dozens of industries. Plumbers, restaurants, dentists, and more — transformed by AI in minutes.",
  openGraph: {
    title: "Website Redesign Showcase | Before & After",
    description: "See real before & after website redesigns across dozens of industries.",
    url: `${BASE_URL}/showcase`,
    siteName: "webfacelift",
    type: "website",
  },
  alternates: { canonical: `${BASE_URL}/showcase` },
};

export default function ShowcasePage() {
  const industriesWithShowcase = industries.filter((ind) =>
    showcaseItems.some((item) => item.industry === ind.slug)
  );

  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 mb-8">
          <Sparkles size={12} />
          Before & After Showcase
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
          Real websites, real transformations
        </h1>
        <p className="mt-5 text-lg text-zinc-400 max-w-2xl mx-auto">
          See how businesses across Australia have modernised their online presence with AI-powered redesign.
        </p>
      </section>

      {/* Filter by industry */}
      <section className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {industriesWithShowcase.map((ind) => (
            <Link
              key={ind.slug}
              href={`/showcase/${ind.slug}`}
              className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-white/50 hover:text-white hover:border-white/10 transition-all flex items-center gap-1"
            >
              {ind.plural}
              <ArrowRight size={10} />
            </Link>
          ))}
        </div>
      </section>

      <BeforeAfter items={showcaseItems} />
      <CtaBanner />
    </>
  );
}
