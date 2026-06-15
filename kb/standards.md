# Standardy Techniczne i Deweloperskie — Zalew Kozłowski 🎣

Dokument ten opisuje wytyczne jakościowe, standardy kodowania, system animacji, zasady wydajnościowe oraz metodykę testowania w projekcie.

---

## 💻 Wytyczne Kodowania

1.  **TypeScript i Typowanie**:
    *   Wszystkie parametry, akcje i stany komponentów muszą posiadać jawne typowanie TypeScript. Unikaj stosowania typu `any`.
    *   W pliku `src/lib/contentful.ts` typowanie klienta CMS i obiektów wpisów opiera się na natywnych szkieletach Contentful (np. `EntrySkeletonType`). Zwróć szczególną uwagę na poprawne generyki przy pobieraniu wpisów (`.getEntries<Type>`).
2.  **React i Next.js (App Router)**:
    *   **React Compiler:** Projekt korzysta z React Compiler. Nie stosuj `useMemo` ani `useCallback` do optymalizacji wydajnościowej wewnątrz komponentów – kompilator robi to automatycznie przy budowaniu projektu. Ręczne memoizacje stosuj wyłącznie wtedy, gdy są wymagane przez zewnętrzne biblioteki (np. jako stabilna referencja w tablicy zależności zewnętrznych hooków).
    *   Domyślnie twórz komponenty serwerowe (Server Components). Dyrektywę `"use client"` stosuj wyłącznie w komponentach wymagających interakcji (stany `useState`, zdarzenia `onClick`, animacje Framer Motion).
3.  **Obsługa Błędów**:
    *   Wszystkie asynchroniczne wywołania API sieciowych (CMS, pogoda, wysyłka poczty) muszą być opakowane w bloki `try-catch`.
    *   Zawsze dostarczaj bezpieczne, lokalne dane fallback na wypadek awarii serwisów zewnętrznych.

---

## 🎨 System Animacji i Ruchu (Motion Design)

Aby zapewnić spójność wizualną (fizykę i charakter ruchów na stronie), zdefiniowano zunifikowane tokeny.

### Tokeny CSS (`src/app/globals.css`)
Korzystaj z poniższych zmiennych w klasach CSS oraz Tailwind:
*   `--ease-premium-reveal`: `cubic-bezier(0.16, 1, 0.3, 1)` (szybki start, powolne wygaszanie, styl Apple/Stripe).
*   `--ease-premium-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` (fizyczny odrzut/sprężyna).
*   `--ease-premium-in-out`: `cubic-bezier(0.76, 0, 0.24, 1)` (symetryczny ruch wejścia-wyjścia).
*   `--duration-fast`: `150ms` (hover, drobne interakcje).
*   `--duration-normal`: `300ms` (standardowe przełączenia, otwieranie kart).
*   `--duration-slow`: `500ms` (wejścia dużych sekcji).

### Sprężyny Framer Motion (`src/lib/motion.ts`)
W komponentach klienckich React korzystających z Framer Motion importuj predefiniowane konfiguracje fizyczne z `SPRING_TOKENS`:
1.  `SPRING_TOKENS.fluid` – miękki, natychmiastowy ruch bez drgań wibracyjnych (np. efekt magnetycznego przyciągania kursora).
2.  `SPRING_TOKENS.bouncy` – organiczna sprężyna z lekkim odrzutem (np. powiększanie zdjęć w lightboxie, wyskok ceny w cenniku).
3.  `SPRING_TOKENS.snappy` – bardzo szybki ruch z wysokim tłumieniem (np. ślizgające się tła w segmented sliders, zmiana aktywnej pigułki w menu).

---

## ♿ Dostępność (WCAG 2.2 AA)

1.  **Nawigacja klawiaturą**:
    *   Wszystkie interaktywne kontrolki muszą być klikalne za pomocą klawisza `Enter` / `Space`.
    *   Wszystkie modale (np. lightbox galerii, menu mobilne) muszą mieć zaimplementowaną pułapkę focusu (`focus-trap-react` lub własną) oraz zamykać się po kliknięciu klawisza `Escape`.
    *   Po zamknięciu modalu focus musi powrócić na element, który go wywołał.
2.  **ARIA Roles**:
    *   Kontrolki wyboru (segmented switchers) muszą mieć atrybut `aria-pressed` odzwierciedlający ich stan.
    *   Zakładki (np. w regulaminie) muszą implementować wzorzec `role="tablist"`, `role="tab"`, `role="tabpanel"` ze zmienną `aria-selected` oraz powiązaniami `aria-controls`.
3.  **Kontrast i Etykiety**:
    *   Unikaj słabo kontrastowych kombinacji kolorów (np. biały tekst na jasnopomarańczowym tle).
    *   Wszystkie ukryte wizualnie pola (np. input pliku `input[type="file"]`) muszą posiadać powiązaną etykietę `<label>` widoczną dla czytników ekranu (`className="sr-only"`).

---

## ⚡ Wydajność (PageSpeed i Core Web Vitals)

1.  **Obrazy**:
    *   Zawsze używaj komponentu `<Image>` z Next.js z dedykowanym loaderem `contentfulLoader`.
    *   Do pobierania miniatur galerii używaj formatu **AVIF** – gwarantuje to najniższy transfer sieciowy (30-50% oszczędności względem WebP).
    *   W siatce galerii pierwsi 4 wędkarze (pierwszy rząd widoczny bez przewijania) muszą mieć ustawiony parametr `priority={true}` (wymusza pobranie zasobów LCP/FCP przed parsowaniem reszty DOM).
    *   Nie używaj preloada (`priority`) dla obrazków pod linią zgięcia (below-the-fold) – te zasoby mają pobierać się leniwie (lazy loading).
2.  **Optymalizacje CSS i Main Thread**:
    *   Unikaj kosztownych animacji CSS, takich jak dynamiczne nakładanie filtrów (`filter: blur(...)`) lub wycinanie ścieżek (`clip-path`) podczas przewijania (scroll-driven animations). Powoduje to wymuszenie ciągłych repaints na procesorze.
    *   Wszystkie transformacje animacji powinny opierać się na akceleracji sprzętowej GPU (`transform: translateY`, `scale`, `opacity`).
    *   Utrzymuj aktualne reguły w `.browserslistrc`, aby kompilator nie generował niepotrzebnych polyfilli dla starych przeglądarek.

---

## 🧪 Testowanie i Wdrożenia (CI/CD)

1.  **Testy E2E (Playwright)**:
    *   Testy są uruchamiane w chmurze GitHub Actions przy każdym PR i pushu do gałęzi `main`.
    *   Wszystkie testy muszą przejść pomyślnie przed wdrożeniem kodu.
    *   W celu weryfikacji zmian lokalnie uruchom:
        `npm run test:e2e`
2.  **Izolacja i Zmienne Środowiskowe w CI**:
    *   W środowisku CI/CD nie ma dostępu do rzeczywistych kluczy Contentful. System korzysta z mockowanych kluczy i automatycznie przełącza się na dane fallback. Upewnij się, że Twoje zmiany w kodzie nie uniemożliwią uruchomienia aplikacji przy pustych zmiennych CMS.
