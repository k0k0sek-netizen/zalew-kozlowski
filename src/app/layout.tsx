import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/features/CookieConsent";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import DraftModeBanner from "@/components/features/DraftModeBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-sand-beige text-pine-green-dark selection:bg-sunset-orange selection:text-white`}
      >
        <link rel="preconnect" href="https://api.open-meteo.com" />
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
              "telephone": "601389365",
              "email": "lowiskokozlow@gmail.com",
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
              "description": "Prywatne łowisko No Kill w Kozłowie. Karpie, Amury, Szczupaki. Cisza i spokój."
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
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || ""} />
      </body>
    </html>
  );
}
