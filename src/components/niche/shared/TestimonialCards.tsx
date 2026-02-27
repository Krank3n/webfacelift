"use client";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  rating?: number;
  avatar?: string;
}

interface TestimonialCardsProps {
  testimonials: Testimonial[];
  accentColor?: string;
}

function StarRating({
  rating,
  color,
}: {
  rating: number;
  color: string;
}) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className="w-4 h-4"
          fill={star <= rating ? color : "none"}
          stroke={color}
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCards({
  testimonials,
  accentColor = "#6366f1",
}: TestimonialCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((t, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-colors"
        >
          {t.rating && <StarRating rating={t.rating} color={accentColor} />}
          <p className="mt-4 text-sm leading-relaxed opacity-80 italic">
            &ldquo;{t.quote}&rdquo;
          </p>
          <div className="mt-5 flex items-center gap-3">
            {t.avatar ? (
              <img
                src={t.avatar}
                alt={t.author}
                className="w-9 h-9 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                {t.author.charAt(0)}
              </div>
            )}
            <div>
              <div className="text-sm font-semibold">{t.author}</div>
              {t.role && (
                <div className="text-xs opacity-50">{t.role}</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
