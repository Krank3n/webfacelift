import { BarChart3 } from "lucide-react";

interface LocalStatsProps {
  locationName: string;
  stats: { label: string; value: string }[];
  facts: string[];
}

export default function LocalStats({ locationName, stats, facts }: LocalStatsProps) {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        {locationName} market snapshot
      </h2>
      <p className="text-center text-white/40 mb-14 max-w-xl mx-auto">
        Why your {locationName} business needs a modern website.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
            <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-white/40">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {facts.map((fact, i) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <BarChart3 size={14} className="text-indigo-400 mt-0.5 shrink-0" />
            <p className="text-sm text-white/50 leading-relaxed">{fact}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
