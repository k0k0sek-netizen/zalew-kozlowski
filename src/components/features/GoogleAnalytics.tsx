"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

// 📝 INSTRUKCJA DLA WŁAŚCICIELA:
// 1. Zaloguj się do Google Analytics 4.
// 2. Skopiuj swój "Identyfikator pomiaru" lub "Google Tag" (zaczyna się od G- lub GT-).
// 3. Wklej go poniżej w cudzysłowie.
const GA_TRACKING_ID = ""; // np. "G-1234567890"

// Opcjonalnie: Jeśli używasz Google Tag Managera (GTM)
const GTM_ID = ""; // np. "GTM-KB8XR5K"

export const GoogleAnalytics = () => {
    const [consentGiven, setConsentGiven] = useState(false);

    useEffect(() => {
        // Sprawdź czy użytkownik wyraził zgodę na cookies
        const consent = localStorage.getItem("cookie-consent");
        if (consent === "accepted") {
            setConsentGiven(true);
        }

        // Nasłuchuj na zmiany w localStorage (dla natychmiastowego uruchomienia po kliknięciu "Akceptuję")
        const handleStorageChange = () => {
            if (localStorage.getItem("cookie-consent") === "accepted") {
                setConsentGiven(true);
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // Opcjonalnie: Nasłuchuj na custom event, jeśli CookieConsent go emituje
        // Ale storage event działa między kartami, w tej samej karcie wymagałoby to innego mechanizmu.
        // Dla prostoty, założymy że odświeżenie strony lub nawigacja załatwi sprawę, 
        // lub dodamy prosty interval/event w samym CookieConsent.

        // Najprostszy hack Reacta - nasłuch na kliknięcie przycisku akceptacji w DOM? 
        // Nie, zrobimy to czyściej: CookieConsent po akceptacji przeładuje stronę lub zmieni stan globalny/context.
        // Tutaj zostawiamy proste sprawdzenie przy montowaniu.

        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Jeśli nie ma ID lub nie ma zgody, nie ładuj skryptów
    if ((!GA_TRACKING_ID && !GTM_ID) || !consentGiven) return null;

    return (
        <>
            {/* Google Analytics / Google Tag */}
            {GA_TRACKING_ID && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                        strategy="afterInteractive"
                    />
                    <Script id="google-analytics" strategy="afterInteractive">
                        {`
                          window.dataLayer = window.dataLayer || [];
                          function gtag(){dataLayer.push(arguments);}
                          gtag('js', new Date());
                          gtag('config', '${GA_TRACKING_ID}', {
                            page_path: window.location.pathname,
                          });
                        `}
                    </Script>
                </>
            )}

            {/* Google Tag Manager (GTM) */}
            {GTM_ID && (
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${GTM_ID}');
                    `}
                </Script>
            )}
        </>
    );
};
