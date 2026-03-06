import { ArrowRight } from "lucide-react";
import type { ShowcaseItem } from "@/data/seo/types";

interface BeforeAfterProps {
  items: ShowcaseItem[];
}

export default function BeforeAfter({ items }: BeforeAfterProps) {
  if (items.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        Real transformations
      </h2>
      <p className="text-center text-white/40 mb-14 max-w-xl mx-auto">
        See how businesses like yours transformed their online presence.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.businessName}
            className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-semibold text-white">{item.businessName}</span>
              <span className="text-xs text-white/30">&middot; {item.location}</span>
            </div>
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <div className="text-xs font-medium text-red-400 mb-1">Before</div>
                <p className="text-xs text-white/40 leading-relaxed">{item.beforeDescription}</p>
              </div>
              <ArrowRight size={14} className="text-white/20 mt-3 shrink-0" />
              <div className="flex-1">
                <div className="text-xs font-medium text-emerald-400 mb-1">After</div>
                <p className="text-xs text-white/40 leading-relaxed">{item.afterDescription}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.improvements.map((imp) => (
                <span
                  key={imp}
                  className="px-2 py-1 rounded-md bg-indigo-500/10 text-xs text-indigo-300"
                >
                  {imp}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
