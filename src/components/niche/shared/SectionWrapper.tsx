"use client";

import { useInView } from "../hooks/useInView";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SectionWrapper({
  children,
  id,
  className = "",
  style,
}: SectionWrapperProps) {
  const { ref, isInView } = useInView(0.1);

  return (
    <section
      ref={ref}
      id={id}
      className={`transition-all duration-700 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}
