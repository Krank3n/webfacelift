"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe, Sparkles } from "lucide-react";
import { validateUrl } from "@/lib/url-validation";

interface SeoHeroProps {
  headline: string;
  subheadline: string;
  badge?: string;
}

export default function SeoHero({ headline, subheadline, badge }: SeoHeroProps) {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const router = useRouter();

  function handleStart() {
    if (!url.trim()) return;
    const check = validateUrl(url.trim());
    if (!check.valid) {
      setUrlError(check.error || "This site type is not supported.");
      return;
    }
    setUrlError(null);
    router.push(`/project/new?url=${encodeURIComponent(url.trim())}`);
  }

  return (
    <section className="max-w-5xl mx-auto px-6 pt-16 md:pt-24 pb-16 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 mb-8">
        <Sparkles size={12} />
        {badge || "AI-Powered Website Redesign"}
      </div>

      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
        {headline}
      </h1>

      <p className="mt-5 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        {subheadline}
      </p>

      <div className="mt-12 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/80 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus-within:border-indigo-500/50 transition-colors">
          <div className="flex items-center gap-2 pl-3 text-white/30">
            <Globe size={18} />
          </div>
          <input
            type="url"
            placeholder="https://your-current-website.com.au"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setUrlError(null); }}
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
            className="flex-1 bg-transparent text-white text-sm placeholder:text-white/[0.35] outline-none py-2"
          />
          <button
            onClick={handleStart}
            className="shrink-0 px-3 md:px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white text-sm font-semibold flex items-center gap-2 transition-all"
          >
            <span className="hidden md:inline">Redesign Now</span>
            <ArrowRight size={14} />
          </button>
        </div>
        {urlError ? (
          <p className="mt-3 text-xs text-red-400">{urlError}</p>
        ) : (
          <p className="mt-3 text-xs text-white/30">
            Paste your website URL and get a modern redesign in under 5 minutes.
          </p>
        )}
      </div>
    </section>
  );
}
