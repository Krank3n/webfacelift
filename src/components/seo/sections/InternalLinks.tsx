import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getIndustry } from "@/data/seo/industries";
import { getLocation } from "@/data/seo/locations";
import { parseSlug } from "@/data/seo/utils";

interface InternalLinksProps {
  slugs: string[];
  title?: string;
}

function slugToLabel(slug: string): string {
  const parsed = parseSlug(slug);
  if (!parsed) return slug;

  if (parsed.type === "industry" && parsed.industrySlug) {
    const ind = getIndustry(parsed.industrySlug);
    return ind ? `Website Redesign for ${ind.plural}` : slug;
  }
  if (parsed.type === "location" && parsed.locationSlug) {
    const loc = getLocation(parsed.locationSlug);
    return loc ? `Website Redesign in ${loc.name}` : slug;
  }
  if (parsed.type === "combo" && parsed.industrySlug && parsed.locationSlug) {
    const ind = getIndustry(parsed.industrySlug);
    const loc = getLocation(parsed.locationSlug);
    return ind && loc ? `${ind.plural} in ${loc.name}` : slug;
  }
  return slug;
}

export default function InternalLinks({ slugs, title }: InternalLinksProps) {
  if (slugs.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-2xl font-bold text-white mb-8">
        {title || "Explore more"}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {slugs.map((slug) => (
          <Link
            key={slug}
            href={`/${slug}`}
            className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all group"
          >
            <span className="text-xs text-white/60 group-hover:text-white transition-colors">
              {slugToLabel(slug)}
            </span>
            <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
