"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { validateUrl } from "@/lib/url-validation";
import {
  ArrowRight,
  Globe,
  Sparkles,
  Layers,
  MessageSquare,
  Zap,
  ChevronRight,
  Clock,
  Star,
  Quote,
  Mail,
  Check,
} from "lucide-react";
import { subscribeNewsletter } from "@/actions/newsletter";

export default function LandingPage() {
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsSignedIn(!!user);
    });
  }, []);

  function handleStart() {
    if (!url.trim()) return;
    const check = validateUrl(url.trim());
    if (!check.valid) {
      setUrlError(check.error || "This site type is not supported.");
      return;
    }
    setUrlError(null);
    const encoded = encodeURIComponent(url.trim());
    router.push(`/project/new?url=${encoded}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      {/* Ambient depth glow behind hero */}
      <div
        className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[80px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.03) 50%, transparent 80%)" }}
      />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            webfacelift
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#how" className="text-sm text-white/50 hover:text-white/80 transition-colors">
            How it works
          </a>
          <a href="#features" className="text-sm text-white/50 hover:text-white/80 transition-colors">
            Features
          </a>
          {isSignedIn !== null && (
            <button
              onClick={() =>
                router.push(isSignedIn ? "/dashboard" : "/login")
              }
              className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors"
            >
              {isSignedIn ? "Dashboard" : "Sign in"}
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 md:pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 mb-8">
          <Sparkles size={12} />
          AI-Powered Website Reconstruction
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.1]">
          More than a facelift.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            We reconstruct
          </span>
          <br />
          the bones.
        </h1>

        <p className="mt-5 text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Paste any outdated website URL. Our AI scrapes the content, redesigns
          the entire structure, and renders a modern blueprint you can iterate
          on in real-time.
        </p>

        {/* URL Input */}
        <div className="mt-14 max-w-2xl mx-auto">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/80 border border-white/[0.12] shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)] focus-within:border-indigo-500/50 transition-colors">
            <div className="flex items-center gap-2 pl-3 text-white/30">
              <Globe size={18} />
            </div>
            <input
              type="url"
              placeholder="https://outdated-business-site.com"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/[0.35] outline-none py-2"
            />
            <button
              onClick={handleStart}
              className="shrink-0 px-3 md:px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white text-sm font-semibold flex items-center gap-2 transition-all"
            >
              <span className="hidden md:inline">Reconstruct</span>
              <ArrowRight size={14} />
            </button>
          </div>
          {urlError ? (
            <p className="mt-3 text-xs text-red-400">{urlError}</p>
          ) : (
            <p className="mt-3 text-xs text-white/30">
              No account required to preview. Sign in to save projects.
            </p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
          Three steps. Zero design skills needed.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              icon: Globe,
              title: "Paste the URL",
              description:
                "Enter any business website. We scrape and analyze every piece of content, structure, and intent.",
            },
            {
              step: "02",
              icon: Sparkles,
              title: "AI Reconstructs",
              description:
                "Claude generates a complete modern blueprint — hero, services, testimonials, CTAs — all from your content.",
            },
            {
              step: "03",
              icon: MessageSquare,
              title: "Iterate via Chat",
              description:
                'Tell the AI what to change. "Make it blue." "Add a contact form." Watch the site update in real-time.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="group p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.05] transition-all"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-indigo-400/60">
                  {item.step}
                </span>
                <item.icon
                  size={20}
                  className="text-white/20 group-hover:text-indigo-400 transition-colors"
                />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Built for speed, not perfection theater.
        </h2>
        <p className="text-center text-white/40 mb-16 max-w-xl mx-auto">
          Every feature is designed to get you from &quot;that old site&quot; to
          &quot;that looks incredible&quot; in minutes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: Zap,
              title: "Instant Blueprint Generation",
              desc: "Scrape, analyze, and rebuild in under 30 seconds. No templates, no drag-and-drop — pure AI architecture.",
            },
            {
              icon: MessageSquare,
              title: "Conversational Editing",
              desc: "Chat with the AI to refine your design. Every message mutates the live blueprint state.",
            },
            {
              icon: Layers,
              title: "Component-Based Output",
              desc: "Hero sections, grids, testimonials, CTAs — all rendered from a strict JSON schema you can export.",
            },
            {
              icon: Globe,
              title: "Works With Any Site",
              desc: "Local plumber, law firm, restaurant, or SaaS — if it has a URL, we can reconstruct it.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all"
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-indigo-500/10 flex items-center justify-center mt-0.5">
                <f.icon size={16} className="text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">
                  {f.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "500+", label: "Sites reconstructed", icon: Globe },
            { value: "~5min", label: "Average build time", icon: Clock },
            { value: "50+", label: "Industries supported", icon: Layers },
            { value: "4.9/5", label: "User satisfaction", icon: Star },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-xl bg-white/[0.02] border border-white/[0.05]"
            >
              <stat.icon size={18} className="text-indigo-400 mx-auto mb-3" />
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          Trusted by agencies and freelancers
        </h2>
        <p className="text-center text-white/40 mb-14 max-w-xl mx-auto">
          See why designers and developers choose webfacelift to modernize
          their clients&apos; web presence.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                "I used to spend 2 weeks mocking up redesigns for pitches. Now I paste the URL, get a blueprint in 30 seconds, and iterate from there. It changed how I win clients.",
              name: "Sarah M.",
              role: "Freelance Web Designer",
            },
            {
              quote:
                "Our agency handles 10+ small business clients. webfacelift lets us show them what their site could look like before we even scope the project. Close rate went through the roof.",
              name: "James K.",
              role: "Agency Owner",
            },
            {
              quote:
                "The chat-based editing is genius. I told it to add a pricing section and change the colors to match my brand — done in seconds. No Figma, no back-and-forth.",
              name: "Linda R.",
              role: "Marketing Consultant",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.name}
              className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col"
            >
              <Quote size={20} className="text-indigo-400/40 mb-4" />
              <p className="text-sm text-white/60 leading-relaxed flex-1">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-5 pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-white/40">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="p-10 rounded-2xl bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Stop polishing. Start rebuilding.
          </h2>
          <p className="text-white/50 mb-8 max-w-lg mx-auto">
            Your clients deserve better than a website from 2014. Give them
            a modern presence in minutes, not months.
          </p>
          <button
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>(
                'input[type="url"]'
              );
              input?.focus();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] text-white font-semibold text-sm transition-all"
          >
            Try it now
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative z-10 max-w-xl mx-auto px-6 py-12 text-center">
        <Mail size={20} className="text-indigo-400/60 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Stay in the loop</h3>
        <p className="text-xs text-white/40 mb-5">
          Get tips on website modernization and be the first to hear about new features.
        </p>
        {emailStatus === "success" ? (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
            <Check size={14} />
            You&apos;re subscribed!
          </div>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email.trim()) return;
              setEmailStatus("loading");
              const result = await subscribeNewsletter(email);
              if (result.success) {
                setEmailStatus("success");
              } else {
                setEmailError(result.error || "Something went wrong.");
                setEmailStatus("error");
              }
            }}
            className="flex gap-2 max-w-sm mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setEmailStatus("idle"); setEmailError(""); }}
              placeholder="you@example.com"
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/40"
            />
            <button
              type="submit"
              disabled={emailStatus === "loading"}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-sm text-white font-medium hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-50"
            >
              {emailStatus === "loading" ? "..." : "Subscribe"}
            </button>
          </form>
        )}
        {emailStatus === "error" && emailError && (
          <p className="text-xs text-red-400 mt-2">{emailError}</p>
        )}
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} webfacelift
          </span>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-xs text-white/20 hover:text-white/40 transition-colors">
              Terms
            </a>
            <span className="text-xs text-white/20">
              Powered by Claude &middot; Built with Next.js
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
