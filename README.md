# Zalew Kozłowski – Next-Gen Fishery Platform 🎣

> **Status:** 🚀 Production Ready (2026 Standards)
> **Stack:** Next.js 16 (React Compiler), Tailwind v4, Edge Runtime, TypeScript (Zod)

## 📌 Context (The "Why")
**Sytuacja:** Lokalne łowisko potrzebowało nowoczesnej obecności w sieci, która nie tylko informuje, ale "sprzedaje" doświadczenie ciszy i natury.
**Problem:** Większość stron w tej niszy to statyczne "wizytówki" oparte na WordPressie, wolne na urządzeniach mobilnych (gdzie jest 80% ruchu wędkarzy) i trudne w utrzymaniu.
**Cel:** Stworzenie ultra-szybkiej, aplikacji PWA, która wczytuje się natychmiastowo nawet przy słabym zasięgu nad wodą.

## 🛠️ Decision Log (Engineering Choices)

### 1. Architektura "Edge-First"
Zamiast standardowego Node.js, użyłem **Edge Runtime**.
- **Dlaczego?** Użytkownik sprawdza pogodę nad wodą. Każda milisekunda "Cold Startu" to irytacja. Edge eliminuje ten problem.
- **Kod:** `export const runtime = 'edge';`

### 2. Zero-Bundle (React Compiler)
Wdrożyłem eksperymentalny **React Compiler** (Next.js 16).
- **Dlaczego?** Ręczna optymalizacja (`useMemo`) to dług technologiczny. Kompilator automatycznie memoizuje komponenty, zapewniając płynne animacje UI (jak Bento Grid) nawet na starszych smartfonach z Androidem.

### 3. Full-Stack Type Safety (Zod)
Server Actions zabezpieczone biblioteką **Zod**.
- **Dlaczego?** "Trust but verify". Każdy upload zdjęcia jest walidowany pod kątem typu MIME i rozmiaru przed przetworzeniem. Zero crashy na produkcji.

## 🚀 Key Features

- **📱 PWA & Local-First Lite:** Aplikacja instalowalna na telefonie. Działa prawie jak natywna.
- **⚡ Bento Grid UI:** Nowoczesny, modułowy interfejs inspirowany Apple/Linear.
- **🌊 Real-time Weather:** Widget pogodowy z customowymi gradientami CSS zależnymi od "Indeksu Brań".
- **🔒 Privacy-First:** Własna implementacja Cookie Consent (zgodna z RODO) i Google Analytics 4.

## 🏗️ Getting Started

```bash
# 1. Clone repository
git clone https://github.com/k0k0sek-netizen/zalew-kozlowski.git

# 2. Install dependencies (Hyper-fast with npm)
npm install

# 3. Run development server (Turbopack)
npm run dev
```

## ✅ Quality Assurance

Projekt posiada zautomatyzowane testy E2E (Playwright) oraz CI/CD (GitHub Actions), które weryfikują każdy commit.

```bash
# Run E2E tests
npx playwright test
```

---
*Created by [WektorKodu.pl](https://wektorkodu.pl) setting standards for 2026 web development.*
