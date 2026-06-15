# Architektura i Przepływ Danych — Zalew Kozłowski 🎣

Dokument ten opisuje strukturę katalogów projektu, konfigurację Contentful CMS oraz najważniejsze ścieżki przepływu danych.

---

## 📁 Struktura Projektu

Projekt opiera się na strukturze Next.js (App Router):

*   `src/app/` – Strony i endpointy API (routing Next.js).
    *   `src/app/layout.tsx` – Główny układ aplikacji, ładowanie fontów, globalne metadane, strukturalne dane JSON-LD dla LocalBusiness (zasilane danymi z CMS).
    *   `src/app/globals.css` – Główne style Tailwind CSS v4, w tym tokeny kolorystyczne i animacji.
    *   `src/app/actions/` – Akcje serwerowe (Server Actions), np. `upload-gallery-photo.ts` obsługujący wysyłanie zdjęć z walidacją Honeypot i Zod.
    *   `src/app/cennik/`, `/kontakt/`, `/o-lowisku/`, `/regulamin/`, `/aktualnosci/` – Podstrony serwerowe pobierające dane z CMS.
*   `src/components/` – Podział na komponenty prezentacyjne i funkcyjne:
    *   `src/components/features/` – Komponenty klienckie i interaktywne (np. `PricingClient.tsx` kalkulatora, `GalleryUploadForm.tsx` formularza).
    *   `src/components/layout/` – Komponenty szkieletu strony (np. `NavbarClient.tsx`, `Footer.tsx`).
    *   `src/components/ui/` – Reużywalne elementy interfejsu (np. `magnetic.tsx` do magnetycznych przycisków, `lightbox.tsx` podglądu zdjęć).
*   `src/lib/` – Biblioteki pomocnicze i konfiguracja:
    *   `src/lib/contentful.ts` – Inicjalizacja klienta Contentful (w tym mechanizm odporności na awarie/brak tokenów).
    *   `src/lib/contentful-loader.ts` – Optymalizator zasobów graficznych z Contentful i lokalnych.
    *   `src/lib/motion.ts` – Zunifikowane stałe i sprężyny fizyczne Framer Motion.
*   `tests/` – Scenariusze testów integracyjnych Playwright E2E.
*   `.github/workflows/` – Konfiguracja automatycznego potoku budowania i testowania CI/CD w chmurze GitHub Actions.

---

## ☁️ Integracja z Contentful CMS

Aplikacja pobiera treści z Contentful CMS za pomocą Delivery API oraz Preview API.

### Konfiguracja połączenia
Konfiguracja znajduje się w pliku `src/lib/contentful.ts`. Kluczowe zmienne środowiskowe pobierane w runtime:
*   `CONTENTFUL_SPACE_ID`
*   `CONTENTFUL_ACCESS_TOKEN` (Delivery API - produkcja)
*   `CONTENTFUL_PREVIEW_ACCESS_TOKEN` (Preview API - tryb szkicu)
*   `CONTENTFUL_ENVIRONMENT` (domyślnie `master`)

### Struktura typów (Content Types)
1.  **infoBlock** – Pojedyncze bloki informacyjne (np. adres, telefon, e-mail, link do mapy).
    *   Polami są: `title` (nazwa), `content` (krótki tekst), `identifier` (unikalny ID, np. `address`, `phone`, `email`, `map-url`, `map-embed`).
2.  **priceItem** – Elementy cennika.
    *   Polami są: `name` (nazwa usługi), `price` (cena), `category` (kategoria, np. Karp, Spinning, Inne).
3.  **fishSpecies** – Gatunki ryb w łowisku.
    *   Polami są: `name`, `description`, `photo`, `stats` (JSON: trudność, siła, popularność), `tags`.
4.  **regulation** – Punkty regulaminu.
    *   Polami są: `content` (treść), `category` (sekcja regulaminu).
5.  **article** – Wpisy aktualności (blog).
    *   Polami są: `title`, `slug`, `content` (Rich Text), `excerpt` (zajawka), `coverImage`, `publishDate`.

### Odporność na awarie CMS
Wszystkie zapytania do CMS są izolowane blokami `try-catch` na poziomie serwerowym. W razie problemów sieciowych lub braku tokenów, funkcje pomocnicze w poszczególnych podstronach zwracają twardo zakodowane w plikach fallbacki:
*   Cennik: Fallback w `src/app/cennik/page.tsx`.
*   Ryby: Fallback w `src/app/o-lowisku/page.tsx`.
*   Regulamin: Fallback w `src/app/regulamin/page.tsx`.
*   Aktualności: Brak postów (elegancki komunikat o braku wpisów) w `src/app/aktualnosci/page.tsx`.

---

## ⚡ Routing i Animacje Nawigacji

Aplikacja wykorzystuje nowoczesną nawigację z płynnymi przejściami między podstronami:
1.  **TransitionLink.tsx** – Komponent zastępujący standardowy `<Link>` z Next.js. Przechwytuje kliknięcie i inicjuje przejście za pomocą natywnego API przeglądarki `document.startViewTransition`.
2.  **View Transitions API** – Stylizowane w `src/app/globals.css` (nazwa przejścia `active-nav-pill` przypisana do aktywnej kapsułki w menu głównym). Powoduje, że tło aktywnego linku w menu głównym płynnie przesuwa się i morphuje między podstronami podczas ładowania nowej strony.
3.  **Wygładzanie Logo** – Logo na stronie głównej posiada specjalną obsługę (czysty scroll do góry za pomocą JS), omijając proces routingu, co zapobiega miganiu lub szarpnięciom ekranu.
