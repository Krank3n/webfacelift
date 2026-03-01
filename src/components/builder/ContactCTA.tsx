"use client";

import type { ContactCTABlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Send, Phone, Mail, MapPin, Clock } from "lucide-react";
import EditableText from "./EditableText";

/* ── Contact info items ──────────────────────────── */

function ContactInfoItems({
  block,
  template,
}: {
  block: ContactCTABlock;
  template: TemplateStyle;
}) {
  const t = getTemplateStyles(template);
  const items: { icon: React.ReactNode; label: string; value: string; href?: string }[] = [];

  if (block.phone)
    items.push({
      icon: <Phone size={18} />,
      label: "Phone",
      value: block.phone,
      href: `tel:${block.phone.replace(/\s/g, "")}`,
    });
  if (block.email)
    items.push({
      icon: <Mail size={18} />,
      label: "Email",
      value: block.email,
      href: `mailto:${block.email}`,
    });
  if (block.address)
    items.push({
      icon: <MapPin size={18} />,
      label: "Address",
      value: block.address,
    });
  if (block.hours)
    items.push({
      icon: <Clock size={18} />,
      label: "Hours",
      value: block.hours,
    });

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const inner = (
          <>
            <div
              className={cn(
                "w-11 h-11 flex items-center justify-center shrink-0 text-[--brand-primary]",
                t.iconBox
              )}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-wider opacity-40 mb-0.5">
                {item.label}
              </div>
              <div className="font-semibold text-sm leading-snug break-words">
                {item.value}
              </div>
            </div>
          </>
        );
        return item.href ? (
          <a
            key={item.label}
            href={item.href}
            className="flex items-center gap-3.5 group hover:opacity-80 transition-opacity"
          >
            {inner}
          </a>
        ) : (
          <div key={item.label} className="flex items-center gap-3.5">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/* ── Contact form ────────────────────────────────── */

function ContactForm({
  block,
  template,
}: {
  block: ContactCTABlock;
  template: TemplateStyle;
}) {
  const t = getTemplateStyles(template);
  const fields = block.fields || ["Name", "Email", "Phone", "Message"];

  // Pair up short fields (not message/description) for 2-col layout
  const shortFields = fields.filter(
    (f) => !["message", "description", "comments", "details"].includes(f.toLowerCase())
  );
  const longFields = fields.filter((f) =>
    ["message", "description", "comments", "details"].includes(f.toLowerCase())
  );

  return (
    <form
      className="space-y-4 text-left"
      onSubmit={(e) => e.preventDefault()}
    >
      {/* Short fields in a 2-col grid */}
      {shortFields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {shortFields.map((field) => (
            <div key={field}>
              <label className="block text-xs font-medium uppercase tracking-wider opacity-50 mb-1.5">
                {field}
              </label>
              <input
                type={
                  field.toLowerCase() === "email"
                    ? "email"
                    : field.toLowerCase() === "phone"
                    ? "tel"
                    : "text"
                }
                className={cn(
                  "w-full px-4 py-3 text-sm text-inherit placeholder:opacity-25",
                  t.input
                )}
                placeholder={field}
              />
            </div>
          ))}
        </div>
      )}

      {/* Long fields (message, etc.) */}
      {longFields.map((field) => (
        <div key={field}>
          <label className="block text-xs font-medium uppercase tracking-wider opacity-50 mb-1.5">
            {field}
          </label>
          <textarea
            className={cn(
              "w-full px-4 py-3 text-sm text-inherit placeholder:opacity-25 resize-none",
              t.input
            )}
            rows={5}
            placeholder={`Your ${field.toLowerCase()}...`}
          />
        </div>
      ))}

      <button
        type="submit"
        className={cn(
          "mt-2 w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 font-semibold text-sm",
          t.buttonPrimary
        )}
      >
        <EditableText field="buttonText">
          {block.buttonText || "Send Message"}
        </EditableText>
        <Send size={16} />
      </button>
    </form>
  );
}

/* ── Variant: Split ──────────────────────────────── */

function SplitVariant({
  block,
  template,
}: {
  block: ContactCTABlock;
  template: TemplateStyle;
}) {
  const t = getTemplateStyles(template);
  const hasContactInfo = block.phone || block.email || block.address || block.hours;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left – Info side */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              <EditableText field="heading">{block.heading}</EditableText>
            </h2>
            {block.subheading && (
              <p className="mt-4 text-base md:text-lg opacity-50 leading-relaxed max-w-md">
                <EditableText field="subheading">
                  {block.subheading}
                </EditableText>
              </p>
            )}
          </div>

          {hasContactInfo && (
            <div className={cn("p-6", t.card)}>
              <ContactInfoItems block={block} template={template} />
            </div>
          )}
        </div>

        {/* Right – Form side */}
        {block.showForm ? (
          <div className={cn("p-6 md:p-8", t.card)}>
            <ContactForm block={block} template={template} />
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <button
              className={cn(
                "inline-flex items-center gap-2.5 px-8 py-4 font-semibold",
                t.buttonPrimary
              )}
            >
              <EditableText field="buttonText">
                {block.buttonText || "Get In Touch"}
              </EditableText>
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Variant: Centered ───────────────────────────── */

function CenteredVariant({
  block,
  template,
}: {
  block: ContactCTABlock;
  template: TemplateStyle;
}) {
  const t = getTemplateStyles(template);
  const hasContactInfo = block.phone || block.email || block.address || block.hours;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
          <EditableText field="heading">{block.heading}</EditableText>
        </h2>
        {block.subheading && (
          <p className="mt-4 text-base md:text-lg opacity-50 max-w-xl mx-auto leading-relaxed">
            <EditableText field="subheading">
              {block.subheading}
            </EditableText>
          </p>
        )}
      </div>

      {block.showForm && (
        <div className={cn("p-6 md:p-8", t.card)}>
          <ContactForm block={block} template={template} />
        </div>
      )}

      {!block.showForm && (
        <div className="flex justify-center">
          <button
            className={cn(
              "inline-flex items-center gap-2.5 px-8 py-4 font-semibold",
              t.buttonPrimary
            )}
          >
            <EditableText field="buttonText">
              {block.buttonText || "Get In Touch"}
            </EditableText>
            <Send size={16} />
          </button>
        </div>
      )}

      {hasContactInfo && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {block.phone && (
            <a
              href={`tel:${block.phone.replace(/\s/g, "")}`}
              className={cn(
                "flex items-center gap-3.5 p-4 hover:opacity-80 transition-opacity",
                t.card
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center shrink-0 text-[--brand-primary]",
                  t.iconBox
                )}
              >
                <Phone size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider opacity-40">
                  Phone
                </div>
                <div className="font-semibold text-sm">{block.phone}</div>
              </div>
            </a>
          )}
          {block.email && (
            <a
              href={`mailto:${block.email}`}
              className={cn(
                "flex items-center gap-3.5 p-4 hover:opacity-80 transition-opacity",
                t.card
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center shrink-0 text-[--brand-primary]",
                  t.iconBox
                )}
              >
                <Mail size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider opacity-40">
                  Email
                </div>
                <div className="font-semibold text-sm">{block.email}</div>
              </div>
            </a>
          )}
          {block.address && (
            <div
              className={cn("flex items-center gap-3.5 p-4", t.card)}
            >
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center shrink-0 text-[--brand-primary]",
                  t.iconBox
                )}
              >
                <MapPin size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider opacity-40">
                  Address
                </div>
                <div className="font-semibold text-sm">{block.address}</div>
              </div>
            </div>
          )}
          {block.hours && (
            <div
              className={cn("flex items-center gap-3.5 p-4", t.card)}
            >
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center shrink-0 text-[--brand-primary]",
                  t.iconBox
                )}
              >
                <Clock size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider opacity-40">
                  Hours
                </div>
                <div className="font-semibold text-sm">{block.hours}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Variant: Minimal ────────────────────────────── */

function MinimalVariant({
  block,
  template,
}: {
  block: ContactCTABlock;
  template: TemplateStyle;
}) {
  const t = getTemplateStyles(template);

  return (
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
        <EditableText field="heading">{block.heading}</EditableText>
      </h2>
      {block.subheading && (
        <p className="mt-4 text-base md:text-lg opacity-50 max-w-2xl mx-auto leading-relaxed">
          <EditableText field="subheading">
            {block.subheading}
          </EditableText>
        </p>
      )}

      {/* Contact info as inline cards */}
      {(block.phone || block.email || block.address || block.hours) && (
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {block.phone && (
            <a
              href={`tel:${block.phone.replace(/\s/g, "")}`}
              className={cn(
                "inline-flex items-center gap-2.5 px-5 py-3 text-sm font-medium hover:opacity-80 transition-opacity",
                t.card
              )}
            >
              <Phone size={15} className="text-[--brand-primary]" />
              {block.phone}
            </a>
          )}
          {block.email && (
            <a
              href={`mailto:${block.email}`}
              className={cn(
                "inline-flex items-center gap-2.5 px-5 py-3 text-sm font-medium hover:opacity-80 transition-opacity",
                t.card
              )}
            >
              <Mail size={15} className="text-[--brand-primary]" />
              {block.email}
            </a>
          )}
          {block.address && (
            <div
              className={cn(
                "inline-flex items-center gap-2.5 px-5 py-3 text-sm font-medium",
                t.card
              )}
            >
              <MapPin size={15} className="text-[--brand-primary]" />
              {block.address}
            </div>
          )}
          {block.hours && (
            <div
              className={cn(
                "inline-flex items-center gap-2.5 px-5 py-3 text-sm font-medium",
                t.card
              )}
            >
              <Clock size={15} className="text-[--brand-primary]" />
              {block.hours}
            </div>
          )}
        </div>
      )}

      <div className="mt-8">
        <button
          className={cn(
            "inline-flex items-center gap-2.5 px-8 py-4 font-semibold",
            t.buttonPrimary
          )}
        >
          <EditableText field="buttonText">
            {block.buttonText || "Get In Touch"}
          </EditableText>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────── */

export default function ContactCTA({
  block,
  template,
}: {
  block: ContactCTABlock;
  template: TemplateStyle;
}) {
  const hasContactInfo = block.phone || block.email || block.address || block.hours;

  // Auto-pick variant: split when there's contact info + form, otherwise centered
  const variant =
    block.variant || (hasContactInfo && block.showForm ? "split" : "centered");

  return (
    <section
      className={cn(
        "w-full px-6 relative overflow-hidden",
        getSectionPadding(block.sectionPadding)
      )}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[--brand-primary]/[0.04] blur-[100px]" />
      </div>

      <div className="relative">
        {variant === "split" && (
          <SplitVariant block={block} template={template} />
        )}
        {variant === "centered" && (
          <CenteredVariant block={block} template={template} />
        )}
        {variant === "minimal" && (
          <MinimalVariant block={block} template={template} />
        )}
      </div>
    </section>
  );
}
