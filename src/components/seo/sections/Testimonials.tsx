import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "I used to spend 2 weeks mocking up redesigns for pitches. Now I paste the URL, get a redesign in 5 minutes, and iterate from there. It changed how I win clients.",
    name: "Sarah M.",
    role: "Freelance Web Designer",
  },
  {
    quote: "Our agency handles 10+ small business clients. webfacelift lets us show them what their site could look like before we even scope the project. Close rate went through the roof.",
    name: "James K.",
    role: "Agency Owner",
  },
  {
    quote: "The chat-based editing is genius. I told it to add a pricing section and change the colours to match my brand — done in seconds. No Figma, no back-and-forth.",
    name: "Linda R.",
    role: "Marketing Consultant",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
        Trusted by agencies and freelancers
      </h2>
      <p className="text-center text-white/40 mb-14 max-w-xl mx-auto">
        See why designers and developers choose webfacelift to modernise their clients&apos; web presence.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col">
            <Quote size={20} className="text-indigo-400/40 mb-4" />
            <p className="text-sm text-white/60 leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-5 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.name}</div>
                  <div className="text-xs text-white/40">{t.role}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
