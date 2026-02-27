"use client";

import { useInView } from "../hooks/useInView";
import { useCountUp } from "../hooks/useCountUp";

interface StatItem {
  label: string;
  value: string;
}

interface AnimatedCounterProps {
  stats: StatItem[];
  colorScheme: {
    primary: string;
    accent: string;
    text: string;
  };
}

function parseNumeric(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([^0-9]*)(\d+)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: value };
  return { num: parseInt(match[2], 10), prefix: match[1], suffix: match[3] };
}

function StatCounter({
  stat,
  inView,
  color,
}: {
  stat: StatItem;
  inView: boolean;
  color: string;
}) {
  const { num, prefix, suffix } = parseNumeric(stat.value);
  const count = useCountUp(num, 2000, inView);

  return (
    <div className="text-center px-4">
      <div className="text-3xl sm:text-4xl font-bold" style={{ color }}>
        {prefix}
        {num > 0 ? count : stat.value}
        {num > 0 ? suffix : ""}
      </div>
      <div className="text-sm mt-1 opacity-70">{stat.label}</div>
    </div>
  );
}

export default function AnimatedCounter({
  stats,
  colorScheme,
}: AnimatedCounterProps) {
  const { ref, isInView } = useInView(0.2);

  return (
    <div
      ref={ref}
      className="flex flex-wrap justify-center gap-8 py-10 px-4"
      style={{ color: colorScheme.text }}
    >
      {stats.map((stat) => (
        <StatCounter
          key={stat.label}
          stat={stat}
          inView={isInView}
          color={colorScheme.accent}
        />
      ))}
    </div>
  );
}
