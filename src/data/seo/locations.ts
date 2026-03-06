import { Location } from "./types";

export const locations: Location[] = [
  // Capitals
  { slug: "sydney", name: "Sydney", state: "New South Wales", stateShort: "NSW", population: "5.3M", isCapital: true },
  { slug: "melbourne", name: "Melbourne", state: "Victoria", stateShort: "VIC", population: "5.1M", isCapital: true },
  { slug: "brisbane", name: "Brisbane", state: "Queensland", stateShort: "QLD", population: "2.6M", isCapital: true },
  { slug: "perth", name: "Perth", state: "Western Australia", stateShort: "WA", population: "2.2M", isCapital: true },
  { slug: "adelaide", name: "Adelaide", state: "South Australia", stateShort: "SA", population: "1.4M", isCapital: true },
  { slug: "hobart", name: "Hobart", state: "Tasmania", stateShort: "TAS", population: "250K", isCapital: true },
  { slug: "darwin", name: "Darwin", state: "Northern Territory", stateShort: "NT", population: "150K", isCapital: true },
  { slug: "canberra", name: "Canberra", state: "Australian Capital Territory", stateShort: "ACT", population: "470K", isCapital: true },

  // Regional QLD
  { slug: "gold-coast", name: "Gold Coast", state: "Queensland", stateShort: "QLD", population: "700K", isCapital: false },
  { slug: "sunshine-coast", name: "Sunshine Coast", state: "Queensland", stateShort: "QLD", population: "350K", isCapital: false },
  { slug: "townsville", name: "Townsville", state: "Queensland", stateShort: "QLD", population: "195K", isCapital: false },
  { slug: "cairns", name: "Cairns", state: "Queensland", stateShort: "QLD", population: "160K", isCapital: false },
  { slug: "toowoomba", name: "Toowoomba", state: "Queensland", stateShort: "QLD", population: "170K", isCapital: false },
  { slug: "rockhampton", name: "Rockhampton", state: "Queensland", stateShort: "QLD", population: "85K", isCapital: false },
  { slug: "mackay", name: "Mackay", state: "Queensland", stateShort: "QLD", population: "85K", isCapital: false },
  { slug: "bundaberg", name: "Bundaberg", state: "Queensland", stateShort: "QLD", population: "75K", isCapital: false },
  { slug: "ipswich", name: "Ipswich", state: "Queensland", stateShort: "QLD", population: "230K", isCapital: false },
  { slug: "logan", name: "Logan", state: "Queensland", stateShort: "QLD", population: "340K", isCapital: false },

  // Regional NSW
  { slug: "newcastle", name: "Newcastle", state: "New South Wales", stateShort: "NSW", population: "325K", isCapital: false },
  { slug: "wollongong", name: "Wollongong", state: "New South Wales", stateShort: "NSW", population: "310K", isCapital: false },
  { slug: "central-coast", name: "Central Coast", state: "New South Wales", stateShort: "NSW", population: "340K", isCapital: false },
  { slug: "penrith", name: "Penrith", state: "New South Wales", stateShort: "NSW", population: "220K", isCapital: false },
  { slug: "parramatta", name: "Parramatta", state: "New South Wales", stateShort: "NSW", population: "260K", isCapital: false },
  { slug: "blacktown", name: "Blacktown", state: "New South Wales", stateShort: "NSW", population: "400K", isCapital: false },
  { slug: "cronulla", name: "Cronulla", state: "New South Wales", stateShort: "NSW", population: "45K", isCapital: false },
  { slug: "northern-beaches", name: "Northern Beaches", state: "New South Wales", stateShort: "NSW", population: "270K", isCapital: false },

  // Regional VIC
  { slug: "geelong", name: "Geelong", state: "Victoria", stateShort: "VIC", population: "270K", isCapital: false },
  { slug: "ballarat", name: "Ballarat", state: "Victoria", stateShort: "VIC", population: "115K", isCapital: false },
  { slug: "bendigo", name: "Bendigo", state: "Victoria", stateShort: "VIC", population: "100K", isCapital: false },
  { slug: "frankston", name: "Frankston", state: "Victoria", stateShort: "VIC", population: "140K", isCapital: false },

  // Regional TAS
  { slug: "launceston", name: "Launceston", state: "Tasmania", stateShort: "TAS", population: "90K", isCapital: false },

  // Regional NSW/VIC border
  { slug: "albury-wodonga", name: "Albury-Wodonga", state: "New South Wales / Victoria", stateShort: "NSW/VIC", population: "95K", isCapital: false },

  // Regional WA
  { slug: "mandurah", name: "Mandurah", state: "Western Australia", stateShort: "WA", population: "100K", isCapital: false },
];

export function getLocation(slug: string): Location | undefined {
  return locations.find((l) => l.slug === slug);
}
