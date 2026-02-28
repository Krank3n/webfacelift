export const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Starter",
    credits: 3,
    price: 9,
  },
  {
    id: "builder",
    name: "Builder",
    credits: 10,
    price: 25,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 25,
    price: 49,
  },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];
