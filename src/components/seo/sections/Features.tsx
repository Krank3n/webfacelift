import { Zap, MessageSquare, Layers, Globe, Smartphone, Search } from "lucide-react";
import type { Feature } from "@/data/seo/types";

const icons = [Zap, Smartphone, Search, MessageSquare, Layers, Globe];

interface FeaturesProps {
  features: Feature[];
  industryName?: string;
}

export default function Features({ features, industryName }: FeaturesProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        {industryName
          ? `What you get with your ${industryName.toLowerCase()} website redesign`
          : "What you get with your redesign"}
      </h2>
      <p className="text-center text-white/40 mb-14 max-w-xl mx-auto">
        Every redesign is built to convert visitors into customers.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div
              key={feature.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all"
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center mt-0.5">
                <Icon size={16} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
