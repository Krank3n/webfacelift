import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://webfacelift.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "webfacelift — AI Website Refurbishment & Redesign Tool",
    template: "%s — webfacelift",
  },
  description:
    "Refurbish and reconstruct outdated business websites into modern, stunning designs using AI. Paste any URL and get a complete site refurbishment in seconds — no coding required.",
  keywords: [
    "website refurbishment",
    "site refurbishment",
    "website redesign",
    "website reconstruction",
    "AI website builder",
    "website makeover",
    "modernize website",
    "website refresh",
    "website renovation",
    "revamp website",
    "outdated website fix",
    "AI design tool",
    "modern web design",
    "website rebuild",
    "small business website redesign",
  ],
  authors: [{ name: "webfacelift" }],
  creator: "webfacelift",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "webfacelift",
    title: "webfacelift — AI Website Refurbishment & Redesign Tool",
    description:
      "Refurbish and reconstruct outdated business websites into modern, stunning designs using AI. Paste any URL and get a complete site refurbishment in seconds.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "webfacelift — AI-powered website refurbishment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "webfacelift — AI Website Refurbishment & Redesign Tool",
    description:
      "Refurbish and reconstruct outdated business websites into modern, stunning designs using AI. Paste any URL and get a complete site refurbishment in seconds.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "webfacelift",
    description:
      "AI-powered website refurbishment and reconstruction tool. Paste any outdated website URL and get a modern redesign in seconds. The fastest way to refurbish a business website.",
    url: BASE_URL,
    image: `${BASE_URL}/images/og-image.png`,
    logo: `${BASE_URL}/images/webfacelift-logo-compressed.png`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    keywords: "website refurbishment, site refurbishment, website redesign, website reconstruction, AI website builder, modernize website",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "9",
      highPrice: "49",
      offerCount: "3",
    },
  };

  return (
    <html lang="en" className={`dark ${inter.variable} ${inter.className}`}>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-9CDYBR0C1C"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9CDYBR0C1C');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
