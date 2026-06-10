import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/features/CookieConsent";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import DraftModeBanner from "@/components/features/DraftModeBanner";
import { getWeatherAction } from "@/app/actions/weather";
import { getInfoBlocks } from "@/lib/contentful";
import { getGlowColorForScore } from "@/lib/bite-index-theme";
import { draftMode } from "next/headers";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();
  const [weatherData, infoBlocks] = await Promise.all([
    getWeatherAction().catch(() => null),
    getInfoBlocks(isEnabled).catch(() => []),
  ]);

  const phone = infoBlocks.find((b: any) => b.fields.id === "phone")?.fields.value || "601 389 365";
  const email = infoBlocks.find((b: any) => b.fields.id === "email")?.fields.value || "lowiskokozlow@gmail.com";

  const activeGlowColor = weatherData ? getGlowColorForScore(weatherData.score) : "249, 115, 22";

  return (
    <html lang="pl" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })()
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} ${syne.variable} antialiased bg-background text-foreground selection:bg-sunset-orange selection:text-white`}
        style={{ "--active-glow-color": activeGlowColor } as React.CSSProperties}
        suppressHydrationWarning
      >

        {/* Accessibility: Skip Link */}
        <a
          href="#main-content"
          className="absolute left-4 top-4 z-100 -translate-y-[150%] rounded-lg bg-sunset-orange px-4 py-2 text-white transition-transform focus:translate-y-0"
        >
          Przejdź do treści
        </a>

        {/* JSON-LD for Business Context */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness", // More specific than Organization for a physical location
              "name": "Zalew Kozłowski",
              "image": "https://zalew-kozlowski.pl/hero.mp4", // Ideally an image URL
              "telephone": phone.replace(/\s+/g, ""),
              "email": email,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Kozłów 4A",
                "addressLocality": "Kozłów",
                "postalCode": "39-200",
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
              "description": "Prywatne łowisko No Kill in Kozłów. Karpie, Amury, Szczupaki. Cisza i spokój."
            }),
          }}
        />

        <Navbar />
        <main id="main-content" className="min-h-screen relative flex flex-col">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <DraftModeBanner />
        <Analytics />
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
