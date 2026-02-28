"use client";

import { useState, useEffect, useRef } from "react";
import type { NicheBusinessData, WaterSportsCustom } from "@/types/niche";
import { useInView } from "../hooks/useInView";
import { useCountUp } from "../hooks/useCountUp";
import EditableText from "@/components/builder/EditableText";

/* ------------------------------------------------------------------ */
/*  Water wave SVG divider                                             */
/* ------------------------------------------------------------------ */
function WaveDivider({
  flip,
  color = "#0f172a",
}: {
  flip?: boolean;
  color?: string;
}) {
  return (
    <div
      className={`wave-divider relative w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`}
      style={{ marginTop: "-1px", marginBottom: "-1px" }}
    >
      <svg
        viewBox="0 0 2400 120"
        preserveAspectRatio="none"
        className="w-[200%] h-[60px] md:h-[80px]"
      >
        <path
          d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 C1400,120 1600,0 1800,60 C2000,120 2200,0 2400,60 L2400,120 L0,120 Z"
          fill={color}
          fillOpacity="0.15"
        />
        <path
          d="M0,80 C150,30 350,100 600,80 C850,60 1050,110 1200,80 C1350,50 1550,100 1800,80 C2050,60 2250,110 2400,80 L2400,120 L0,120 Z"
          fill={color}
          fillOpacity="0.08"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Splash / droplet particles                                         */
/* ------------------------------------------------------------------ */
function SplashParticles() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {[10, 25, 45, 70, 88].map((left, i) => (
        <div
          key={`drop-${i}`}
          className="droplet absolute top-0 w-2 h-3 rounded-full bg-sky-400/30"
          style={{ left: `${left}%` }}
        />
      ))}
      {[15, 35, 60, 82].map((left, i) => (
        <div
          key={`bubble-${i}`}
          className="bubble absolute bottom-0 w-3 h-3 rounded-full border border-sky-400/20"
          style={{ left: `${left}%` }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Ripple rings for CTA areas                                         */
/* ------------------------------------------------------------------ */
function RippleRings({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="ripple-circle absolute inset-0 rounded-full border border-sky-400/20"
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Park open/closed based on timezone                                 */
/* ------------------------------------------------------------------ */
function useParkStatus(parkStatus?: WaterSportsCustom["parkStatus"]) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const check = () => {
      const tz = parkStatus?.timezone || "Australia/Brisbane";
      const now = new Date(
        new Date().toLocaleString("en-US", { timeZone: tz })
      );
      const hour = now.getHours();
      const min = now.getMinutes();
      const current = hour * 60 + min;

      const openH = parkStatus?.openTime
        ? parseInt(parkStatus.openTime.split(":")[0], 10)
        : 10;
      const openM = parkStatus?.openTime
        ? parseInt(parkStatus.openTime.split(":")[1], 10)
        : 0;
      const closeH = parkStatus?.closeTime
        ? parseInt(parkStatus.closeTime.split(":")[0], 10)
        : 18;
      const closeM = parkStatus?.closeTime
        ? parseInt(parkStatus.closeTime.split(":")[1], 10)
        : 0;

      setIsOpen(current >= openH * 60 + openM && current < closeH * 60 + closeM);
    };
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, [parkStatus]);

  return isOpen;
}

/* ------------------------------------------------------------------ */
/*  Animated stat counter                                              */
/* ------------------------------------------------------------------ */
function StatNumber({
  value,
  start,
}: {
  value: string;
  start: boolean;
}) {
  const match = value.match(/^([^0-9]*)(\d[\d,]*)(.*)$/);
  const prefix = match?.[1] || "";
  const num = match ? parseInt(match[2].replace(/,/g, ""), 10) : 0;
  const suffix = match?.[3] || "";
  const count = useCountUp(num, 2000, start);
  const display = num >= 1000 ? count.toLocaleString() : count;

  return (
    <span>
      {prefix}
      {num > 0 ? display : value}
      {num > 0 ? suffix : ""}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Section with fade-in animation                                     */
/* ------------------------------------------------------------------ */
function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const { ref, isInView } = useInView(0.1);
  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pricing card                                                       */
/* ------------------------------------------------------------------ */
function PricingCard({
  name,
  price,
  features,
  highlight,
  ctaHref,
}: {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
  ctaHref: string;
}) {
  return (
    <div
      className={`relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
        highlight
          ? "border-sky-400/50 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 shadow-lg shadow-sky-500/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
          Most Popular
        </div>
      )}
      <h3 className="text-white font-bold text-xl mb-2">{name}</h3>
      <div className="text-3xl font-black text-sky-400 mb-4">{price}</div>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-slate-300 text-sm"
          >
            <span className="text-sky-400 mt-0.5">&#10003;</span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href={ctaHref}
        className={`block text-center py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
          highlight
            ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 hover:shadow-lg hover:shadow-sky-500/25"
            : "bg-white/10 text-white hover:bg-white/20"
        }`}
      >
        Book Now
      </a>
    </div>
  );
}

/* ================================================================== */
/*  MAIN TEMPLATE                                                      */
/* ================================================================== */
export default function WaterSportsTemplate({
  data,
}: {
  data: NicheBusinessData;
}) {
  const custom = (data.custom || {}) as WaterSportsCustom;
  const bookingUrl = custom.bookingUrl || data.cta?.buttonLink || "#";
  const parkOpen = useParkStatus(custom.parkStatus);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Hours display text
  const hoursText = custom.parkStatus
    ? `${custom.parkStatus.openTime?.replace(/^0/, "")} - ${custom.parkStatus.closeTime?.replace(/^0/, "")}`
    : data.hours?.[0]?.hours || "Open Daily";

  // Split tagline into hero lines
  const taglineParts = data.tagline?.split(/\s+/) || [];
  const midpoint = Math.ceil(taglineParts.length / 2);
  const heroLine1 = taglineParts.slice(0, midpoint).join(" ");
  const heroLine2 = taglineParts.slice(midpoint).join(" ");

  // Scroll detection for header
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const scrollParent =
      el.closest(".overflow-auto") ??
      el.closest("[style*='overflow']") ??
      null;
    const container = scrollParent ?? window;
    const handler = () => {
      if (container instanceof Window) {
        setScrolled(window.scrollY > 40);
      } else {
        setScrolled((container as HTMLElement).scrollTop > 40);
      }
    };
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  // Icon components for Why Choose Us
  const featureIcons: Record<
    number,
    React.FC<{ className?: string }>
  > = {
    0: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    1: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    2: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    3: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    4: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    5: ({ className }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  };

  return (
    <>
      {/* ── GLOBAL STYLES ──────────────────────────────────── */}
      <style>{`
        .wsp-body { font-family: 'Inter', system-ui, -apple-system, sans-serif; }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(14, 165, 233, 0.3); }
          50% { box-shadow: 0 0 40px rgba(14, 165, 233, 0.6); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .skew-section {
          clip-path: polygon(0 5%, 100% 0, 100% 95%, 0 100%);
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
        .skew-section-reverse {
          clip-path: polygon(0 0, 100% 5%, 100% 100%, 0 95%);
          padding-top: 6rem;
          padding-bottom: 6rem;
        }
        @media (max-width: 768px) {
          .skew-section, .skew-section-reverse {
            clip-path: polygon(0 2%, 100% 0, 100% 98%, 0 100%);
            padding-top: 4rem;
            padding-bottom: 4rem;
          }
        }
        @keyframes wave-move {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes droplet-fall {
          0% { transform: translateY(-20px) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(60px) scale(0.5); opacity: 0; }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(0) scale(1); opacity: 0.4; }
          100% { transform: translateY(-80px) scale(0.3); opacity: 0; }
        }
        .wave-divider svg { animation: wave-move 8s linear infinite; }
        .ripple-circle { animation: ripple 3s ease-out infinite; }
        .ripple-circle:nth-child(2) { animation-delay: 1s; }
        .ripple-circle:nth-child(3) { animation-delay: 2s; }
        .droplet { animation: droplet-fall 2s ease-in infinite; }
        .droplet:nth-child(2) { animation-delay: 0.4s; }
        .droplet:nth-child(3) { animation-delay: 0.8s; }
        .droplet:nth-child(4) { animation-delay: 1.2s; }
        .droplet:nth-child(5) { animation-delay: 1.6s; }
        .bubble { animation: bubble-rise 3s ease-out infinite; }
        .bubble:nth-child(2) { animation-delay: 0.7s; }
        .bubble:nth-child(3) { animation-delay: 1.4s; }
        .bubble:nth-child(4) { animation-delay: 2.1s; }
      `}</style>

      <div className="wsp-body bg-slate-950 text-white min-h-screen">
        {/* ── GLASSMORPHIC HEADER ──────────────────────────── */}
        <header
          ref={navRef}
          className={`sticky top-0 z-40 transition-all duration-300 ${
            scrolled
              ? "bg-slate-950/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo / Brand */}
              <a href="#" className="flex-shrink-0 flex items-center gap-3">
                {data.logo ? (
                  <img
                    src={data.logo}
                    alt={data.businessName}
                    className="h-10 md:h-12 w-auto brightness-0 invert"
                  />
                ) : (
                  <span className="text-xl font-black tracking-tight">
                    <EditableText field="businessName">{data.businessName}</EditableText>
                  </span>
                )}
              </a>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-8">
                {(data.navLinks || []).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sky-400 hover:after:w-full after:transition-all"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Park Status + CTA */}
              <div className="hidden md:flex items-center gap-4">
                <div
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 border ${
                    parkOpen
                      ? "bg-emerald-500/10 border-emerald-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${parkOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${parkOpen ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {parkOpen ? "Park Open" : "Park Closed"}
                  </span>
                </div>
                <a
                  href={bookingUrl}
                  className="bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-sky-500/25 transition-all"
                >
                  BOOK NOW
                </a>
              </div>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {menuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
              <div className="md:hidden bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 mb-4 p-6 space-y-4">
                {(data.navLinks || []).map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-slate-200 hover:text-sky-400 font-medium transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center gap-2 pt-2">
                  <span
                    className={`w-2 h-2 rounded-full ${parkOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
                  />
                  <span
                    className={`text-xs font-bold uppercase ${parkOpen ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {parkOpen ? "Park Open" : "Park Closed"}
                  </span>
                </div>
                <a
                  href={bookingUrl}
                  className="block text-center bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 px-5 py-3 rounded-xl text-sm font-bold"
                >
                  BOOK YOUR SESSION
                </a>
              </div>
            )}
          </div>
        </header>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          {/* Video / Image Background */}
          <div className="absolute inset-0">
            {custom.heroVideoUrl ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={data.heroImage}
                className="w-full h-full object-cover"
              >
                <source src={custom.heroVideoUrl} type="video/mp4" />
              </video>
            ) : data.heroImage ? (
              <img
                src={data.heroImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : null}
            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/50 to-slate-950" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/80" />
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 w-full">
            <div className="max-w-4xl">
              {/* Park status badge */}
              <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mb-8">
                <span
                  className={`w-2 h-2 rounded-full ${parkOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
                />
                <span className="text-slate-300 text-sm">
                  {parkOpen ? "Open Now" : "Currently Closed"} &bull;{" "}
                  {hoursText}
                </span>
              </div>

              {/* Main heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] mb-6 tracking-tight uppercase">
                <EditableText field="tagline" value={data.tagline}>
                  <span className="block text-white">{heroLine1}</span>
                  <span className="block bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    {heroLine2}
                  </span>
                </EditableText>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
                <EditableText field="description" multiline>{data.description}</EditableText>
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href={bookingUrl}
                  className="group bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 px-5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-black uppercase tracking-wider hover:shadow-2xl hover:shadow-sky-500/25 transition-all hover:scale-105"
                >
                  {data.cta?.buttonText || "BOOK NOW"}
                  <svg
                    className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </a>
                {custom.heroVideoUrl && (
                  <button className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-white font-bold hover:bg-white/20 transition-all">
                    <svg
                      className="w-5 h-5 text-sky-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Watch Video
                  </button>
                )}
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
              <svg
                className="w-8 h-8 text-sky-400/50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* ── QUICK ACTIONS DASHBOARD ──────────────────────── */}
        {custom.activities && custom.activities.length > 0 && (
          <Section className="relative -mt-20 z-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {custom.activities.slice(0, 4).map((activity, i) => (
                  <a
                    key={i}
                    href="#activities"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-sky-400/50 hover:bg-white/10 transition-all duration-300"
                  >
                    {activity.image && (
                      <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                        <img
                          src={activity.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="relative p-6 flex flex-col gap-3">
                      <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
                        <svg
                          className="w-6 h-6 text-sky-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-white font-bold text-lg">
                        {activity.name}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                        {activity.description}
                      </p>
                      <span className="text-sky-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Learn more
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* ── STATS BAR ────────────────────────────────────── */}
        {data.stats && data.stats.length > 0 && (
          <StatsBar stats={data.stats} />
        )}

        {/* ── ACTIVITIES SECTION ───────────────────────────── */}
        {custom.activities && custom.activities.length > 0 && (
          <section
            className="skew-section bg-gradient-to-br from-slate-900 to-slate-800"
            id="activities"
          >
            <Section>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-black mb-4">
                    Our{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                      Activities
                    </span>
                  </h2>
                  <p className="text-slate-400 max-w-xl mx-auto">
                    Something for everyone — from beginners to advanced riders.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                  {custom.activities.map((activity, i) => (
                    <div
                      key={i}
                      className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-sky-400/30 hover:bg-white/10 transition-all"
                    >
                      {activity.image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={activity.image}
                            alt={activity.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-white font-bold text-lg">
                            {activity.name}
                          </h3>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              activity.difficulty === "beginner"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : activity.difficulty === "intermediate"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {activity.difficulty}
                          </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4">
                          {activity.description}
                        </p>
                        {activity.price && (
                          <div className="flex items-center justify-between">
                            <span className="text-sky-400 font-bold text-lg">
                              {activity.price}
                            </span>
                            <a
                              href={bookingUrl}
                              className="text-sm text-sky-400 font-semibold hover:text-sky-300 transition-colors flex items-center gap-1"
                            >
                              Book
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          </section>
        )}

        <WaveDivider color="#020617" />

        {/* ── PRICING SECTION ──────────────────────────────── */}
        {custom.pricingCategories && custom.pricingCategories.length > 0 ? (
          <PricingCategories
            categories={custom.pricingCategories}
            combos={custom.combos}
            bookingUrl={bookingUrl}
            phone={data.phone}
          />
        ) : data.pricing && data.pricing.length > 0 ? (
          <Section className="py-24" id="pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  Session{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    Pricing
                  </span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  All gear included in every session. Just bring your swimmers
                  and a towel.
                </p>
              </div>
              <div
                className={`grid gap-4 sm:gap-6 max-w-5xl mx-auto ${
                  data.pricing.length <= 3
                    ? "sm:grid-cols-2 lg:grid-cols-3"
                    : "sm:grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {data.pricing.map((p, i) => (
                  <PricingCard
                    key={i}
                    name={p.name}
                    price={p.price}
                    features={p.features}
                    highlight={p.highlighted}
                    ctaHref={bookingUrl}
                  />
                ))}
              </div>
            </div>
          </Section>
        ) : null}

        {/* ── SPECIAL SESSIONS ─────────────────────────────── */}
        {custom.specialSessions && custom.specialSessions.length > 0 && (
          <section className="skew-section bg-gradient-to-br from-slate-900 to-slate-800">
            <Section>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-black mb-4">
                    Special{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                      Sessions
                    </span>
                  </h2>
                  <p className="text-slate-400 max-w-xl mx-auto">
                    Something for everyone — from kids to dads to ladies-only
                    sessions.
                  </p>
                </div>
                <div
                  className={`grid gap-4 sm:gap-6 max-w-5xl mx-auto ${
                    custom.specialSessions.length <= 3
                      ? "grid-cols-2 sm:grid-cols-3"
                      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  }`}
                >
                  {custom.specialSessions.map((session, i) => {
                    const icons = ["Users", "Star", "Award", "Zap"];
                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-sky-400/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4">
                          <SessionIcon
                            name={icons[i % icons.length]}
                            className="w-5 h-5 text-sky-400"
                          />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-1">
                          {session.name}
                        </h3>
                        <p className="text-sky-400 text-sm font-semibold mb-1">
                          {session.day}
                        </p>
                        <p className="text-slate-400 text-sm">{session.time}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>
          </section>
        )}

        {/* ── PRO SHOP & GIFT CARDS ────────────────────────── */}
        {(custom.proShopUrl || custom.giftCardsUrl) && (
          <Section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-8 max-w-4xl mx-auto">
                {custom.proShopUrl && (
                  <a
                    href={custom.proShopUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 hover:border-sky-400/50 transition-all"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-500/10 transition-colors" />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center mb-6 group-hover:bg-sky-500/30 transition-colors">
                        <svg
                          className="w-7 h-7 text-sky-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3">
                        Pro Shop
                      </h3>
                      <p className="text-slate-400 leading-relaxed mb-6">
                        Top brands in wakeboards, life jackets, helmets, ropes &
                        accessories. Gear for all ages and abilities.
                      </p>
                      <span className="inline-flex items-center gap-2 text-sky-400 font-bold group-hover:gap-3 transition-all">
                        Shop Online
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </a>
                )}

                {custom.giftCardsUrl && (
                  <a
                    href={custom.giftCardsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900 p-8 hover:border-cyan-400/50 transition-all"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-cyan-500/10 transition-colors" />
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:bg-cyan-500/30 transition-colors">
                        <svg
                          className="w-7 h-7 text-cyan-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3">
                        Gift Cards
                      </h3>
                      <p className="text-slate-400 leading-relaxed mb-6">
                        The perfect gift for any occasion. Gift cards available
                        to purchase online for all activities.
                      </p>
                      <span className="inline-flex items-center gap-2 text-cyan-400 font-bold group-hover:gap-3 transition-all">
                        Buy a Gift Card
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </Section>
        )}

        {/* ── GALLERY ──────────────────────────────────────── */}
        {data.gallery && data.gallery.length > 0 && (
          <Section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  The{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    Vibe
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {data.gallery.map((img, i) => (
                  <div
                    key={i}
                    className={`group relative overflow-hidden rounded-2xl border border-white/10 hover:border-sky-400/30 transition-all ${
                      i === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt || "Gallery image"}
                      className="w-full h-full object-cover aspect-video group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        <WaveDivider color="#0c4a6e" />

        {/* ── WHY CHOOSE US ────────────────────────────────── */}
        {custom.whyChooseUs && custom.whyChooseUs.length > 0 && (
          <section className="skew-section-reverse bg-gradient-to-br from-sky-950/50 to-slate-900">
            <Section>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl sm:text-4xl font-black mb-4">
                    Why{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                      <EditableText field="businessName">{data.businessName}</EditableText>
                    </span>
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                  {custom.whyChooseUs.map((feature, i) => {
                    const IconComponent = featureIcons[i] || featureIcons[4];
                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:border-sky-400/30 hover:bg-white/10 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mb-4">
                          <IconComponent className="w-6 h-6 text-sky-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Section>
          </section>
        )}

        {/* ── TESTIMONIALS ─────────────────────────────────── */}
        {data.testimonials && data.testimonials.length > 0 && (
          <Section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  What Riders{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    Say
                  </span>
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
                {data.testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:border-sky-400/30 transition-all"
                  >
                    {t.rating && (
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <svg
                            key={j}
                            className="w-4 h-4 text-yellow-400 fill-yellow-400"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                    )}
                    <p className="text-slate-300 leading-relaxed mb-6 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <div className="text-white font-bold">{t.author}</div>
                      {t.role && (
                        <div className="text-sky-400 text-sm">{t.role}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}

        {/* ── CONTACT / LOCATION ───────────────────────────── */}
        {(data.phone || data.email || data.address) && (
          <section className="skew-section bg-gradient-to-br from-slate-900 to-slate-800" id="contact">
            <Section>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-black mb-6">
                    Find{" "}
                    <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                      Us
                    </span>
                  </h2>
                  <p className="text-slate-300 text-lg mb-8">
                    {data.address
                      ? `Located at ${data.address}. Come visit us!`
                      : "Come visit us!"}
                  </p>

                  <div className="space-y-6">
                    {data.phone && (
                      <a
                        href={`tel:${data.phone.replace(/\s/g, "")}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
                          <svg
                            className="w-5 h-5 text-sky-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Phone</div>
                          <div className="text-white font-bold">
                            {data.phone}
                          </div>
                        </div>
                      </a>
                    )}

                    {data.email && (
                      <a
                        href={`mailto:${data.email}`}
                        className="flex items-center gap-4 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center group-hover:bg-sky-500/30 transition-colors">
                          <svg
                            className="w-5 h-5 text-sky-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Email</div>
                          <div className="text-white font-bold">
                            {data.email}
                          </div>
                        </div>
                      </a>
                    )}

                    {data.address && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-sky-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Address</div>
                          <div className="text-white font-bold">
                            {data.address}
                          </div>
                        </div>
                      </div>
                    )}

                    {data.hours && data.hours.length > 0 && (
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-sky-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm">Hours</div>
                          <div className="text-white font-bold">
                            {hoursText}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Socials */}
                  {(custom.socialLinks || data.socialLinks) && (
                    <div className="flex gap-4 mt-8">
                      {(custom.socialLinks || data.socialLinks || []).map(
                        (s) => (
                          <a
                            key={s.platform}
                            href={s.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-sky-500/20 hover:border-sky-400/30 border border-white/10 transition-all"
                          >
                            <span className="text-white text-xs font-bold uppercase">
                              {s.platform.slice(0, 2)}
                            </span>
                          </a>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Section>
          </section>
        )}

        {/* ── FAQ ──────────────────────────────────────────── */}
        {data.faq && data.faq.length > 0 && (
          <Section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-black mb-4">
                  Common{" "}
                  <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                    Questions
                  </span>
                </h2>
              </div>
              <div className="space-y-3 max-w-3xl mx-auto">
                {data.faq.map((item, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className={`border rounded-xl overflow-hidden transition-colors ${isOpen ? "border-sky-400/40" : "border-white/10"}`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium hover:bg-white/[0.03] transition-colors"
                      >
                        <span className="text-white">{item.question}</span>
                        <svg
                          className={`w-4 h-4 shrink-0 ml-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      <div
                        className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-4 text-sm text-slate-400 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>
        )}

        {/* ── FINAL CTA ────────────────────────────────────── */}
        <Section className="py-24 relative overflow-hidden">
          <SplashParticles />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">
              {data.cta?.heading || "Ready to"}{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                {data.cta?.heading ? "" : "Send It?"}
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto mb-10">
              {data.cta?.description ||
                "Book your session online and get straight onto the water. All gear included, all skill levels welcome."}
            </p>
            <div className="relative inline-block">
              <RippleRings className="-inset-8 md:-inset-12" />
              <a
                href={bookingUrl}
                className="relative inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 px-6 py-4 sm:px-10 sm:py-5 rounded-xl sm:rounded-2xl text-base sm:text-xl font-black uppercase tracking-wider hover:shadow-2xl hover:shadow-sky-500/25 transition-all hover:scale-105 animate-pulse-glow"
              >
                {data.cta?.buttonText || "BOOK YOUR SESSION"}
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </Section>

        {/* ── FOOTER ───────────────────────────────────────── */}
        <footer className="border-t border-white/10 bg-slate-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div>
                {data.logo ? (
                  <img
                    src={data.logo}
                    alt={data.businessName}
                    className="h-12 w-auto brightness-0 invert mb-4"
                  />
                ) : (
                  <h3 className="text-xl font-black mb-4">
                    <EditableText field="businessName">{data.businessName}</EditableText>
                  </h3>
                )}
                <p className="text-slate-500 text-sm">
                  {data.description?.split(".")[0]}.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Quick Links
                </h4>
                <div className="space-y-2">
                  {(data.navLinks || []).map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="block text-slate-500 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  {custom.proShopUrl && (
                    <a
                      href={custom.proShopUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-slate-500 hover:text-white text-sm transition-colors"
                    >
                      Pro Shop
                    </a>
                  )}
                  {custom.giftCardsUrl && (
                    <a
                      href={custom.giftCardsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-slate-500 hover:text-white text-sm transition-colors"
                    >
                      Gift Cards
                    </a>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                  Contact
                </h4>
                <div className="space-y-2 text-slate-500 text-sm">
                  {data.phone && (
                    <a
                      href={`tel:${data.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      {data.phone}
                    </a>
                  )}
                  {data.email && (
                    <a
                      href={`mailto:${data.email}`}
                      className="flex items-center gap-2 hover:text-white transition-colors"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {data.email}
                    </a>
                  )}
                  {data.address && (
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {data.address}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-slate-600 text-sm">
                &copy; {new Date().getFullYear()} <EditableText field="businessName">{data.businessName}</EditableText>. All
                rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* ── STICKY BOTTOM BOOKING BAR ────────────────────── */}
        <BottomBookingBar
          parkOpen={parkOpen}
          hoursText={hoursText}
          phone={data.phone}
          bookingUrl={bookingUrl}
          ctaText={data.cta?.buttonText || "BOOK YOUR SESSION"}
        />

        {/* Bottom spacer for sticky bar */}
        <div className="h-16" />
      </div>
    </>
  );
}

/* ================================================================== */
/*  SUBCOMPONENTS                                                      */
/* ================================================================== */

/* ── Stats bar with in-view trigger ──────────────────────────────── */
function StatsBar({
  stats,
}: {
  stats: { label: string; value: string }[];
}) {
  const { ref, isInView } = useInView(0.3);
  return (
    <section
      ref={ref}
      className={`py-16 transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                <StatNumber value={stat.value} start={isInView} />
              </div>
              <div className="text-slate-400 text-sm uppercase tracking-wider mt-2 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Multi-tier pricing categories ──────────────────────────────── */
function PricingCategories({
  categories,
  combos,
  bookingUrl,
  phone,
}: {
  categories: NonNullable<WaterSportsCustom["pricingCategories"]>;
  combos?: WaterSportsCustom["combos"];
  bookingUrl: string;
  phone?: string;
}) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Section className="py-24" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Session{" "}
            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            All gear included in every session. Just bring your swimmers and a
            towel.
          </p>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === i
                    ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950"
                    : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        )}

        {/* Active category items */}
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {categories[activeTab]?.items.map((item, i) => (
              <div
                key={i}
                className={`flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 gap-1 sm:gap-4 ${
                  i > 0 ? "border-t border-white/10" : ""
                }`}
              >
                <div className="min-w-0">
                  <span className="text-white font-bold text-sm sm:text-base">{item.name}</span>
                  {item.note && (
                    <span className="text-slate-500 text-xs sm:text-sm ml-2">
                      {item.note}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sky-400 font-black text-base sm:text-lg">
                    {item.price}
                  </span>
                  <a
                    href={bookingUrl}
                    className="hidden sm:inline-block bg-white/10 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
                  >
                    Book
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combo deals */}
        {combos && combos.length > 0 && (
          <div className="mt-12 max-w-5xl mx-auto">
            <h3 className="text-2xl font-black text-center mb-8">
              Combo{" "}
              <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Deals
              </span>
            </h3>
            <div
              className={`grid gap-4 sm:gap-6 ${
                combos.length <= 2
                  ? "sm:grid-cols-2 max-w-3xl mx-auto"
                  : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {combos.map((combo, i) => (
                <div
                  key={i}
                  className={`relative rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] ${
                    combo.highlighted
                      ? "border-sky-400/50 bg-gradient-to-br from-sky-500/10 to-cyan-500/10 shadow-lg shadow-sky-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  {combo.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Best Value
                    </div>
                  )}
                  <h4 className="text-white font-bold text-xl mb-2">
                    {combo.name}
                  </h4>
                  {combo.description && (
                    <p className="text-slate-400 text-sm mb-4">
                      {combo.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-black text-sky-400">
                      {combo.adultPrice}
                    </span>
                    <span className="text-slate-500 text-sm">adult</span>
                    {combo.childPrice && (
                      <>
                        <span className="text-slate-600">/</span>
                        <span className="text-lg font-bold text-cyan-400">
                          {combo.childPrice}
                        </span>
                        <span className="text-slate-500 text-sm">child</span>
                      </>
                    )}
                  </div>
                  <a
                    href={bookingUrl}
                    className={`block text-center py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                      combo.highlighted
                        ? "bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 hover:shadow-lg hover:shadow-sky-500/25"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Book Now
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Membership callout */}
        {phone && (
          <div className="mt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center">
              <h3 className="text-2xl font-bold mb-2 text-white">
                Membership Deals
              </h3>
              <p className="text-slate-400 mb-6">
                Ask about our membership options for unlimited riding.
              </p>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-sky-400 font-bold hover:text-sky-300 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call us for membership info
              </a>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

/* ── Session icon mapper ─────────────────────────────────────────── */
function SessionIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  switch (name) {
    case "Users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "Star":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "Award":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
}

/* ── Sticky bottom booking bar ───────────────────────────────────── */
function BottomBookingBar({
  parkOpen,
  hoursText,
  phone,
  bookingUrl,
  ctaText,
}: {
  parkOpen: boolean;
  hoursText: string;
  phone?: string;
  bookingUrl: string;
  ctaText: string;
}) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const scrollParent =
      el.closest(".overflow-auto") ??
      el.closest("[style*='overflow']") ??
      null;
    const container = scrollParent ?? window;
    const handler = () => {
      if (container instanceof Window) {
        setVisible(window.scrollY > 400);
      } else {
        setVisible((container as HTMLElement).scrollTop > 400);
      }
    };
    container.addEventListener("scroll", handler, { passive: true });
    return () => container.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      ref={barRef}
      className={`sticky bottom-0 z-50 bg-slate-950/90 backdrop-blur-xl border-t border-white/10 py-3 px-4 transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${parkOpen ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`}
            />
            <span
              className={`text-sm font-bold ${parkOpen ? "text-emerald-400" : "text-red-400"}`}
            >
              {parkOpen ? "OPEN NOW" : "CLOSED"}
            </span>
          </div>
          <span className="text-slate-500 text-sm">&bull;</span>
          <span className="text-slate-400 text-sm">{hoursText}</span>
          {phone && (
            <>
              <span className="text-slate-500 text-sm">&bull;</span>
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-slate-400 text-sm hover:text-white transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {phone}
              </a>
            </>
          )}
        </div>
        <a
          href={bookingUrl}
          className="w-full sm:w-auto text-center bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-wider hover:shadow-lg hover:shadow-sky-500/25 transition-all animate-pulse-glow"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}
