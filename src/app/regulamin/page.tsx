import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { CheckCircle, XCircle, Cctv } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Regulamin | Zalew Kozłowski",
    description: "Zasady wędkowania No Kill, bezpieczeństwo i etykieta na łowisku. Przeczytaj regulamin przed przyjazdem.",
};

export default function RulesPage() {
    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal>
                    <h1 className="mb-8 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Regulamin Łowiska
                    </h1>

                    <div className="space-y-8">
                        <SpotlightCard className="rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-pine-green/20 dark:hover:border-sunset-orange/20 transition-colors">
                            <div className="relative z-10">
                                <h2 className="mb-4 text-2xl font-semibold text-pine-green dark:text-sunset-orange">
                                    Zasady Ogólne
                                </h2>

                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3 text-lg font-bold text-sunset-orange">
                                        <XCircle className="mt-1 h-6 w-6 shrink-0" />
                                        <span>CAŁKOWITY ZAKAZ ZABIERANIA RYB (NO KILL).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-pine-green-dark dark:text-neutral-200">
                                        <CheckCircle className="mt-1 h-5 w-5 text-pine-green shrink-0" />
                                        <span>Wędkowanie: Sobota-Niedziela (Pon-Pt możliwe po uzgodnieniu).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-pine-green-dark dark:text-neutral-200">
                                        <CheckCircle className="mt-1 h-5 w-5 text-pine-green shrink-0" />
                                        <span>Osoby spoza Kozłowa: wymagany wcześniejszy kontakt telefoniczny.</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-pine-green-dark dark:text-neutral-200">
                                        <CheckCircle className="mt-1 h-5 w-5 text-pine-green shrink-0" />
                                        <span>Limit: Max 2 wędki na osobę (lub 1 spinning).</span>
                                    </li>
                                    <li className="flex items-start gap-3 text-pine-green-dark dark:text-neutral-200">
                                        <CheckCircle className="mt-1 h-5 w-5 text-pine-green shrink-0" />
                                        <span>Zasady zachowania i etyki wędkarskiej zgodne z regulaminem PZW.</span>
                                    </li>
                                </ul>
                            </div>
                        </SpotlightCard>

                        <SpotlightCard className="rounded-2xl p-8 bg-white/50 dark:bg-white/5 border-2 border-red-200 dark:border-red-900/30 hover:border-red-400 dark:hover:border-red-500/50 transition-colors">
                            <div className="relative z-10">
                                <h2 className="mb-4 text-2xl font-semibold text-red-600 dark:text-red-400">
                                    Bezpieczeństwo i Porządek
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2">
                                    <ul className="space-y-2 text-pine-green-dark dark:text-neutral-200">
                                        <li className="font-bold flex items-center gap-2 text-red-600 dark:text-red-400"><XCircle className="h-4 w-4" /> Przebywanie na łowisku po zmroku ZABRONIONE.</li>
                                        <li className="flex items-center gap-2"><XCircle className="h-4 w-4" /> Zakaz kąpieli.</li>
                                        <li className="flex items-center gap-2"><XCircle className="h-4 w-4" /> Zakaz rozpalania ognisk (poza wyznaczonymi miejscami).</li>
                                    </ul>
                                    <div className="flex flex-col items-center justify-center rounded-lg bg-pine-green-dark p-6 text-white relative overflow-hidden">
                                        <div className="relative z-10 flex flex-col items-center gap-2">
                                            <Cctv className="h-16 w-16 text-sunset-orange/90" />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-2">
                                                Monitoring 24/7
                                            </span>
                                        </div>
                                        {/* Subtle recording dot animation */}
                                        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>

                        <div className="text-center pt-8">
                            <p className="text-sm text-neutral-500">Więcej informacji pod numerem telefonu:</p>
                            <p className="text-3xl font-bold text-pine-green dark:text-white mt-2">601 389 365</p>
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
