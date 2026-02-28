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
      </div>
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
