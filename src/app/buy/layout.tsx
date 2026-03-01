import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Credits",
  description: "Purchase credits to reconstruct websites with AI. Plans starting at $9 for 3 reconstructions.",
};

export default function BuyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
