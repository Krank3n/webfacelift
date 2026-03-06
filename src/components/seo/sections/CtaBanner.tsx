"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Globe } from "lucide-react";
import { validateUrl } from "@/lib/url-validation";

interface CtaBannerProps {
  headline?: string;
  subheadline?: string;
}

export default function CtaBanner({ headline, subheadline }: CtaBannerProps) {
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
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="p-10 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {headline || "Ready to modernise your website?"}
        </h2>
        <p className="text-white/50 mb-8 max-w-lg mx-auto">
          {subheadline || "Paste your URL below and see your redesign in minutes. No design skills required."}
        </p>
        <div className="max-w-xl mx-auto">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/80 border border-white/[0.12] focus-within:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 pl-3 text-white/30">
              <Globe size={18} />
            </div>
            <input
              type="url"
              placeholder="https://your-website.com.au"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/[0.35] outline-none py-2"
            />
            <button
              onClick={handleStart}
              className="shrink-0 px-3 md:px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <span className="hidden md:inline">Redesign</span>
              <ArrowRight size={14} />
            </button>
          </div>
          {urlError && <p className="mt-3 text-xs text-red-400">{urlError}</p>}
        </div>
      </div>
    </section>
  );
}
