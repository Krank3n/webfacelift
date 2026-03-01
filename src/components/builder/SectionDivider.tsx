"use client";

import type { TemplateStyle } from "@/types/blueprint";

export type DividerVariant =
  | "wave"
  | "slant"
  | "curve"
  | "taper"
  | "layered-wave"
  | "dots";

function WaveDivider({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="w-full h-[40px] md:h-[60px]"
    >
      <path
        d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z"
        fill={fill}
      />
    </svg>
  );
}

function SlantDivider({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="w-full h-[40px] md:h-[60px]"
    >
      <polygon points="0,60 1440,0 1440,60" fill={fill} />
    </svg>
  );
}

function CurveDivider({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="w-full h-[40px] md:h-[60px]"
    >
      <path d="M0,60 Q720,0 1440,60 L1440,60 L0,60 Z" fill={fill} />
    </svg>
  );
}

function TaperDivider({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className="w-full h-[30px] md:h-[50px]"
    >
      <polygon points="720,0 1440,60 0,60" fill={fill} />
    </svg>
  );
}

function LayeredWaveDivider({ fill }: { fill: string }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="w-full h-[50px] md:h-[70px]"
    >
      <path
        d="M0,50 C180,80 360,20 540,50 C720,80 900,20 1080,50 C1260,80 1440,30 1440,50 L1440,80 L0,80 Z"
        fill={fill}
        fillOpacity="0.4"
      />
      <path
        d="M0,60 C200,30 400,80 720,50 C1040,20 1240,70 1440,55 L1440,80 L0,80 Z"
        fill={fill}
      />
    </svg>
  );
}

function DotsDivider({ fill }: { fill: string }) {
  return (
    <div className="flex justify-center items-center gap-2 py-4 md:py-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: i === 2 ? 6 : 4,
            height: i === 2 ? 6 : 4,
            backgroundColor: fill,
            opacity: i === 2 ? 0.5 : 0.2,
          }}
        />
      ))}
    </div>
  );
}

const dividerComponents: Record<
  DividerVariant,
  React.ComponentType<{ fill: string }>
> = {
  wave: WaveDivider,
  slant: SlantDivider,
  curve: CurveDivider,
  taper: TaperDivider,
  "layered-wave": LayeredWaveDivider,
  dots: DotsDivider,
};

/** Divider variants suited to each template style */
const templateDividers: Record<TemplateStyle, DividerVariant[]> = {
  glass: ["wave", "curve", "layered-wave"],
  bold: ["slant", "taper", "slant"],
  minimal: ["dots", "dots", "dots"],
  vibrant: ["layered-wave", "curve", "wave"],
};

/**
 * Pick a divider variant based on template style and position index.
 * Cycles through the template's preferred dividers, alternating
 * for visual variety.
 */
export function getDividerVariant(
  template: TemplateStyle,
  index: number
): DividerVariant {
  const variants = templateDividers[template];
  return variants[index % variants.length];
}

export default function SectionDivider({
  variant,
  fillColor,
  flip,
}: {
  variant: DividerVariant;
  fillColor: string;
  flip?: boolean;
}) {
  const Comp = dividerComponents[variant];

  return (
    <div
      className={`relative w-full leading-[0] -my-px pointer-events-none ${
        flip ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    >
      <Comp fill={fillColor} />
    </div>
  );
}
