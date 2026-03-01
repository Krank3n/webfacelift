"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCredits } from "@/actions/credits";
import { CREDIT_PACKS } from "@/lib/credit-packs";
import {
  Zap,
  Loader2,
  CreditCard,
  Sparkles,
  ArrowLeft,
  ShieldCheck,
  ChevronDown,
  Globe,
  Palette,
  MessageSquare,
  FileText,
} from "lucide-react";

function BuyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect");

  const [credits, setCredits] = useState<number | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  useEffect(() => {
    getCredits().then((res) => setCredits(res.credits));
  }, []);

  async function handleBuy(packId: string) {
    setLoadingPack(packId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, redirect }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoadingPack(null);
      }
    } catch {
      setLoadingPack(null);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>
          {credits !== null && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50">
              <Zap size={12} className="text-indigo-400" />
              {credits} credit{credits !== 1 ? "s" : ""} remaining
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
            <Sparkles size={22} className="text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Get More Credits
          </h1>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            Each credit generates one complete website reconstruction powered by
            AI analysis, design consultation, and blueprint building.
          </p>
        </div>

        {/* Packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {CREDIT_PACKS.map((pack) => {
            const perCredit = (pack.price / pack.credits).toFixed(2);
            const isPopular = pack.id === "builder";

            return (
              <div
                key={pack.id}
                className={`relative p-6 rounded-xl border transition-all ${
                  isPopular
                    ? "bg-indigo-500/[0.06] border-indigo-500/20"
                    : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-5">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {pack.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-white">
                      ${pack.price}
                    </span>
                  </div>
                  <p className="text-xs text-white/30 mt-1">
                    {pack.credits} credits &middot; ${perCredit}/each
                  </p>
                </div>

                <button
                  onClick={() => handleBuy(pack.id)}
                  disabled={loadingPack !== null}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isPopular
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingPack === pack.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <CreditCard size={14} />
                  )}
                  {loadingPack === pack.id ? "Redirecting..." : "Buy Now"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Guarantee */}
        <div className="mt-12 flex items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/15 text-emerald-400">
            <ShieldCheck size={16} />
            <span className="text-xs font-medium">
              Not happy? Contact us within 7 days for a full refund.
            </span>
          </div>
        </div>

        {/* What you get */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-white text-center mb-6">
            What each credit gets you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Globe, label: "Full website scrape", desc: "We crawl every page and extract all content, images, and structure" },
              { icon: Palette, label: "AI design consultation", desc: "Color palettes, typography, and layout recommendations tailored to your niche" },
              { icon: FileText, label: "Complete blueprint", desc: "A fully structured, editable website blueprint with all your content mapped" },
              { icon: MessageSquare, label: "Unlimited AI chat edits", desc: "Refine your design with unlimited chat-based iterations after generation" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon size={14} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.label}</p>
                  <p className="text-xs text-white/35 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-white text-center mb-6">
            Frequently Asked Questions
          </h2>
          <FAQSection />
        </div>
      </div>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: "What exactly is a credit?",
    a: "One credit = one complete website reconstruction. That includes scraping your existing site, AI content analysis, design consultation, and generating a full editable blueprint.",
  },
  {
    q: "Can I edit my site after generation?",
    a: "Yes! After your blueprint is generated, you get unlimited AI-powered chat edits. Change text, swap images, rearrange sections, adjust colors — all through natural language.",
  },
  {
    q: "Do credits expire?",
    a: "No. Credits never expire. Use them whenever you're ready.",
  },
  {
    q: "What if the generation doesn't work well for my site?",
    a: "Contact us within 7 days and we'll issue a full refund. We're confident in the quality, but want you to be happy.",
  },
  {
    q: "Can I export or download my site?",
    a: "You can share your project via a public link and collaborate with others. Full HTML/code export is on our roadmap.",
  },
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
        >
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left"
          >
            <span className="text-sm font-medium text-white/80">{item.q}</span>
            <ChevronDown
              size={14}
              className={`text-white/30 transition-transform duration-200 shrink-0 ml-3 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4">
              <p className="text-sm text-white/40 leading-relaxed">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function BuyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="text-white/30 animate-spin" />
        </div>
      }
    >
      <BuyContent />
    </Suspense>
  );
}
