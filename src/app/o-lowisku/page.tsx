import { FishCard } from "@/components/features/FishCard";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Sprout, Sun, CloudRain, Snowflake, Leaf, ShieldCheck, Trophy, Gauge, Wind, Moon, ThermometerSun } from "lucide-react";
import { Metadata } from "next";
import { contentfulClient, createContentfulClient, FishSpeciesSkeleton } from "@/lib/contentful";
import { Asset } from "contentful";
import { draftMode } from "next/headers";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "O Łowisku | Zalew Kozłowski",
    description: "Poznaj charakterystykę Zalewu Kozłowskiego. Sprawdź jakie ryby u nas występują i dlaczego warto nas odwiedzić.",
};

async function getFishSpecies(preview: boolean) {
    const client = createContentfulClient({ preview });
    const response = await client.getEntries<FishSpeciesSkeleton>({
        content_type: "fishSpecies",
    });
    return response.items;
}

export default async function AboutPage() {
    const { isEnabled } = await draftMode();
    const fishSpecies = await getFishSpecies(isEnabled);

    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <SectionReveal className="mb-16 text-center">
                    <h1 className="mb-6 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-6xl">
                        O Łowisku
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        Zalew Kozłowski to 100 arów czystej natury. Tutaj cisza spotyka się z adrenaliną, a wędkarz staje oko w oko z wymagającym przeciwnikiem.
                    </p>
                </SectionReveal>

                {/* Gamified Fish Section */}
                <SectionReveal className="mb-24" delay={0.2}>
                    <div className="mb-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                        <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                            Poznaj Przeciwnika
                        </h2>
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {fishSpecies.map((fish) => {
                            const image = fish.fields.image as Asset;
                            const imageUrl = image?.fields?.file?.url
                                ? `https:${image.fields.file.url}`
                                : "/ryby/karp.jpg"; // Fallback

                            return (
                                <FishCard
                                    key={fish.sys.id}
                                    name={fish.fields.name}
                                    description={fish.fields.description}
                                    imageSrc={imageUrl}
                                    stats={fish.fields.stats as any}
                                    tags={fish.fields.tags || []}
                                />
                            );
                        })}
                    </div>
                </SectionReveal>

                {/* Algorithm Explanation - LIVE Index Logic */}
                <SectionReveal className="mb-24" delay={0.25}>
                    <div className="mb-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                        <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                            Algorytm "Indeks Brań"
                        </h2>
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    </div>

                    <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 text-white shadow-2xl md:px-12">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-purple-500/10 to-transparent" />
                        <div className="absolute bottom-0 left-0 h-full w-full bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

                        <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
                            <div>
                                <h3 className="mb-6 text-3xl font-bold leading-tight md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">
                                    To nie jest losowa liczba.
                                    <br />
                                    To nauka. 🧪
                                </h3>
                                <p className="mb-8 text-lg text-neutral-300 leading-relaxed">
                                    Nasz system łączy się na żywo z API pogodowym i analizuje 4 kluczowe czynniki wpływające na aktywność ryb.
                                    Algorytm (oparty na teorii solunarnej) przelicza dane w czasie rzeczywistym, dając Ci przewagę nad wodą.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {/* Factor 1 */}
                                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                                            <Gauge className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold">Ciśnienie</span>
                                    </div>
                                    <p className="text-sm text-neutral-400">Stabilne, wysokie ciśnienie (1015+ hPa) pobudza ryby do żerowania. Nagłe spadki je "usypiają".</p>
                                </div>

                                {/* Factor 2 */}
                                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                                            <Moon className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold">Faza Księżyca</span>
                                    </div>
                                    <p className="text-sm text-neutral-400">Pełnia i Nów to momenty szczytowej aktywności (teoria solunarna). Ryby czują grawitację.</p>
                                </div>

                                {/* Factor 3 */}
                                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="rounded-lg bg-teal-500/20 p-2 text-teal-400">
                                            <Wind className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold">Wiatr</span>
                                    </div>
                                    <p className="text-sm text-neutral-400">Lekki wiatr natlenia wodę i maskuje obecność wędkarza. Silny wiatr (&gt;30km/h) utrudnia łowy.</p>
                                </div>

                                {/* Factor 4 */}
                                <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="rounded-lg bg-orange-500/20 p-2 text-orange-400">
                                            <ThermometerSun className="h-6 w-6" />
                                        </div>
                                        <span className="font-bold">Sezon</span>
                                    </div>
                                    <p className="text-sm text-neutral-400">Wiosenne przebudzenie (III-V) i jesienne żerowanie (IX-X) to bonusowe punkty do wyniku.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionReveal>
                <SectionReveal className="mb-24" delay={0.3}>
                    <div className="rounded-3xl bg-pine-green p-8 text-white shadow-2xl md:p-12 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('/krajobraz.jpg')] bg-cover bg-center opacity-10" />
                        <div className="relative z-10">
                            <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">Dlaczego Warto?</h2>
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-sunset-orange transition-colors">
                                        <Leaf className="h-8 w-8 text-green-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold">Dzika Natura</h3>
                                    <p className="opacity-80">Cisza, spokój i otoczenie zieleni. Idealne miejsce na ucieczkę od miasta.</p>
                                </div>
                                <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-sunset-orange transition-colors">
                                        <Trophy className="h-8 w-8 text-yellow-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold">Duże Okazy</h3>
                                    <p className="opacity-80">Regularne zarybienia i zasada No Kill sprawiają, że ryby rosną do imponujących rozmiarów.</p>
                                </div>
                                <div className="text-center group hover:-translate-y-2 transition-transform duration-300">
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-sunset-orange transition-colors">
                                        <ShieldCheck className="h-8 w-8 text-blue-400 group-hover:text-white" />
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold">Bezpieczeństwo</h3>
                                    <p className="opacity-80">Teren monitorowany 24/7. Bezpieczne parkowanie i wygodne stanowiska.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionReveal>

                {/* Modern Seasonal Guide with Icons */}
                <SectionReveal delay={0.4}>
                    <div className="mb-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                        <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                            Kalendarz Natury
                        </h2>
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            { name: "Wiosna", months: "III - V", desc: "Przebudzenie. Karaś i Leszcz biorą delikatnie.", color: "bg-green-500", Icon: Sprout, iconColor: "text-green-600" },
                            { name: "Lato", months: "VI - VIII", desc: "Szczyt sezonu. Karp i Amur walczą najmocniej.", color: "bg-yellow-500", Icon: Sun, iconColor: "text-yellow-600" },
                            { name: "Jesień", months: "IX - XI", desc: "Czas drapieżnika. Szczupak żeruje przed zimą.", color: "bg-orange-500", Icon: CloudRain, iconColor: "text-orange-600" },
                            { name: "Zima", months: "XII - II", desc: "Cisza na wodzie. Czas na regenerację łowiska.", color: "bg-blue-500", Icon: Snowflake, iconColor: "text-blue-600" }
                        ].map((season) => (
                            <div key={season.name} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm hover:shadow-xl dark:bg-white/5 transition-all hover:-translate-y-2 border border-transparent hover:border-black/5 dark:hover:border-white/10">
                                <div className={`absolute top-0 left-0 w-1 h-full ${season.color} transition-all duration-300 group-hover:w-2`} />
                                <div className="mb-4 flex justify-between items-start">
                                    <div className={`p-2 rounded-lg bg-neutral-50 dark:bg-white/5 ${season.iconColor} dark:text-white`}>
                                        <season.Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-neutral-400 bg-neutral-100 dark:bg-white/10 px-2 py-1 rounded">{season.months}</span>
                                </div>
                                <h3 className="text-lg font-bold text-pine-green dark:text-white uppercase mb-1">{season.name}</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">{season.desc}</p>
                            </div>
                        ))}
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
