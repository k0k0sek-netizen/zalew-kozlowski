# Plan Rozwoju Projektu (Roadmap & Backlog) — Zalew Kozłowski 🎣

Dokument ten służy do planowania kolejnych etapów prac, zapisywania pomysłów na rozwój serwisu oraz śledzenia stanu ich realizacji.

---

## 🗺️ Mapa Drogowa i Pomysły (Roadmap)

### 📌 Faza 1: Internacjonalizacja (i18n)
Dodanie wsparcia dla języka angielskiego (EN) w celu przyciągnięcia turystów z zagranicy.
*   [ ] Wybór i konfiguracja biblioteki (np. `next-intl` lub lekki middleware z słownikiem JSON).
*   [ ] Przetłumaczenie statycznych tekstów (menu, stopka, strona główna, kontakt).
*   [ ] Dynamiczne pobieranie wersji językowych z Contentful CMS (dodanie lokalizacji w CMS dla pól cennika, ryb i regulaminu).
*   [ ] Przełącznik językowy (PL/EN) zintegrowany z nagłówkiem.

### 📌 Faza 2: Dynamiczne i Zaawansowane SEO
Zapewnienie jak najwyższej widoczności w wynikach wyszukiwania.
*   [ ] Wdrożenie dynamicznego generowania pliku `sitemap.xml` w Next.js pobierającego adresy artykułów w czasie rzeczywistym z Contentful API.
*   [ ] Konfiguracja pliku `robots.txt`.
*   [ ] Pełny audyt tagów Open Graph (OG:Image, OG:Title) oraz Twitter Cards dla dynamicznych stron aktualności.

### 📌 Faza 3: Produkcyjny Monitoring i Analityka
Zabezpieczenie stabilności działania i analiza ruchu użytkowników.
*   [ ] Integracja z systemem raportowania błędów w czasie rzeczywistym (np. Sentry).
*   [ ] Pełna integracja z Google Tag Manager (GTM) / Google Analytics 4 (GA4) za pomocą oficjalnego pakietu `@next/third-parties` z konfiguracją przez bezpieczne zmienne środowiskowe.
*   [ ] Stworzenie dashboardu analitycznego do monitorowania konwersji (np. kliknięcia w wyślij SMS rezerwacyjny).

### 📌 Faza 4: Wdrożenie Produkcyjne i Domena Docelowa
*   [ ] Skonfigurowanie środowiska produkcyjnego na Vercel lub Firebase App Hosting.
*   [ ] Podpięcie domeny docelowej, konfiguracja certyfikatu SSL oraz przekierowań (np. z www na bez-www).
*   [ ] Konfiguracja webhooków w Contentful, które automatycznie wyzwalają re-validation cache (ISR) lub przebudowanie strony przy każdej zmianie treści przez administratora.

---

## 📋 Lista Zadań (Backlog)

*   `[ ]` Konfiguracja biblioteki i18n (`next-intl`) w projekcie.
*   `[ ]` Przygotowanie słowników języka angielskiego (pl.json / en.json).
*   `[ ]` Konfiguracja generowania `sitemap.xml` z dynamiczną integracją CMS.
*   `[ ]` Weryfikacja tagów Open Graph na stronach aktualności.
*   `[ ]` Integracja Sentry SDK.
*   `[ ]` Konfiguracja ga4 przez zmienne środowiskowe.
*   `[ ]` Podpięcie produkcyjnej domeny i SSL.
*   `[ ]` Rejestracja webhooków Contentful do automatycznego czyszczenia cache.

---

## 🏆 Zrealizowane Etapy (Changelog / History)

Dla szczegółowego wglądu we wdrożone poprawki zobacz: [DEVELOPMENT_JOURNAL.md](file:///home/h4q/Dokumenty/PlatformIO/Projects/ProjektyWebowe/zalew-kozlowski/DEVELOPMENT_JOURNAL.md).

*   `[x]` **Optymalizacje E2E i Dostępności (Czerwiec 2026)**: Pełny audyt WCAG 2.2, wdrożenie Playwright, testy automatyczne integracyjne i potok CI/CD w chmurze.
*   `[x]` **Dynamiczne Dane Kontaktowe z CMS (Czerwiec 2026)**: Usunięcie sztywnych adresów, integracja z infoBlocks z Contentful dla adresów, e-maila, telefonu i Google Maps.
*   `[x]` **Zabezpieczenie Honeypot (Czerwiec 2026)**: Ukryte pole antyspamowe z decoy success w formularzu wgrywania zdjęć.
*   `[x]` **Wydajność Core Web Vitals (Czerwiec 2026)**: Wymuszenie formatu AVIF dla galerii, lazy-loading obrazków below-the-fold, prefetching sąsiednich zdjęć w lightboxie i redukcja wagi skryptów.
