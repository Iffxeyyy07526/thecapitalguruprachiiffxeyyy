import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/layout/ErrorBoundary";
import { ConsentGate } from "@/components/layout/ConsentGate";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { PageLoader } from "@/components/layout/PageLoader";
import { RootJsonLdScripts } from "@/components/seo/RootJsonLdScripts";
import { validateEnv } from "@/lib/env";
import { META_DESC_ROOT } from "@/lib/seo/descriptions";
import { SITE_URL } from "@/lib/seo/site";
import { SOCIAL_INSTAGRAM_URL, SOCIAL_TELEGRAM_URL } from "@/lib/social";

function siteVerificationMetadata(): Metadata["verification"] | undefined {
  const google = process.env.GOOGLE_SITE_VERIFICATION?.trim();
  const yandex = process.env.YANDEX_SITE_VERIFICATION?.trim();
  const out: NonNullable<Metadata["verification"]> = {};
  if (google && google.length >= 8) out.google = google;
  if (yandex && yandex.length >= 8) out.yandex = yandex;
  return Object.keys(out).length ? out : undefined;
}

validateEnv();

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-label",
  display: "swap",
  preload: true,
});

const rootKeywords = [
  "stock market signals India",
  "telegram trading signals India",
  "NSE intraday calls",
  "option trading signals India",
  "best trading signals telegram India",
  "SEBI registered signal provider India",
  "NSE BSE signals",
  "intraday trading signals Mumbai",
  "stock signals Mumbai",
  "NSE calls Delhi",
  "stock signals Bangalore",
  "equity signals India",
  "F&O signals India",
  "bank nifty signals telegram",
  "nifty option tips India",
  "swing trading signals India",
  "positional calls NSE",
  "Indian stock market telegram channel",
  "premium trading signals India",
  "live market signals India",
  "share market tips India",
  "capital guru signals",
  "trading alerts India",
];

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0F0F0F" },
  ],
};

const verificationMeta = siteVerificationMetadata();

export const metadata: Metadata = {
  applicationName: "The Capital Guru",
  title: {
    default: "The Capital Guru — #1 NSE/BSE Stock Market Signals India",
    template: "%s | The Capital Guru",
  },
  description: META_DESC_ROOT,
  keywords: rootKeywords,
  authors: [{ name: "The Capital Guru Team", url: SITE_URL }],
  creator: "The Capital Guru",
  publisher: "The Capital Guru",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "The Capital Guru",
    title:
      "10,000+ Traders | 87% Win Rate — NSE/BSE Signals on Telegram | The Capital Guru",
    description: META_DESC_ROOT,
    emails: ["support@thecapitalguru.net"],
    images: [
      {
        url: "/hero-fallback.png",
        width: 1376,
        height: 768,
        alt: "Stock market signals dashboard with live NSE BSE trading data — The Capital Guru",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@thecapitalguru",
    title: "Capital Guru | 10k+ Traders, 87% Win | NSE/BSE Telegram Signals",
    description:
      "India's top Telegram signals for NSE/BSE. 500+ calls/mo. Join 10,000+ traders—start free today before seats close.",
    images: ["/hero-fallback.png"],
  },
  other: {
    "telegram:channel": SOCIAL_TELEGRAM_URL,
    "instagram:profile": SOCIAL_INSTAGRAM_URL,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  ...(verificationMeta ? { verification: verificationMeta } : {}),
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "1024x1024" }],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  category: "finance",
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${spaceGrotesk.variable} ${manrope.variable}`}
    >
      <body className="font-body antialiased bg-background text-on-surface">
        <ConsentGate>
          <RootJsonLdScripts />
          <ErrorBoundary>
            <PageLoader />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#1a1a1a",
                  color: "#e2e2e2",
                  border: "1px solid #2a2a2a",
                  borderRadius: "12px",
                  fontFamily: "var(--font-body)",
                },
                success: {
                  iconTheme: { primary: "#5DD62C", secondary: "#000000" },
                },
                error: {
                  iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
                },
              }}
            />
            <SiteChrome>{children}</SiteChrome>
          </ErrorBoundary>
        </ConsentGate>
      </body>
    </html>
  );
}
