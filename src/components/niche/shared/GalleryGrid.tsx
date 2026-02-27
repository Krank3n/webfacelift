"use client";

interface GalleryGridProps {
  images: { url: string; alt?: string }[];
  columns?: 2 | 3 | 4;
  accentColor?: string;
}

export default function GalleryGrid({
  images,
  columns = 3,
  accentColor,
}: GalleryGridProps) {
  const gridCols = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {images.map((img, i) => (
        <div
          key={i}
          className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
        >
          <img
            src={img.url}
            alt={img.alt || "Gallery image"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: accentColor
                ? `linear-gradient(to top, ${accentColor}40, transparent)`
                : "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
            }}
          />
          {img.alt && (
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
              {img.alt}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
