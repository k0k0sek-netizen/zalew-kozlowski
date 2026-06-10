/**
 * Centralna definicja kolorów Indeksu Brań.
 *
 * Zmiana koloru tutaj automatycznie aktualizuje:
 * - layout.tsx  →  --active-glow-color na <body> (globalny akcent)
 * - page.tsx    →  glow na stronie głównej
 * - WeatherWidget.tsx  →  kropka + tekst w nawigacji
 * - WeatherBentoCard.tsx  →  karta pogodowa na stronie głównej
 */

export type BiteLevel = "poor" | "average" | "good" | "excellent";

/** Progi punktowe Indeksu Brań */
export function getBiteLevel(score: number): BiteLevel {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score <= 35) return "poor";
    return "average";
}

/** RGB string do CSS variable --active-glow-color (np. "249, 115, 22") */
export const GLOW_COLORS: Record<BiteLevel, string> = {
    poor: "120, 113, 108",     // Stone
    average: "14, 165, 233",   // Sky Blue
    good: "16, 185, 129",      // Emerald
    excellent: "249, 115, 22", // Orange
};

/** Klasy Tailwind — tło i tekst dla widżetów pogodowych */
export const TAILWIND_THEME: Record<BiteLevel, { bg: string; text: string }> = {
    poor: { bg: "bg-stone-500", text: "text-stone-600 dark:text-stone-400" },
    average: { bg: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
    good: { bg: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
    excellent: { bg: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" },
};

/** Kolor tekstu wyniku (score number) */
export const SCORE_TEXT_COLOR: Record<BiteLevel, string> = {
    poor: "text-stone-400",
    average: "text-sky-400",
    good: "text-emerald-500",
    excellent: "text-orange-500",
};

/** Gradient tła karty pogodowej (bento card) */
export const GRADIENT_BG: Record<BiteLevel, string> = {
    poor: "bg-gradient-to-br from-stone-500 via-stone-600 to-stone-800",
    average: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
    good: "bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800",
    excellent: "bg-gradient-to-br from-orange-400 via-orange-500 to-red-600",
};

// ── Wygodne helpery ──────────────────────────────────────────────────

/** Zwraca RGB glow string dla danego score */
export function getGlowColorForScore(score: number): string {
    return GLOW_COLORS[getBiteLevel(score)];
}

/** Zwraca Tailwind theme (bg + text) dla danego score */
export function getTailwindThemeForScore(score: number) {
    return TAILWIND_THEME[getBiteLevel(score)];
}

/** Zwraca kolor tekstu score dla danego score */
export function getScoreTextColorForScore(score: number): string {
    return SCORE_TEXT_COLOR[getBiteLevel(score)];
}

/** Zwraca gradient tła dla danego score */
export function getGradientBgForScore(score: number): string {
    return GRADIENT_BG[getBiteLevel(score)];
}
