export const CREDIT_PACKS = [
  {
    id: "starter",
    name: "Starter",
    credits: 3,
    price: 19,
  },
  {
    id: "builder",
    name: "Builder",
    credits: 10,
    price: 49,
  },
  {
    id: "pro",
    name: "Pro",
    credits: 25,
    price: 99,
  },
] as const;

export type CreditPackId = (typeof CREDIT_PACKS)[number]["id"];
