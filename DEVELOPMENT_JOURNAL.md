# Dziennik Deweloperski i Historia Audytów — Zalew Kozłowski 🎣

Dokument ten stanowi kronikę prac programistycznych, optymalizacyjnych i bezpieczeństwa zrealizowanych w projekcie Zalew Kozłowski (Łowisko No Kill). Zawiera opis stosu technologicznego, decyzji architektonicznych oraz szczegółową historię zmian.

---

## 🛠️ Stos Technologiczny i Standardy (2026)

Aplikacja została zbudowana i zoptymalizowana zgodnie ze współczesnymi standardami inżynierii stron webowych:
*   **Szkielet aplikacji (Framework):** Next.js 16 (App Router) uruchomiony w środowisku **Edge Runtime** (zapewnia zerowy cold-start przy słabym zasięgu nad wodą).
*   **Kompilator:** Eksperymentalny **React Compiler** (automatyczna memoizacja i brak długu związanego z `useMemo`/`useCallback`).
*   **Stylizowanie:** Tailwind CSS v4 (z natywną obsługą zmiennych CSS dla tokenów ruchu i kolorów akcentów).
*   **Biblioteka Animacji:** Framer Motion (ze zunifikowanymi sprężynami fizycznymi `snappy`, `bouncy`, `fluid`).
*   **Zarządzanie Treścią (CMS):** Contentful CMS (Delivery & Preview API + Management API do przesyłania plików).
*   **Walidacja Danych:** Zod (pełna weryfikacja typów i rozmiarów plików po stronie serwera).
*   **Powiadomienia:** Resend API (automatyczne maile o nowych zdjęciach czekających na akceptację).
*   **Testy Automatyczne:** Playwright (E2E na przeglądarkach Chromium i Firefox).
*   **Integracja CI/CD:** GitHub Actions (automatyczna budowa i testowanie przy PR/Pushach z mechanizmem buforowania cache).

---

## 📈 Historia Wdrożeń i Zrealizowanych Zmian

Poniższa lista zawiera chronologiczne podsumowanie przeprowadzonych audytów oraz wdrożonych usprawnień:

### 1. Płynne przewijanie do góry strony
*   Naprawiono skokowe zachowanie Next.js Routera przy kliknięciu w logo na stronie głównej.
*   Wdrożono warunkowe renderowanie w `NavbarClient.tsx` oraz `FooterLinks.tsx` (czysty scroll zamiast ponownego nawigowania).

### 2. Standaryzacja Systemu Animacji i Ruchu (Motion Design System)
*   Wprowadzono spójne tokeny ruchu CSS w `globals.css` (`--ease-premium-reveal`, `--ease-premium-spring`, `--ease-premium-in-out`).
*   Utworzono konfigurację globalnych sprężyn fizycznych we Framer Motion (`src/lib/motion.ts`): `SPRING_FLUID`, `SPRING_BOUNCY`, `SPRING_SNAPPY`.

### 3. Szlify Nawigacji i Animacji Przycisków
*   Ujednolicono sprężyny sliderów hover/active w menu głównym.
*   Zaimplementowano mechaniczną harmonię kontenera menu (wysokość paska i zaokrąglenie morphują się w idealnej harmonii).
*   Wprowadzono lśniący, gładki gradient na przycisku CTA "Zadzwoń" (realizowany sprzętowo przez GPU za pomocą `transition-opacity`).

### 4. Standaryzacja Suwaków Wyboru i Kontrastu
*   Poprawiono kontrast i widoczność wskaźnika hover/active w menu głównym na jasnym tle (stan `scrolled` navbaru).
*   Przebudowano slidery wyboru metody i liczby wędzisk w kalkulatorze cen (`PricingClient.tsx`) oraz formularzu rezerwacji (`ContactClient.tsx`) na torach pigułkowych z przesuwanym tłem gradientowym.

### 5. Natywna Animacja Menu (View Transitions API)
*   Zaimplementowano natywne przejścia View Transitions dla aktywnej kapsułki menu między podstronami.
*   Zsynchronizowano przejścia w `TransitionLink.tsx` z faktyczną aktualizacją ścieżki i stanem DOM.

### 6. PageSpeed i Core Web Vitals (CWV)
*   Wdrożono priorytet sieciowy `fetchPriority="high"` dla posteru LCP w Hero.
*   Wyłączono agresywny preload dla obrazów poniżej linii zgięcia (krajobraz) i obniżono jakość do 70%.
*   Zredukowano wagę skryptów JS (o ok. 14KB) poprzez aktualizację `.browserslistrc` (wyłączenie przestarzałych polyfilli).
*   Zoptymalizowano animacje CSS pod GPU (zamiana `clip-path` i `blur` na `translateY` i `pointer-events`).

### 7. Wzmocnienie Bezpieczeństwa (Security & Hygiene)
*   Usunięto publiczny, testowy endpoint `/api/test-connection/` odsłaniający status zmiennych środowiskowych.
*   Dodano limit rozmiaru pliku (max 5MB) w schemacie Zod akcji serwerowej `upload-gallery-photo.ts`.
*   Skonfigurowano restrykcyjną politykę **Content Security Policy (CSP)** w `next.config.ts`.
*   Stworzono klimatyczne, dedykowane strony błędów `not-found.tsx` (404) oraz `error.tsx` (500).

### 8. Poprawka Nawigacji w Lightboxie
*   Zablokowano bąbelkowanie kliknięć (propagacja zdarzeń `e.stopPropagation()`) na strzałkach i przycisku zamknięcia lightboxa, eliminując błąd natychmiastowego zamykania modalu.

### 9. Odporność na Awarie CMS (Contentful Resilience)
*   Zabezpieczono klienta Contentful przed rzucaniem błędów podczas inicjalizacji przy braku tokenów (zwraca bezpieczny obiekt mockujący).
*   Zaimplementowano kompletne dane zapasowe (fallback data) dla cennika, mieszkańców łowiska (ryb), regulaminu oraz listy aktualności. Serwis ładuje się poprawnie nawet przy całkowitym braku połączenia z bazą Contentful.

### 10. Audyt Bezpieczeństwa Zależności
*   Zaktualizowano pakiet `next` do bezpiecznej wersji `16.2.9`.
*   Wymuszono bezpieczną wersję `postcss` (`^8.5.15`) w bloku `overrides` w `package.json` w celu usunięcia podatności XSS.

### 11. Optymalizacja Obrazów na Urządzeniach Mobilnych
*   Rozszerzono loader obrazków (`contentful-loader.ts`) o dopasowanie rozmiarów dla zdjęć z Unsplash oraz lokalnych (przekierowanie na `/_next/image`).
*   Wdrożono responsywne zestawy `srcSet` w lightboxie galerii, ograniczając rozdzielczość na telefonach do 1920px.

### 12. Przyśpieszenie Ładowania i Efekty Wizualne Miniatur
*   Przełączono format miniatur w CDN Contentful z `avif` na `webp` w celu wyeliminowania długiego oczekiwania (cold-start) na nowo dodane zdjęcia.
*   Wdrożono animację blur-to-focus z pulsującym szkieletem (skeleton loader) na siatce galerii oraz kartach ryb.

### 13. Z-index w Lightboxie i Ostrość Bento
*   Rozwiązano problem przykrywania przycisków nawigacyjnych przez zdjęcia o niestandardowych proporcjach w lightboxie.
*   Zaimplementowano dynamiczne dobieranie rozdzielczości miniatur w bento grid (szerokość 640px dla podwójnych kadrów, 320px dla pojedynczych), przywracając pełną ostrość obrazu na ekranach Retina/High-DPI.

### 14. Zaawansowane Optymalizacje Galerii (AVIF + Prefetch + Priority)
*   Przywrócono docelowy format AVIF w loaderze (waga plików mniejsza o 30-50% względem WebP).
*   Włączono priorytet wczytywania (`priority={true}`) dla pierwszych 4 miniatur galerii (above-the-fold).
*   Zaimplementowano inteligentny, dyskretny prefetching sąsiednich zdjęć w tle w lightboxie (`fetchPriority="low"`), dzięki czemu przełączanie zdjęć następuje natychmiastowo (0ms).

### 15. Audyt Dostępności WCAG 2.2 (UI Accessibility Audit)
*   Wdrożono pełną pułapkę focusu (`focus trap`) oraz obsługę klawisza `Escape` w menu mobilnym oraz lightboxie galerii.
*   Zaimplementowano mechanizm przywracania focusu (`focus restoration`) do klikniętej miniatury po zamknięciu lightboxa.
*   Wdrożono pełny wzorzec WAI-ARIA tablist w zakładkach regulaminu (`role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected` oraz `tabIndex={0}`).

### 16. Audyt Pokrycia Testami E2E
*   Wdrożono i skonfigurowano framework Playwright w `playwright.config.ts` (silniki Chromium i Firefox).
*   Napisano kompleksowe testy E2E dla kalkulatora, formularza kontaktowego (szablon SMS), lightboxa galerii, zakładek regulaminu, wgrywania zdjęć oraz menu mobilnego i motywów.

### 17. Konfiguracja Potoku CI/CD (GitHub Actions)
*   Stworzono plik workflow `.github/workflows/playwright.yml` budujący i uruchamiający testy w chmurze przy push/PR na `main`.
*   Wdrożono cache dla npm i browserów Playwright oraz obsługę mockowanych kluczy środowiskowych.

### 18. Dynamiczne dane kontaktowe (CMS) i Zabezpieczenie Honeypot
*   Przeniesiono dane adresowe i linki do map Google z kodu na sztywno do Contentful (`infoBlocks`).
*   Zaimplementowano pole Honeypot (`website`) w formularzu galerii i obsługę w Server Action (natychmiastowe, bezkosztowe odrzucenie spamu z decoy success), co chroni limity zasobów.
