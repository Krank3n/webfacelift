"use client";

import { useState, useMemo } from "react";
import type { NicheBusinessData, ListsCustom } from "@/types/niche";
import { useInView } from "../hooks/useInView";
import { useCountUp } from "../hooks/useCountUp";
import EditableText from "@/components/builder/EditableText";

/* ------------------------------------------------------------------ */
/*  Star Rating                                                        */
/* ------------------------------------------------------------------ */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat counter                                                       */
/* ------------------------------------------------------------------ */
function StatCounter({
  label,
  value,
  primary,
}: {
  label: string;
  value: string;
  primary: string;
}) {
  const { ref, isInView } = useInView(0.3);
  const numericMatch = value.match(/^([\d,]+)/);
  const numericValue = numericMatch
    ? parseInt(numericMatch[1].replace(/,/g, ""), 10)
    : 0;
  const suffix = numericMatch ? value.slice(numericMatch[0].length) : value;
  const count = useCountUp(numericValue, 2000, isInView);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-bold" style={{ color: primary }}>
        {numericValue > 0 ? `${count.toLocaleString()}${suffix}` : value}
      </div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FadeIn wrapper                                                     */
/* ------------------------------------------------------------------ */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Category icon (simple emoji/letter fallback)                       */
/* ------------------------------------------------------------------ */
function CategoryIcon({
  icon,
  name,
  primary,
}: {
  icon?: string;
  name: string;
  primary: string;
}) {
  return (
    <div
      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
      style={{ backgroundColor: primary }}
    >
      {icon ? icon.charAt(0).toUpperCase() : name.charAt(0).toUpperCase()}
    </div>
  );
}

/* ================================================================== */
/*  MAIN TEMPLATE                                                      */
/* ================================================================== */
export default function ListsTemplate({ data }: { data: NicheBusinessData }) {
  const custom = (data.custom ?? {}) as ListsCustom;
  const categories = custom.categories ?? [];
  const allItems = custom.items ?? [];
  const primary = data.colorScheme?.primary ?? "#3b82f6";
  const primaryLight = `${primary}0d`; // ~5% opacity

  /* Client state */
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "az" | "rating">("default");

  /* Filtered + sorted items */
  const filteredItems = useMemo(() => {
    let items = allItems;

    if (activeCategory) {
      items = items.filter((i) => i.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (sortBy === "az") {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "rating") {
      items = [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else {
      // default: featured first
      items = [...items].sort(
        (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      );
    }

    return items;
  }, [allItems, activeCategory, searchQuery, sortBy]);

  const displayedItems = showAll ? filteredItems : filteredItems.slice(0, 12);
  const hasMore = filteredItems.length > 12 && !showAll;

  /* ---------------------------------------------------------------- */
  /*  1. NAVBAR                                                        */
  /* ---------------------------------------------------------------- */
  const navbar = (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {data.logo && (
            <img
              src={data.logo}
              alt={data.businessName}
              className="h-8 w-8 object-contain rounded"
            />
          )}
          <span className="font-bold text-gray-900 text-lg">
            <EditableText field="businessName">{data.businessName}</EditableText>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {data.navLinks?.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {custom.submitUrl && (
            <a
              href={custom.submitUrl}
              className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: primary }}
            >
              Submit Listing
            </a>
          )}
        </div>
      </div>
    </nav>
  );

  /* ---------------------------------------------------------------- */
  /*  2. HERO / SEARCH                                                 */
  /* ---------------------------------------------------------------- */
  const hero = (
    <section
      className="py-16 md:py-24"
      style={{ background: `linear-gradient(135deg, ${primaryLight}, white)` }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          {custom.totalCount && (
            <span
              className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-4"
              style={{
                color: primary,
                backgroundColor: `${primary}15`,
              }}
            >
              {custom.totalCount}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <EditableText field="tagline">{data.tagline || data.businessName}</EditableText>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            <EditableText field="description" multiline>{data.description}</EditableText>
          </p>
        </FadeIn>

        {/* Search bar */}
        <FadeIn delay={150}>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder={
                  custom.searchPlaceholder ?? "Search listings..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                style={
                  {
                    "--tw-ring-color": `${primary}40`,
                  } as React.CSSProperties
                }
              />
            </div>
            {categories.length > 0 && (
              <select
                value={activeCategory ?? ""}
                onChange={(e) =>
                  setActiveCategory(e.target.value || null)
                }
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={
                  {
                    "--tw-ring-color": `${primary}40`,
                  } as React.CSSProperties
                }
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                    {cat.count != null ? ` (${cat.count})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </FadeIn>

        {/* Stats row */}
        <FadeIn delay={300}>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            {custom.totalCount && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {custom.totalCount}
              </span>
            )}
            {categories.length > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {categories.length} Categories
              </span>
            )}
            {custom.lastUpdated && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {custom.lastUpdated}
              </span>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );

  /* ---------------------------------------------------------------- */
  /*  3. CATEGORY GRID                                                 */
  /* ---------------------------------------------------------------- */
  const categoryGrid = categories.length > 0 && (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Browse by Category
          </h2>
        </FadeIn>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <FadeIn key={cat.slug} delay={i * 60}>
              <button
                onClick={() =>
                  setActiveCategory(
                    activeCategory === cat.slug ? null : cat.slug
                  )
                }
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${
                  activeCategory === cat.slug
                    ? "border-transparent shadow-md ring-2"
                    : "border-gray-100 hover:border-gray-200"
                }`}
                style={
                  activeCategory === cat.slug
                    ? {
                        borderColor: primary,
                        backgroundColor: `${primary}08`,
                        outline: `2px solid ${primary}`,
                        outlineOffset: "-2px",
                      }
                    : undefined
                }
              >
                <div className="flex items-start gap-3">
                  <CategoryIcon
                    icon={cat.icon}
                    name={cat.name}
                    primary={
                      activeCategory === cat.slug ? primary : "#6b7280"
                    }
                  />
                  <div className="min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">
                      {cat.name}
                    </div>
                    {cat.count != null && (
                      <div className="text-xs text-gray-500 mt-0.5">
                        {cat.count} listings
                      </div>
                    )}
                    {cat.description && (
                      <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {cat.description}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );

  /* ---------------------------------------------------------------- */
  /*  4. FEATURED / SPONSORED STRIP                                    */
  /* ---------------------------------------------------------------- */
  const sponsoredStrip = custom.sponsoredItems &&
    custom.sponsoredItems.length > 0 && (
      <section className="py-8 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-4 h-4 text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-700">Featured</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory">
            {custom.sponsoredItems.map((item, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 snap-start bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                        style={{ backgroundColor: primary }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.description}
                  </p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium mt-2 inline-block hover:underline"
                      style={{ color: primary }}
                    >
                      Visit &rarr;
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );

  /* ---------------------------------------------------------------- */
  /*  5. MAIN LISTING GRID                                             */
  /* ---------------------------------------------------------------- */
  const listingGrid = (
    <section className="py-12 bg-white" id="listings">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory
                ? categories.find((c) => c.slug === activeCategory)?.name ??
                  "Listings"
                : "All Listings"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredItems.length} result
              {filteredItems.length !== 1 ? "s" : ""}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "default" | "az" | "rating")
              }
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:border-transparent"
              style={
                {
                  "--tw-ring-color": `${primary}40`,
                } as React.CSSProperties
              }
            >
              <option value="default">Featured First</option>
              <option value="az">A &ndash; Z</option>
              <option value="rating">Top Rated</option>
            </select>
            {activeCategory && (
              <button
                onClick={() => setActiveCategory(null)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="font-medium">No listings found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedItems.map((item, i) => (
              <FadeIn key={`${item.name}-${i}`} delay={Math.min(i * 50, 300)}>
                <div className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                  {/* Image */}
                  {item.image ? (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {item.featured && (
                        <span
                          className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                          style={{ backgroundColor: primary }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className="h-24 flex items-center justify-center"
                      style={{ backgroundColor: `${primary}08` }}
                    >
                      <span
                        className="text-3xl font-bold opacity-20"
                        style={{ color: primary }}
                      >
                        {item.name.charAt(0)}
                      </span>
                      {item.featured && (
                        <span
                          className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-medium text-white"
                          style={{ backgroundColor: primary }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:underline">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.name}
                          </a>
                        ) : (
                          item.name
                        )}
                      </h3>
                      {item.rating != null && (
                        <StarRating rating={item.rating} />
                      )}
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {item.description}
                    </p>

                    {/* Category badge */}
                    {item.category && (
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 mb-2 w-fit">
                        {categories.find((c) => c.slug === item.category)
                          ?.name ?? item.category}
                      </span>
                    )}

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-500"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 4 && (
                          <span className="text-[10px] text-gray-400">
                            +{item.tags.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Meta key-values */}
                    {item.meta && Object.keys(item.meta).length > 0 && (
                      <div className="mt-auto pt-3 border-t border-gray-50 space-y-1">
                        {Object.entries(item.meta)
                          .slice(0, 3)
                          .map(([key, val]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between text-[11px]"
                            >
                              <span className="text-gray-400">{key}</span>
                              <span className="text-gray-600 font-medium">
                                {val}
                              </span>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* External link */}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-xs font-medium hover:underline"
                        style={{ color: primary }}
                      >
                        Visit
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Show more */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Show all {filteredItems.length} listings
            </button>
          </div>
        )}
      </div>
    </section>
  );

  /* ---------------------------------------------------------------- */
  /*  6. STATS / TRUST                                                 */
  /* ---------------------------------------------------------------- */
  const statsSection = data.stats && data.stats.length > 0 && (
    <section className="py-14 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid gap-8 ${
            data.stats.length <= 3
              ? `grid-cols-${data.stats.length}`
              : "grid-cols-2 md:grid-cols-4"
          }`}
        >
          {data.stats.map((stat) => (
            <StatCounter
              key={stat.label}
              label={stat.label}
              value={stat.value}
              primary={primary}
            />
          ))}
        </div>
      </div>
    </section>
  );

  /* ---------------------------------------------------------------- */
  /*  7. HOW IT WORKS                                                  */
  /* ---------------------------------------------------------------- */
  const howItWorks = (
    <section className="py-14 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-2xl font-bold text-gray-900 mb-10">
            How It Works
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Browse",
              desc: "Explore our curated collection of listings organized by category.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              ),
            },
            {
              step: "2",
              title: "Choose",
              desc: "Find the perfect match using filters, ratings, and detailed info.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
            },
            {
              step: "3",
              title: "Connect",
              desc: "Visit the listing directly and get started right away.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              ),
            },
          ].map((s, i) => (
            <FadeIn key={s.step} delay={i * 120}>
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${primary}10` }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke={primary}
                    viewBox="0 0 24 24"
                  >
                    {s.icon}
                  </svg>
                </div>
                <div
                  className="text-xs font-bold uppercase tracking-wider mb-1"
                  style={{ color: primary }}
                >
                  Step {s.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );

  /* ---------------------------------------------------------------- */
  /*  8. TESTIMONIALS                                                  */
  /* ---------------------------------------------------------------- */
  const testimonials = data.testimonials && data.testimonials.length > 0 && (
    <section className="py-14 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What People Say
          </h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {data.testimonials.map((t, i) => (
            <FadeIn key={i} delay={i * 80}>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
                {t.rating != null && (
                  <div className="mb-3">
                    <StarRating rating={t.rating} />
                  </div>
                )}
                <blockquote className="text-sm text-gray-600 italic flex-1">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-4 flex items-center gap-3">
                  {t.avatar ? (
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: primary }}
                    >
                      {t.author.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {t.author}
                    </div>
                    {t.role && (
                      <div className="text-xs text-gray-400">{t.role}</div>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );

  /* ---------------------------------------------------------------- */
  /*  9. SUBMIT CTA                                                    */
  /* ---------------------------------------------------------------- */
  const submitCta = custom.submitUrl && (
    <section className="py-14" style={{ backgroundColor: primary }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {data.cta?.heading ?? "Want to be listed?"}
          </h2>
          <p className="text-white/80 mb-6 text-sm md:text-base">
            {data.cta?.description ??
              "Submit your listing and reach thousands of visitors looking for exactly what you offer."}
          </p>
          <a
            href={custom.submitUrl}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ color: primary }}
          >
            {data.cta?.buttonText ?? "Submit a Listing"}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>
        </FadeIn>
      </div>
    </section>
  );

  /* ---------------------------------------------------------------- */
  /*  10. FOOTER                                                       */
  /* ---------------------------------------------------------------- */
  const footer = (
    <footer className="py-12 bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {data.logo && (
                <img
                  src={data.logo}
                  alt={data.businessName}
                  className="h-7 w-7 object-contain rounded"
                />
              )}
              <span className="font-bold text-white text-sm">
                <EditableText field="businessName">{data.businessName}</EditableText>
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              {data.description?.slice(0, 120)}
              {(data.description?.length ?? 0) > 120 ? "..." : ""}
            </p>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">
                Categories
              </h4>
              <ul className="space-y-1.5">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => {
                        setActiveCategory(cat.slug);
                        document
                          .getElementById("listings")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="text-xs hover:text-white transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Links */}
          {data.navLinks && data.navLinks.length > 0 && (
            <div>
              <h4 className="font-semibold text-white text-sm mb-3">Links</h4>
              <ul className="space-y-1.5">
                {data.navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-xs hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Contact</h4>
            <ul className="space-y-1.5 text-xs">
              {data.email && (
                <li>
                  <a
                    href={`mailto:${data.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {data.email}
                  </a>
                </li>
              )}
              {data.phone && (
                <li>
                  <a
                    href={`tel:${data.phone}`}
                    className="hover:text-white transition-colors"
                  >
                    {data.phone}
                  </a>
                </li>
              )}
              {data.address && <li>{data.address}</li>}
            </ul>

            {/* Social links */}
            {data.socialLinks && data.socialLinks.length > 0 && (
              <div className="flex gap-3 mt-3">
                {data.socialLinks.map((sl) => (
                  <a
                    key={sl.url}
                    href={sl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors text-xs"
                  >
                    {sl.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-600">
          &copy; {new Date().getFullYear()} {data.businessName}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans antialiased">
      {navbar}
      {hero}
      {categoryGrid}
      {sponsoredStrip}
      {listingGrid}
      {statsSection}
      {howItWorks}
      {testimonials}
      {submitCta}
      {footer}
    </div>
  );
}
