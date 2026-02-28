import Stripe from "stripe";
import { CREDIT_PACKS as PACKS } from "./credit-packs";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICE_IDS: Record<string, string> = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  builder: process.env.STRIPE_PRICE_BUILDER!,
  pro: process.env.STRIPE_PRICE_PRO!,
};

export const CREDIT_PACKS = PACKS.map((pack) => ({
  ...pack,
  priceId: PRICE_IDS[pack.id],
}));

export type { CreditPackId } from "./credit-packs";
