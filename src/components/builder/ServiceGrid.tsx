"use client";

import type { ServiceGridBlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import {
  Briefcase, Shield, Zap, Heart, Star, Clock, Phone, Mail,
  MapPin, Users, Settings, Home, Globe, Wrench, Building,
  Truck, Leaf, Camera, Code, Palette, HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import EditableText from "./EditableText";
import ScrollReveal from "./ScrollReveal";

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase, shield: Shield, zap: Zap, heart: Heart,
  star: Star, clock: Clock, phone: Phone, mail: Mail,
  "map-pin": MapPin, users: Users, settings: Settings, home: Home,
  globe: Globe, wrench: Wrench, building: Building, truck: Truck,
  leaf: Leaf, camera: Camera, code: Code, palette: Palette,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name.toLowerCase()] || HelpCircle;
}

export default function ServiceGrid({ block, template }: { block: ServiceGridBlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const variant = block.variant || "cards";
  const cols = block.columns || 3;
  const gridClass =
    cols === 2
      ? "grid-cols-1 md:grid-cols-2"
      : cols === 4
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            <EditableText field="title">{block.title}</EditableText>
          </h2>
          {block.subtitle && (
            <p className="mt-4 text-lg opacity-60 max-w-2xl mx-auto">
              <EditableText field="subtitle">{block.subtitle}</EditableText>
            </p>
          )}
        </ScrollReveal>

        {variant === "minimal-list" ? (
          <div className="max-w-3xl mx-auto divide-y divide-white/[0.06]">
            {block.services.map((service, i) => {
              const Icon = getIcon(service.icon);
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="group flex items-start gap-4 py-6">
                    <div className={cn("w-10 h-10 flex items-center justify-center shrink-0 mt-0.5", t.iconBox)}>
                      <Icon size={20} className="opacity-80" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        <EditableText field={`services.${i}.title`}>{service.title}</EditableText>
                      </h3>
                      <p className="text-sm opacity-60 leading-relaxed mt-1">
                        <EditableText field={`services.${i}.description`} multiline>{service.description}</EditableText>
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : variant === "icon-left" ? (
          <div className={`grid ${gridClass} gap-6`}>
            {block.services.map((service, i) => {
              const Icon = getIcon(service.icon);
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className={cn("group flex items-start gap-4 p-6 h-full", t.card, t.cardHover)}>
                    <div className={cn("w-10 h-10 flex items-center justify-center shrink-0", t.iconBox)}>
                      <Icon size={20} className="opacity-80 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        <EditableText field={`services.${i}.title`}>{service.title}</EditableText>
                      </h3>
                      <p className="text-sm opacity-60 leading-relaxed">
                        <EditableText field={`services.${i}.description`} multiline>{service.description}</EditableText>
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        ) : (
          <div className={`grid ${gridClass} gap-6`}>
            {block.services.map((service, i) => {
              const Icon = getIcon(service.icon);
              return (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className={cn("group p-6 h-full", t.card, t.cardHover)}>
                    <div className={cn("w-10 h-10 flex items-center justify-center mb-4", t.iconBox)}>
                      <Icon size={20} className="opacity-80 group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      <EditableText field={`services.${i}.title`}>{service.title}</EditableText>
                    </h3>
                    <p className="text-sm opacity-60 leading-relaxed">
                      <EditableText field={`services.${i}.description`} multiline>{service.description}</EditableText>
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
