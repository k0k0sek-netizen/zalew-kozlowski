import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cennik | Zalew Kozłowski",
    description: "Sprawdź ceny zezwoleń wędkarskich, zasady płatności i dostępne opcje na Zalewie Kozłowskim. Brak ukrytych opłat.",
};

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal>
                    <h1 className="mb-8 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Cennik Zezwoleń
                    </h1>
                    <p className="mb-8 text-lg text-earth-brown dark:text-neutral-300">
                        Wędkowanie na Zalewie Kozłowskim wymaga wykupienia licencji. <strong>Płatność wyłącznie gotówką na miejscu</strong> u gospodarza.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Card 1: Standard Pricing */}
                        <SpotlightCard className="flex flex-col p-8 border-2 border-transparent hover:border-sunset-orange transition-colors">
                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-xl font-bold text-pine-green-dark dark:text-white">Zezwolenie Wędkarskie</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">Opłata za jedną wędkę</p>
                                <div className="my-4 text-5xl font-bold text-sunset-orange">10 zł</div>
                                <ul className="mb-8 flex-1 space-y-3 text-sm">
                                    <li className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-sunset-orange"></span>
                                        Max 2 wędki (20 zł)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-sunset-orange"></span>
                                        LUB 1 wędka spinningowa
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-sunset-orange"></span>
                                        <strong>Tylko gotówka</strong>
                                    </li>
                                    <li className="flex items-center gap-2 pt-2 text-pine-green font-bold dark:text-green-400">
                                        <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                                        Mieszkańcy Kozłowa: 0 zł
                                    </li>
                                </ul>
                            </div>
                        </SpotlightCard>

                        {/* Card 2: Important Info */}
                        <SpotlightCard className="flex flex-col bg-pine-green-dark p-8 text-white border-2 border-sunset-orange/50 hover:border-sunset-orange relative overflow-hidden transition-colors">
                            <div className="absolute right-0 top-0 bg-sunset-orange px-3 py-1 text-xs font-bold text-white rounded-bl-lg z-20">WAŻNE</div>
                            <div className="relative z-10 flex flex-col h-full">
                                <h3 className="text-xl font-bold mb-4">Dostępność Łowiska</h3>
                                <ul className="space-y-4 text-sm flex-1">
                                    <li className="flex gap-3">
                                        <div className="font-bold text-sunset-orange min-w-[80px]">Weekend:</div>
                                        <div>Sobota - Niedziela (Świt - Zmierzch)</div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="font-bold text-sunset-orange min-w-[80px]">Pon - Pt:</div>
                                        <div>Możliwe <strong>wyłącznie po uzgodnieniu telefonicznym</strong>.</div>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="font-bold text-sunset-orange min-w-[80px]">Goście:</div>
                                        <div>Wymagany wcześniejszy kontakt.</div>
                                    </li>
                                </ul>
                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <div className="text-xs text-neutral-400 mb-1">Kontakt telefoniczny:</div>
                                    <div className="text-2xl font-bold text-sunset-orange">601 389 365</div>
                                </div>
                            </div>
                        </SpotlightCard>
                    </div>

                    <div className="mt-12 rounded-xl bg-neutral-100 p-6 dark:bg-white/5 border-l-4 border-sunset-orange">
                        <h3 className="mb-2 font-bold text-pine-green-dark dark:text-white">Brak ukrytych opłat</h3>
                        <p className="text-earth-brown dark:text-neutral-300">
                            Nie oferujemy karnetów, pakietów sezonowych ani rezerwacji stanowisk. Proste zasady: przyjeżdżasz, uzgadniasz, łowisz.
                        </p>
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
