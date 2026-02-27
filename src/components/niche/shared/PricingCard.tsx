"use client";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  colorScheme: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export default function PricingCard({
  name,
  price,
  period,
  features,
  highlighted,
  ctaText = "Get Started",
  colorScheme,
}: PricingCardProps) {
  return (
    <div
      className={`rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
        highlighted
          ? "ring-2 shadow-xl scale-[1.02]"
          : "border border-white/10"
      }`}
      style={{
        backgroundColor: highlighted
          ? `${colorScheme.primary}18`
          : `${colorScheme.background}`,
        borderColor: highlighted ? colorScheme.accent : undefined,
        // @ts-expect-error -- Tailwind ring-color via CSS custom property
        "--tw-ring-color": highlighted ? colorScheme.accent : undefined,
        boxShadow: highlighted
          ? `0 20px 40px ${colorScheme.accent}20`
          : undefined,
      }}
    >
      {highlighted && (
        <div
          className="text-[10px] font-bold uppercase tracking-wider mb-3 px-2 py-0.5 rounded-full self-start"
          style={{
            backgroundColor: `${colorScheme.accent}20`,
            color: colorScheme.accent,
          }}
        >
          Most Popular
        </div>
      )}
      <h3
        className="text-lg font-semibold"
        style={{ color: colorScheme.text }}
      >
        {name}
      </h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span
          className="text-3xl font-bold"
          style={{ color: colorScheme.accent }}
        >
          {price}
        </span>
        {period && (
          <span className="text-sm opacity-50">/{period}</span>
        )}
      </div>
      <ul className="mt-5 space-y-2.5 flex-1">
        {features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-2 text-sm opacity-80"
          >
            <svg
              className="w-4 h-4 mt-0.5 shrink-0"
              fill="none"
              stroke={colorScheme.accent}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <button
        className="mt-6 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:brightness-110"
        style={{
          backgroundColor: highlighted
            ? colorScheme.accent
            : `${colorScheme.accent}15`,
          color: highlighted ? colorScheme.background : colorScheme.accent,
        }}
      >
        {ctaText}
      </button>
    </div>
  );
}
