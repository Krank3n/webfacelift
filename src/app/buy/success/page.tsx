"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCredits } from "@/actions/credits";
import { CheckCircle, Zap, Loader2, ArrowRight } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const redirect = searchParams.get("redirect");

  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    getCredits().then((res) => setCredits(res.credits));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={28} className="text-emerald-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">
          Credits Added
        </h1>
        <p className="text-sm text-white/40 mb-6">
          Your purchase was successful. You&apos;re ready to generate.
        </p>

        {credits !== null && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 mb-8">
            <Zap size={14} className="text-indigo-400" />
            {credits} credit{credits !== 1 ? "s" : ""} available
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push(redirect || "/dashboard")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuySuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="text-white/30 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
