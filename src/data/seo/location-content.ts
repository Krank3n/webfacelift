import { LocationContent } from "./types";

const locationSpecific: Record<string, Partial<LocationContent>> = {
  sydney: {
    headline: "Website Redesign in Sydney",
    subheadline: "Sydney businesses deserve world-class websites. AI-powered redesign for Australia's biggest market.",
    marketStats: [
      { label: "Small Businesses", value: "500K+" },
      { label: "Population", value: "5.3M" },
      { label: "Online Searches/Day", value: "Millions" },
      { label: "Mobile Usage", value: "68%" },
    ],
    localFacts: [
      "Sydney has over 500,000 small businesses competing for local customers online",
      "68% of Sydney consumers research businesses on mobile before visiting",
      "Local SEO is critical — 46% of Google searches have local intent",
      "Sydney's competitive market means first impressions online make or break a business",
    ],
  },
  melbourne: {
    headline: "Website Redesign in Melbourne",
    subheadline: "Melbourne's creative capital deserves creative websites. Modernise your business presence with AI.",
    marketStats: [
      { label: "Small Businesses", value: "450K+" },
      { label: "Population", value: "5.1M" },
      { label: "Digital Adoption", value: "High" },
      { label: "Mobile Usage", value: "67%" },
    ],
    localFacts: [
      "Melbourne is Australia's fastest-growing city with fierce business competition",
      "The city's design-conscious culture means customers expect polished online experiences",
      "Over 70% of Melbourne consumers check a business website before making contact",
      "Local Melbourne businesses that modernise their websites see an average 40% increase in enquiries",
    ],
  },
  brisbane: {
    headline: "Website Redesign in Brisbane",
    subheadline: "Brisbane is booming — make sure your website keeps up. AI-powered redesign for Queensland businesses.",
    marketStats: [
      { label: "Small Businesses", value: "200K+" },
      { label: "Population", value: "2.6M" },
      { label: "Growth Rate", value: "Fast" },
      { label: "Mobile Usage", value: "65%" },
    ],
    localFacts: [
      "Brisbane's population growth is driving demand for local services across all industries",
      "With the 2032 Olympics, Brisbane businesses need world-class digital presence",
      "South East Queensland is one of Australia's fastest-growing corridors",
      "Local businesses with modern websites capture more of Brisbane's growing market",
    ],
  },
  perth: {
    headline: "Website Redesign in Perth",
    subheadline: "Perth businesses are isolated — your website is your shopfront to the world. Make it count.",
    marketStats: [
      { label: "Small Businesses", value: "180K+" },
      { label: "Population", value: "2.2M" },
      { label: "Mining Economy", value: "Strong" },
      { label: "Mobile Usage", value: "64%" },
    ],
    localFacts: [
      "Perth's geographic isolation makes online presence even more critical for local businesses",
      "The resources boom has created a thriving small business ecosystem in Perth",
      "Perth consumers are highly connected — broadband penetration is among Australia's highest",
      "A modern website helps Perth businesses compete nationally despite the tyranny of distance",
    ],
  },
  adelaide: {
    headline: "Website Redesign in Adelaide",
    subheadline: "Adelaide's tight-knit business community thrives on reputation. Your website should reflect your quality.",
    marketStats: [
      { label: "Small Businesses", value: "120K+" },
      { label: "Population", value: "1.4M" },
      { label: "Cost of Living", value: "Affordable" },
      { label: "Mobile Usage", value: "63%" },
    ],
    localFacts: [
      "Adelaide's lower cost of business means higher margins — invest some in your online presence",
      "Word-of-mouth is strong in Adelaide, but it starts with a Google search",
      "South Australia's growing food, wine, and tech sectors need modern digital presence",
      "Adelaide businesses that modernise their websites stand out in a less competitive market",
    ],
  },
  "gold-coast": {
    headline: "Website Redesign on the Gold Coast",
    subheadline: "Tourism, trades, and lifestyle — Gold Coast businesses need websites as vibrant as the coast itself.",
    marketStats: [
      { label: "Small Businesses", value: "60K+" },
      { label: "Population", value: "700K" },
      { label: "Tourism", value: "Major" },
      { label: "Mobile Usage", value: "70%" },
    ],
    localFacts: [
      "Gold Coast's tourism-driven economy means your website is often the first interaction with customers",
      "The construction and trades boom on the Gold Coast creates intense competition for online visibility",
      "Gold Coast residents and tourists alike rely heavily on mobile search to find local businesses",
      "A modern website is essential for Gold Coast businesses competing for tourist and local dollars",
    ],
  },
};

export function getLocationContent(slug: string): LocationContent {
  const specific = locationSpecific[slug] || {};
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    slug,
    headline: specific.headline || `Website Redesign in ${name}`,
    subheadline: specific.subheadline || `Local ${name} businesses deserve modern websites. AI-powered redesign that helps you stand out in your market.`,
    marketStats: specific.marketStats || [
      { label: "Local Businesses", value: "Thousands" },
      { label: "Mobile Searches", value: "Growing" },
      { label: "Online Competition", value: "Increasing" },
      { label: "Digital Adoption", value: "High" },
    ],
    localFacts: specific.localFacts || [
      `${name} businesses need modern websites to compete in an increasingly digital market`,
      `Local customers in ${name} research businesses online before making contact`,
      `A professional website is your 24/7 shopfront for ${name} customers`,
      `Stand out from competitors in ${name} with a modern, mobile-friendly website`,
    ],
  };
}
