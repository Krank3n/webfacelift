"use client";

import type { ContactCTABlock, TemplateStyle } from "@/types/blueprint";
import { getTemplateStyles, getSectionPadding } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";
import EditableText from "./EditableText";

export default function ContactCTA({ block, template }: { block: ContactCTABlock; template: TemplateStyle }) {
  const t = getTemplateStyles(template);
  const fields = block.fields || ["Name", "Email", "Message"];

  return (
    <section
      className={cn("w-full px-6", getSectionPadding(block.sectionPadding))}
      style={{ backgroundColor: block.bgColor || "transparent" }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          <EditableText field="heading">{block.heading}</EditableText>
        </h2>
        {block.subheading && (
          <p className="mt-4 text-lg opacity-60">
            <EditableText field="subheading">{block.subheading}</EditableText>
          </p>
        )}

        {block.showForm ? (
          <div className={cn("mt-10 p-8", t.card)}>
            <form
              className="space-y-4 text-left"
              onSubmit={(e) => e.preventDefault()}
            >
              {fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm opacity-60 mb-1.5">
                    {field}
                  </label>
                  {field.toLowerCase() === "message" ? (
                    <textarea
                      className={cn(
                        "w-full px-4 py-3 text-inherit placeholder:opacity-30 resize-none",
                        t.input
                      )}
                      rows={4}
                      placeholder={`Your ${field.toLowerCase()}`}
                    />
                  ) : (
                    <input
                      type={field.toLowerCase() === "email" ? "email" : "text"}
                      className={cn(
                        "w-full px-4 py-3 text-inherit placeholder:opacity-30",
                        t.input
                      )}
                      placeholder={`Your ${field.toLowerCase()}`}
                    />
                  )}
                </div>
              ))}
              <button
                type="submit"
                className={cn(
                  "mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-sm",
                  t.buttonPrimary
                )}
              >
                <EditableText field="buttonText">{block.buttonText || "Send Message"}</EditableText>
                <Send size={16} />
              </button>
            </form>
          </div>
        ) : (
          <button
            className={cn(
              "mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold text-sm",
              t.buttonPrimary
            )}
          >
            <EditableText field="buttonText">{block.buttonText || "Get In Touch"}</EditableText>
            <Send size={16} />
          </button>
        )}
      </div>
    </section>
  );
}
