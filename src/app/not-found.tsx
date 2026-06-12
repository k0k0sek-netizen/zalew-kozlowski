"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { SectionReveal } from "@/components/ui/section-reveal";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export default function NotFound() {
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
                        <div className="mb-6 rounded-full bg-sunset-orange/10 p-4 text-sunset-orange dark:text-orange-400">
                            <Compass className="h-10 w-10 animate-bounce" />
                        </div>
                        <h1 className="mb-2 text-5xl font-black text-pine-green-dark dark:text-white md:text-6xl tracking-tight">
                            404
                        </h1>
                        <h2 className="mb-4 text-xl font-bold text-pine-green dark:text-stone-200">
                            Zagubiony nad wodą?
                        </h2>
                        <p className="mb-8 text-sm leading-relaxed text-earth-brown dark:text-neutral-400">
                            Strona, której szukasz, odpłynęła z prądem albo nigdy nie istniała. 
                            Sprawdź poprawność linku lub wróć bezpiecznie na brzeg.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-pine-green px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-pine-green-dark hover:scale-105 active:scale-95 dark:bg-emerald-700 dark:hover:bg-emerald-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunset-orange cursor-pointer"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Wróć na Stronę Główną
                        </Link>
                    </SpotlightCard>
                </SectionReveal>
            </div>
        </SubpageWrapper>
    );
}
