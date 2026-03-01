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
    default: "webfacelift — More than a facelift. We reconstruct the bones.",
    template: "%s — webfacelift",
  },
  description:
    "Transform outdated business websites into modern, stunning designs using AI. Paste a URL, get a complete redesign in seconds.",
  keywords: [
    "website redesign",
    "AI website builder",
    "website reconstruction",
    "modern web design",
    "AI design tool",
    "website makeover",
  ],
  authors: [{ name: "webfacelift" }],
  creator: "webfacelift",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "webfacelift",
    title: "webfacelift — More than a facelift. We reconstruct the bones.",
    description:
      "Transform outdated business websites into modern, stunning designs using AI. Paste a URL, get a complete redesign in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "webfacelift — More than a facelift. We reconstruct the bones.",
    description:
      "Transform outdated business websites into modern, stunning designs using AI. Paste a URL, get a complete redesign in seconds.",
  },
  robots: {
    index: true,
    follow: true,
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
      "AI-powered website reconstruction tool. Paste any outdated website URL and get a modern redesign blueprint in seconds.",
    url: BASE_URL,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
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
