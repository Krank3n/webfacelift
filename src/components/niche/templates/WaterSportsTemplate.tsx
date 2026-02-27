"use client";

import { useState, useEffect } from "react";
import type { NicheBusinessData, WaterSportsCustom } from "@/types/niche";
import NicheNavbar from "../shared/NicheNavbar";
import SectionWrapper from "../shared/SectionWrapper";
import AnimatedCounter from "../shared/AnimatedCounter";
import PricingCard from "../shared/PricingCard";
import GalleryGrid from "../shared/GalleryGrid";
import TestimonialCards from "../shared/TestimonialCards";
import FAQAccordion from "../shared/FAQAccordion";
import StickyBottomBar from "../shared/StickyBottomBar";
import NicheFooter from "../shared/NicheFooter";

/* ------------------------------------------------------------------ */
/*  Enhanced dual-layer wave SVG divider                               */
/* ------------------------------------------------------------------ */
function WaveDivider({
  flip = false,
  color = "#0c1e3a",
  className = "",
}: {
  flip?: boolean;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-[0] ${
        flip ? "rotate-180" : ""
      } ${className}`}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="w-full h-[60px] md:h-[80px] wave-move"
      >
        <path
          d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z"
          fill={color}
          opacity="0.5"
        />
        <path
          d="M0,80 C320,30 680,110 1040,50 C1240,20 1380,60 1440,80 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bubble particle (floating animation)                               */
/* ------------------------------------------------------------------ */
function Bubble({ delay, size, left }: { delay: number; size: number; left: number }) {
  return (
    <div
      className="absolute rounded-full opacity-20 pointer-events-none bubble-float"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        bottom: "-10%",
        background:
          "radial-gradient(circle at 30% 30%, rgba(0,188,212,0.6), rgba(0,150,136,0.2))",
        animationDelay: `${delay}s`,
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Splash particles (droplets + bubbles)                              */
/* ------------------------------------------------------------------ */
function SplashParticles() {
  const droplets = Array.from({ length: 8 }, (_, i) => ({
    left: 5 + Math.random() * 90,
    delay: i * 1.5,
    size: 3 + Math.random() * 5,
    duration: 3 + Math.random() * 2,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {droplets.map((d, i) => (
        <div
          key={i}
          className="absolute droplet-fall"
          style={{
            left: `${d.left}%`,
            top: "-5%",
            width: d.size,
            height: d.size * 2.5,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            background: "rgba(0,188,212,0.25)",
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Difficulty badge                                                   */
/* ------------------------------------------------------------------ */
function DifficultyBadge({
  difficulty,
}: {
  difficulty: "beginner" | "intermediate" | "advanced";
}) {
  const map = {
    beginner: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/30",
      label: "Beginner",
    },
    intermediate: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      label: "Intermediate",
    },
    advanced: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
      label: "Advanced",
    },
  };
  const m = map[difficulty];
  return (
    <span
      className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${m.bg} ${m.text} ${m.border}`}
    >
      {m.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Lucide-style icon mapper (inline SVGs for common icons)            */
/* ------------------------------------------------------------------ */
function FeatureIcon({ name, color }: { name: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    shield: (
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    ),
    zap: (
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
    ),
    users: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    star: (
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26" />
    ),
    heart: (
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
    "map-pin": (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </>
    ),
    droplets: (
      <>
        <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
        <path d="M12.56 14.1c1.93 0 3.5-1.6 3.5-3.57 0-1.02-.5-1.99-1.5-2.81S12.85 5.8 12.56 4.5c-.29 1.3-1.14 2.52-2.14 3.22S9.06 9.51 9.06 10.53c0 1.97 1.57 3.57 3.5 3.57z" />
      </>
    ),
    "thumbs-up": (
      <>
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </>
    ),
    gift: (
      <>
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </>
    ),
    "shopping-bag": (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7"
    >
      {icons[name] || icons["star"]}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Main template                                                      */
/* ------------------------------------------------------------------ */
export default function WaterSportsTemplate({
  data,
}: {
  data: NicheBusinessData;
}) {
  const custom = data.custom as WaterSportsCustom | undefined;

  /* ------ Timezone-aware park open/closed status ------ */
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (custom?.parkStatus) {
      let currentHour: number;
      if (custom.parkStatus.timezone) {
        try {
          const formatter = new Intl.DateTimeFormat("en-US", {
            timeZone: custom.parkStatus.timezone,
            hour: "numeric",
            hour12: false,
          });
          currentHour = parseInt(formatter.format(new Date()), 10);
        } catch {
          currentHour = new Date().getHours();
        }
      } else {
        currentHour = new Date().getHours();
      }
      const openHour = parseInt(custom.parkStatus.openTime.split(":")[0], 10);
      const closeHour = parseInt(custom.parkStatus.closeTime.split(":")[0], 10);
      setIsOpen(currentHour >= openHour && currentHour < closeHour);
    }
  }, [custom?.parkStatus]);

  /* ------ Pricing tab state ------ */
  const [activePricingTab, setActivePricingTab] = useState(0);

  /* ------ Color scheme with water-sports defaults ------ */
  const colors = data.colorScheme ?? {
    primary: "#0c1e3a",
    secondary: "#009688",
    accent: "#00bcd4",
    background: "#0c1e3a",
    text: "#ffffff",
  };

  /* ------ Nav links ------ */
  const navLinks = data.navLinks ?? [
    { label: "Activities", href: "#activities" },
    { label: "Pricing", href: "#pricing" },
    { label: "Gallery", href: "#gallery" },
    { label: "Reviews", href: "#testimonials" },
    { label: "FAQ", href: "#faq" },
  ];

  const bookingUrl = custom?.bookingUrl ?? data.cta?.buttonLink ?? "#";
  const socialLinks = custom?.socialLinks ?? data.socialLinks;

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      {/* ============================================================ */}
      {/*  Inline keyframe animations                                  */}
      {/* ============================================================ */}
      <style>{`
        @keyframes bubbleFloat {
          0%   { transform: translateY(0) scale(1);   opacity: 0; }
          10%  { opacity: 0.2; }
          90%  { opacity: 0.15; }
          100% { transform: translateY(-110vh) scale(0.4); opacity: 0; }
        }
        .bubble-float {
          animation: bubbleFloat 12s ease-in infinite;
        }
        @keyframes splash {
          0%   { transform: scale(0); opacity: 0.5; }
          100% { transform: scale(4); opacity: 0; }
        }
        .splash-ring {
          animation: splash 0.8s ease-out forwards;
        }
        @keyframes waveShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .wave-shimmer {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0,188,212,0.08) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: waveShimmer 6s linear infinite;
        }
        @keyframes rippleHover {
          0%   { box-shadow: 0 0 0 0 rgba(0,188,212,0.35); }
          100% { box-shadow: 0 0 0 14px rgba(0,188,212,0); }
        }
        .ripple-hover:hover {
          animation: rippleHover 1s ease-out;
        }
        @keyframes heroFadeUp {
          0%   { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .hero-fade-up {
          animation: heroFadeUp 1s ease-out forwards;
        }
        .hero-fade-up-delay {
          animation: heroFadeUp 1s ease-out 0.25s forwards;
          opacity: 0;
        }
        .hero-fade-up-delay-2 {
          animation: heroFadeUp 1s ease-out 0.5s forwards;
          opacity: 0;
        }
        @keyframes dropletFall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 0.3; }
          80%  { opacity: 0.15; }
          100% { transform: translateY(120vh) rotate(25deg); opacity: 0; }
        }
        .droplet-fall {
          animation: dropletFall 4s ease-in infinite;
        }
        @keyframes waveMove {
          0%   { transform: translateX(0); }
          50%  { transform: translateX(-15px); }
          100% { transform: translateX(0); }
        }
        .wave-move {
          animation: waveMove 6s ease-in-out infinite;
        }
        @keyframes splashUp {
          0%   { transform: translateY(0) scale(1); opacity: 0.5; }
          50%  { transform: translateY(-30px) scale(1.2); opacity: 0.3; }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
        }
        .splash-up:hover::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 6px;
          height: 6px;
          background: rgba(0,188,212,0.4);
          border-radius: 50%;
          animation: splashUp 0.6s ease-out forwards;
        }
      `}</style>

      {/* ============================================================ */}
      {/*  Navbar                                                      */}
      {/* ============================================================ */}
      <NicheNavbar
        brand={data.businessName}
        links={navLinks}
        ctaText="Book Now"
        ctaLink={bookingUrl}
        statusBadge={
          custom?.parkStatus
            ? {
                label: isOpen ? "Open Now" : "Closed",
                variant: isOpen ? "open" : "closed",
              }
            : undefined
        }
        colorScheme={colors}
      />

      {/* ============================================================ */}
      {/*  Hero (with video background support)                        */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background video (falls back to image) */}
        {custom?.heroVideoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={data.heroImage}
          >
            <source src={custom.heroVideoUrl} type={custom.heroVideoUrl.endsWith(".webm") ? "video/webm" : "video/mp4"} />
          </video>
        ) : data.heroImage ? (
          <img
            src={data.heroImage}
            alt={data.businessName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : null}

        {/* Dark overlay with blue tint */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(12,30,58,0.75) 0%, rgba(0,150,136,0.35) 50%, rgba(12,30,58,0.9) 100%)",
          }}
        />

        {/* Floating bubbles */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <Bubble delay={0} size={24} left={10} />
          <Bubble delay={2} size={18} left={25} />
          <Bubble delay={4} size={32} left={45} />
          <Bubble delay={1} size={14} left={60} />
          <Bubble delay={3} size={22} left={75} />
          <Bubble delay={5} size={28} left={88} />
          <Bubble delay={6} size={16} left={35} />
          <Bubble delay={7} size={20} left={55} />
        </div>

        {/* Splash droplet particles */}
        <SplashParticles />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Status tag */}
          {custom?.parkStatus && (
            <div className="hero-fade-up mb-6">
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isOpen
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOpen ? "bg-green-400 animate-pulse" : "bg-red-400"
                  }`}
                />
                {isOpen
                  ? `Open today ${custom.parkStatus.openTime} - ${custom.parkStatus.closeTime}`
                  : `Opens at ${custom.parkStatus.openTime}`}
              </span>
            </div>
          )}

          <h1 className="hero-fade-up text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
            {data.businessName}
          </h1>

          <p className="hero-fade-up-delay mt-6 text-lg sm:text-xl md:text-2xl opacity-80 max-w-2xl mx-auto leading-relaxed">
            {data.tagline}
          </p>

          <div className="hero-fade-up-delay-2 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={bookingUrl}
              className="relative px-8 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:brightness-110 hover:scale-105 shadow-lg ripple-hover splash-up"
              style={{
                backgroundColor: colors.accent,
                color: colors.background,
                boxShadow: `0 8px 32px ${colors.accent}40`,
              }}
            >
              Book Your Session
            </a>
            <a
              href="#activities"
              className="px-8 py-4 rounded-2xl text-base font-semibold border border-white/20 hover:bg-white/10 transition-all duration-300"
            >
              Explore Activities
            </a>
          </div>

          {/* Season info */}
          {custom?.parkStatus?.seasonStart && custom.parkStatus.seasonEnd && (
            <p className="hero-fade-up-delay-2 mt-6 text-sm opacity-50">
              Season: {custom.parkStatus.seasonStart} &ndash;{" "}
              {custom.parkStatus.seasonEnd}
            </p>
          )}
        </div>

        {/* Bottom wave transition */}
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider color={colors.background} />
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Stats Bar                                                   */}
      {/* ============================================================ */}
      {data.stats && data.stats.length > 0 && (
        <SectionWrapper
          className="py-8 wave-shimmer"
          style={{
            backgroundColor: colors.background,
            borderBottom: `1px solid ${colors.accent}15`,
          }}
        >
          <div className="max-w-7xl mx-auto">
            <AnimatedCounter stats={data.stats} colorScheme={colors} />
          </div>
        </SectionWrapper>
      )}

      {/* ============================================================ */}
      {/*  Why Choose Us                                               */}
      {/* ============================================================ */}
      {custom?.whyChooseUs && custom.whyChooseUs.length > 0 && (
        <>
          <SectionWrapper
            id="why-us"
            className="py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: colors.background }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Why Choose Us
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  Everything you need for the ultimate water sports experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {custom.whyChooseUs.map((feature, i) => (
                  <div
                    key={i}
                    className="group p-6 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 text-center"
                    style={{ backgroundColor: `${colors.primary}40` }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${colors.accent}15` }}
                    >
                      <FeatureIcon name={feature.icon} color={colors.accent} />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <WaveDivider color={colors.primary} />
        </>
      )}

      {/* ============================================================ */}
      {/*  Activities                                                  */}
      {/* ============================================================ */}
      {custom?.activities && custom.activities.length > 0 && (
        <>
          <SectionWrapper
            id="activities"
            className="py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: custom?.whyChooseUs ? colors.primary : colors.background }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <h2
                  className="text-3xl sm:text-4xl font-bold"
                  style={{ color: colors.text }}
                >
                  Our Activities
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  From first-timers to seasoned riders, we have something for
                  every skill level.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {custom.activities.map((activity, i) => (
                  <div
                    key={i}
                    className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1"
                    style={{
                      backgroundColor: `${colors.primary}60`,
                    }}
                  >
                    {/* Activity image */}
                    {activity.image && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={activity.image}
                          alt={activity.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(to top, ${colors.background}cc, transparent 60%)`,
                          }}
                        />
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <h3 className="text-lg font-bold">{activity.name}</h3>
                        <DifficultyBadge difficulty={activity.difficulty} />
                      </div>

                      <p className="text-sm opacity-70 leading-relaxed mb-4">
                        {activity.description}
                      </p>

                      {activity.price && (
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xl font-bold"
                            style={{ color: colors.accent }}
                          >
                            {activity.price}
                          </span>
                          <a
                            href={bookingUrl}
                            className="text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-200 hover:brightness-110"
                            style={{
                              backgroundColor: `${colors.accent}20`,
                              color: colors.accent,
                            }}
                          >
                            Book
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <WaveDivider
            color={colors.background}
            className="relative z-10"
            flip
          />
        </>
      )}

      {/* ============================================================ */}
      {/*  Multi-Tier Pricing (pricingCategories)                      */}
      {/* ============================================================ */}
      {custom?.pricingCategories && custom.pricingCategories.length > 0 && (
        <>
          <SectionWrapper
            id="pricing"
            className="py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: colors.background }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Pricing &amp; Packages
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  Choose the experience that suits your adventure.
                </p>
              </div>

              {/* Category tabs */}
              {custom.pricingCategories.length > 1 && (
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                  {custom.pricingCategories.map((cat, i) => (
                    <button
                      key={i}
                      onClick={() => setActivePricingTab(i)}
                      className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        activePricingTab === i
                          ? "shadow-lg"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      style={
                        activePricingTab === i
                          ? { backgroundColor: colors.accent, color: colors.background }
                          : { backgroundColor: `${colors.primary}60`, color: colors.text }
                      }
                    >
                      {cat.category}
                    </button>
                  ))}
                </div>
              )}

              {/* Pricing items grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
                {custom.pricingCategories[activePricingTab]?.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl border border-white/10 hover:border-cyan-400/20 transition-all duration-300"
                    style={{ backgroundColor: `${colors.primary}50` }}
                  >
                    <h4 className="font-bold text-base mb-2">{item.name}</h4>
                    <div
                      className="text-2xl font-extrabold mb-1"
                      style={{ color: colors.accent }}
                    >
                      {item.price}
                    </div>
                    {item.note && (
                      <p className="text-xs opacity-50">{item.note}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <WaveDivider color={colors.primary} />
        </>
      )}

      {/* ============================================================ */}
      {/*  Combo Deals                                                 */}
      {/* ============================================================ */}
      {custom?.combos && custom.combos.length > 0 && (
        <>
          <SectionWrapper
            id="combos"
            className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            style={{ backgroundColor: colors.primary }}
          >
            <SplashParticles />
            <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Combo Deals
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  Save more when you bundle your water sports experience.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {custom.combos.map((combo, i) => (
                  <div
                    key={i}
                    className={`relative p-6 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                      combo.highlighted
                        ? "border-cyan-400/50 shadow-lg"
                        : "border-white/10"
                    }`}
                    style={{
                      backgroundColor: combo.highlighted
                        ? `${colors.accent}10`
                        : `${colors.background}60`,
                      boxShadow: combo.highlighted ? `0 8px 32px ${colors.accent}20` : undefined,
                    }}
                  >
                    {combo.highlighted && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: colors.accent, color: colors.background }}
                      >
                        Best Value
                      </div>
                    )}
                    <h4 className="text-lg font-bold mb-3">{combo.name}</h4>
                    {combo.description && (
                      <p className="text-sm opacity-60 mb-4 leading-relaxed">{combo.description}</p>
                    )}
                    <div className="flex items-baseline gap-3">
                      <div>
                        <span className="text-xs opacity-50 block">Adult</span>
                        <span className="text-2xl font-extrabold" style={{ color: colors.accent }}>
                          {combo.adultPrice}
                        </span>
                      </div>
                      {combo.childPrice && (
                        <div>
                          <span className="text-xs opacity-50 block">Child</span>
                          <span className="text-xl font-bold opacity-80">
                            {combo.childPrice}
                          </span>
                        </div>
                      )}
                    </div>
                    <a
                      href={bookingUrl}
                      className="block mt-5 text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110"
                      style={{
                        backgroundColor: combo.highlighted ? colors.accent : `${colors.accent}20`,
                        color: combo.highlighted ? colors.background : colors.accent,
                      }}
                    >
                      Book Combo
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <WaveDivider color={colors.background} flip />
        </>
      )}

      {/* ============================================================ */}
      {/*  Fallback flat pricing (if no pricingCategories)             */}
      {/* ============================================================ */}
      {!custom?.pricingCategories && data.pricing && data.pricing.length > 0 && (
        <>
          <SectionWrapper
            id="pricing"
            className="py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Pricing &amp; Packages
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  Choose the package that suits your adventure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {data.pricing.map((plan, i) => (
                  <PricingCard
                    key={i}
                    name={plan.name}
                    price={plan.price}
                    period={plan.period}
                    features={plan.features}
                    highlighted={plan.highlighted}
                    ctaText="Book Now"
                    colorScheme={colors}
                  />
                ))}
              </div>
            </div>
          </SectionWrapper>

          <WaveDivider color={colors.background} flip />
        </>
      )}

      {/* ============================================================ */}
      {/*  Special Sessions                                            */}
      {/* ============================================================ */}
      {custom?.specialSessions && custom.specialSessions.length > 0 && (
        <>
          <SectionWrapper
            id="sessions"
            className="py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: colors.background }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Special Sessions
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  Exclusive events and special ride times throughout the week.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {custom.specialSessions.map((session, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-white/10 hover:border-cyan-400/20 transition-all duration-300 text-center"
                    style={{ backgroundColor: `${colors.primary}40` }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ backgroundColor: `${colors.accent}15` }}
                    >
                      <FeatureIcon name="calendar" color={colors.accent} />
                    </div>
                    <h4 className="font-bold text-base mb-1">{session.name}</h4>
                    <p className="text-sm opacity-70">{session.day}</p>
                    <p className="text-sm font-semibold mt-1" style={{ color: colors.accent }}>
                      {session.time}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionWrapper>

          <WaveDivider color={colors.primary} />
        </>
      )}

      {/* ============================================================ */}
      {/*  Secondary Video Section                                     */}
      {/* ============================================================ */}
      {custom?.secondaryVideoUrl && (
        <SectionWrapper
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: colors.primary }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full aspect-video object-cover"
              >
                <source
                  src={custom.secondaryVideoUrl}
                  type={custom.secondaryVideoUrl.endsWith(".webm") ? "video/webm" : "video/mp4"}
                />
              </video>
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* ============================================================ */}
      {/*  Gallery                                                     */}
      {/* ============================================================ */}
      {data.gallery && data.gallery.length > 0 && (
        <SectionWrapper
          id="gallery"
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: custom?.secondaryVideoUrl ? colors.primary : colors.background }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Catch the Action
              </h2>
              <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                Moments of pure adrenaline captured on the water.
              </p>
            </div>

            <div className="ripple-hover rounded-2xl overflow-hidden">
              <GalleryGrid
                images={data.gallery}
                columns={3}
                accentColor={colors.accent}
              />
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* ============================================================ */}
      {/*  Testimonials                                                */}
      {/* ============================================================ */}
      {data.testimonials && data.testimonials.length > 0 && (
        <>
          <WaveDivider color={colors.primary} />

          <SectionWrapper
            id="testimonials"
            className="py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: colors.primary }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  What Riders Say
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  Real experiences from our water sports community.
                </p>
              </div>

              <TestimonialCards
                testimonials={data.testimonials}
                accentColor={colors.accent}
              />
            </div>
          </SectionWrapper>

          <WaveDivider color={colors.background} flip />
        </>
      )}

      {/* ============================================================ */}
      {/*  Secondary Services (Pro Shop + Gift Cards)                  */}
      {/* ============================================================ */}
      {(custom?.proShopUrl || custom?.giftCardsUrl) && (
        <SectionWrapper
          className="py-20 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: colors.background }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold">
                More to Explore
              </h2>
              <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                Gear up or gift the experience to someone special.
              </p>
            </div>

            <div className={`grid gap-6 ${custom?.proShopUrl && custom?.giftCardsUrl ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-md mx-auto"}`}>
              {custom?.proShopUrl && (
                <a
                  href={custom.proShopUrl}
                  className="group p-8 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 text-center block"
                  style={{ backgroundColor: `${colors.primary}40` }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${colors.accent}15` }}
                  >
                    <FeatureIcon name="shopping-bag" color={colors.accent} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pro Shop</h3>
                  <p className="text-sm opacity-60">
                    Browse boards, wetsuits, and gear from top brands.
                  </p>
                  <span
                    className="inline-block mt-4 text-sm font-semibold"
                    style={{ color: colors.accent }}
                  >
                    Shop Now &rarr;
                  </span>
                </a>
              )}

              {custom?.giftCardsUrl && (
                <a
                  href={custom.giftCardsUrl}
                  className="group p-8 rounded-2xl border border-white/10 hover:border-cyan-400/30 transition-all duration-500 hover:-translate-y-1 text-center block"
                  style={{ backgroundColor: `${colors.primary}40` }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${colors.accent}15` }}
                  >
                    <FeatureIcon name="gift" color={colors.accent} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Gift Cards</h3>
                  <p className="text-sm opacity-60">
                    Give the gift of water sports — perfect for any occasion.
                  </p>
                  <span
                    className="inline-block mt-4 text-sm font-semibold"
                    style={{ color: colors.accent }}
                  >
                    Buy Gift Card &rarr;
                  </span>
                </a>
              )}
            </div>
          </div>
        </SectionWrapper>
      )}

      {/* ============================================================ */}
      {/*  CTA Section                                                 */}
      {/* ============================================================ */}
      {data.cta && (
        <>
          <WaveDivider color={colors.primary} />

          <SectionWrapper
            className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
            style={{ backgroundColor: colors.primary }}
          >
            {/* Background bubbles */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
              <Bubble delay={0} size={40} left={8} />
              <Bubble delay={3} size={28} left={50} />
              <Bubble delay={5} size={34} left={85} />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                {data.cta.heading}
              </h2>
              {data.cta.description && (
                <p className="mt-6 text-lg opacity-70 leading-relaxed">
                  {data.cta.description}
                </p>
              )}
              <a
                href={data.cta.buttonLink ?? bookingUrl}
                className="relative inline-block mt-10 px-10 py-4 rounded-2xl text-base font-bold transition-all duration-300 hover:brightness-110 hover:scale-105 ripple-hover splash-up"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.background,
                  boxShadow: `0 8px 32px ${colors.accent}40`,
                }}
              >
                {data.cta.buttonText}
              </a>
            </div>
          </SectionWrapper>

          <WaveDivider color={colors.background} flip />
        </>
      )}

      {/* ============================================================ */}
      {/*  FAQ                                                         */}
      {/* ============================================================ */}
      {data.faq && data.faq.length > 0 && (
        <>
          <SectionWrapper
            id="faq"
            className="py-20 px-4 sm:px-6 lg:px-8"
            style={{ backgroundColor: colors.background }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-14">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 text-base opacity-60 max-w-xl mx-auto">
                  Everything you need to know before hitting the water.
                </p>
              </div>

              <FAQAccordion items={data.faq} accentColor={colors.accent} />
            </div>
          </SectionWrapper>
        </>
      )}

      {/* ============================================================ */}
      {/*  Footer                                                      */}
      {/* ============================================================ */}
      <NicheFooter
        businessName={data.businessName}
        description={data.description}
        phone={data.phone}
        email={data.email}
        address={data.address}
        navLinks={data.navLinks}
        socialLinks={socialLinks}
        hours={data.hours}
        colorScheme={colors}
      />

      {/* ============================================================ */}
      {/*  Sticky Bottom Bar                                           */}
      {/* ============================================================ */}
      <StickyBottomBar
        text="Ready to ride? Book your session today!"
        buttonText="Book Now"
        buttonLink={bookingUrl}
        colorScheme={colors}
      />
    </div>
  );
}
