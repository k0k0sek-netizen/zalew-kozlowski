import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/features/CookieConsent";
import Script from "next/script";
import { JsonLd } from "@/components/layout/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import DraftModeBanner from "@/components/features/DraftModeBanner";
import { getWeatherAction } from "@/app/actions/weather";
import { getInfoBlocks } from "@/lib/contentful";
import { getGlowColorForScore } from "@/lib/bite-index-theme";
import { cookies, draftMode } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zalew-kozlowski.pl"),
  title: {
    default: "Zalew Kozłowski | Prywatne Łowisko i Wypoczynek",
    template: "%s | Zalew Kozłowski"
  },
  description: "Odkryj spokój nad Zalewem Kozłowskim. Prywatne łowisko No Kill, piękne karpie, amury i drapieżniki. Idealne miejsce na wędkowanie i wypoczynek blisko Dębicy.",
  keywords: ["łowisko", "wędkarstwo", "karpie", "no kill", "dębica", "zalew kozłowski", "wypoczynek"],
  authors: [{ name: "Zalew Kozłowski" }],
  creator: "WektorKodu.pl",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://zalew-kozlowski.pl",
    title: "Zalew Kozłowski | Natura i Wędkarstwo",
    description: "Zapraszamy na łowisko No Kill w sercu natury. Sprawdź cennik, regulamin i zobacz naszą galerię.",
    siteName: "Zalew Kozłowski",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zalew Kozłowski | Prywatne Łowisko",
    description: "Cisza, spokój i wielka ryba. Odwiedź nas!",
  },
  manifest: "/manifest.json",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  const supportedLocales = ["pl", "en"];
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const { isEnabled } = await draftMode();
  const [weatherData, infoBlocks, messages] = await Promise.all([
    getWeatherAction().catch(() => null),
    getInfoBlocks(isEnabled, locale).catch(() => []),
    getMessages()
  ]);

  const phone = infoBlocks.find((b: any) => b.fields.id === "phone")?.fields.value || "601 389 365";
  const email = infoBlocks.find((b: any) => b.fields.id === "email")?.fields.value || "lowiskokozlow@gmail.com";
  const addressVal = infoBlocks.find((b: any) => b.fields.id === "address")?.fields.value || "Kozłów 4A, 39-200 Dębica";

  // Basic parser for "Street, PostalCode Locality"
  let streetAddress = "Kozłów 4A";
  let postalCode = "39-200";
  let addressLocality = "Kozłów";

  try {
    const parts = addressVal.split(",");
    if (parts.length >= 2) {
      streetAddress = parts[0].trim();
      const secondPart = parts[1].trim();
      const match = secondPart.match(/^(\d{2}-\d{3})\s+(.+)$/);
      if (match) {
        postalCode = match[1];
        addressLocality = match[2];
      } else {
        addressLocality = secondPart;
      }
    } else {
      streetAddress = addressVal;
    }
  } catch (e) {
    console.error("Failed to parse address for JSON-LD:", e);
  }

  const activeGlowColor = weatherData ? getGlowColorForScore(weatherData.score) : "249, 115, 22";

  // Server-side theme detection from cookie (avoids inline <script> + React 19 warning)
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("theme")?.value;
  const isDarkTheme = themeCookie === "dark" || (!themeCookie && true); // default to dark

  return (
    <html lang={locale} className={isDarkTheme ? "dark" : ""} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${syne.variable} antialiased bg-background text-foreground selection:bg-sunset-orange selection:text-white`}
        style={{ "--active-glow-color": activeGlowColor } as React.CSSProperties}
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages}>
          {/* Accessibility: Skip Link */}
          <a
            href="#main-content"
            className="absolute left-4 top-4 z-100 -translate-y-[150%] rounded-lg bg-sunset-orange px-4 py-2 text-white transition-transform focus:translate-y-0"
          >
            {locale === "en" ? "Skip to content" : "Przejdź do treści"}
          </a>

          {/* JSON-LD for Business Context */}
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Zalew Kozłowski",
            "image": "https://zalew-kozlowski.pl/hero.mp4",
            "telephone": phone.replace(/\s+/g, ""),
            "email": email,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": streetAddress,
              "addressLocality": addressLocality,
              "postalCode": postalCode,
              "addressCountry": "PL"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 50.0944,
              "longitude": 21.4362
            },
            "url": "https://zalew-kozlowski.pl",
            "priceRange": "$$",
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday", "Sunday"],
                "opens": "06:00",
                "closes": "20:00"
              }
            ],
            "description": "Prywatne łowisko No Kill w Kozłowie. Karpie, Amury, Szczupaki. Cisza i spokój."
          }} />

          <Navbar />
          <main id="main-content" className="min-h-screen relative flex flex-col">
            {children}
          </main>
          <Footer />
          <CookieConsent />
          <DraftModeBanner />
          <Analytics />
        </NextIntlClientProvider>
        {/* GA4 — lazyOnload żeby nie blokować głównego wątku podczas LCP */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga4-init" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}

