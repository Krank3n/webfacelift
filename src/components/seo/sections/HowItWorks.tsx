import { Globe, Sparkles, MessageSquare } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: Globe,
      title: "Paste Your URL",
      description: "Enter your current business website. Our AI scrapes and analyses every piece of content, structure, and intent.",
    },
    {
      step: "02",
      icon: Sparkles,
      title: "AI Redesigns It",
      description: "In under 5 minutes, get a complete modern redesign — hero, services, testimonials, CTAs — all built from your content.",
    },
    {
      step: "03",
      icon: MessageSquare,
      title: "Refine via Chat",
      description: "Tell the AI what to change. \"Make it blue.\" \"Add a booking form.\" Watch the site update in real-time.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
        Three steps. Zero design skills needed.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((item) => (
          <div
            key={item.step}
            className="group p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-mono text-indigo-400/60">{item.step}</span>
              <item.icon size={20} className="text-white/20 group-hover:text-indigo-400 transition-colors" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-white/50 leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
