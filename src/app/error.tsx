"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { SectionReveal } from "@/components/ui/section-reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application Error Boundary caught:", error);
    }, [error]);

    return (
        <SubpageWrapper className="flex items-center justify-center">
            <div className="mx-auto max-w-xl px-4 text-center w-full">
                <SectionReveal>
                    <SpotlightCard
                        className="p-8 md:p-12 rounded-2xl flex flex-col items-center justify-center border border-pine-green/10 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm"
                        style={{
                            borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.15)"
                        } as React.CSSProperties}
                    >
                        <div className="mb-6 rounded-full bg-red-550/10 p-4 text-red-550 dark:text-red-400">
                            <AlertTriangle className="h-10 w-10 animate-pulse" />
                        </div>
                        <h1 className="mb-2 text-3xl font-black text-pine-green-dark dark:text-white md:text-4xl tracking-tight">
                            Coś poszło nie tak
                        </h1>
                        <h2 className="mb-4 text-lg font-bold text-pine-green dark:text-stone-200">
                            Błąd Połączenia / Systemu
                        </h2>
                        <p className="mb-8 text-sm leading-relaxed text-earth-brown dark:text-neutral-400">
                            Wystąpił nieoczekiwany problem przy ładowaniu strony. Spróbuj odświeżyć 
                            połączenie. Jeśli problem nie ustępuje, skontaktuj się z nami.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                            <button
                                onClick={() => reset()}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-pine-green px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-pine-green-dark hover:scale-105 active:scale-95 dark:bg-emerald-700 dark:hover:bg-emerald-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunset-orange cursor-pointer"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Spróbuj Ponownie
                            </button>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-pine-green/20 dark:border-white/10 px-6 py-2.5 text-sm font-semibold text-pine-green-dark dark:text-white hover:bg-pine-green/5 dark:hover:bg-white/5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                                <Home className="h-4 w-4" />
                                Strona Główna
                            </Link>
                        </div>
                    </SpotlightCard>
                </SectionReveal>
            </div>
        </SubpageWrapper>
    );
}
