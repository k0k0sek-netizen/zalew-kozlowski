"use client";

import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { 
    Leaf, 
    Trophy, 
    ShieldCheck, 
    Sprout, 
    Sun, 
    CloudRain, 
    Snowflake 
} from "lucide-react";
import { useTranslations } from "next-intl";
import { WeatherData } from "@/app/actions/weather";
import { SolunarDashboard } from "@/components/features/SolunarDashboard";
import { FishCard } from "@/components/features/FishCard";
import { cn } from "@/lib/utils";

interface QuoteCardProps {
    text: string;
    author: string;
    className?: string;
}

const QuoteCard = ({ text, author, className }: QuoteCardProps) => {
    return (
        <SpotlightCard
            className={cn(
                "relative overflow-hidden rounded-2xl bg-white/40 dark:bg-white/5 border border-earth-brown/10 dark:border-white/10 p-8 flex flex-col justify-between min-h-[260px] transition-all duration-300 group hover:border-accent/30 h-full",
                className
            )}
            style={{
                borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.1)"
            } as any}
        >
            {/* Background elements */}
            <div className="absolute -right-4 -top-8 text-[120px] font-serif font-black text-pine-green/5 dark:text-white/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                ”
            </div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-between h-full">
                <blockquote className="text-base italic text-pine-green-dark dark:text-neutral-200 leading-relaxed font-medium mb-6">
                    &ldquo;{text}&rdquo;
                </blockquote>
                
                <div className="flex items-center gap-3">
                    <span className="h-0.5 w-6 bg-[rgb(var(--active-glow-color,249,115,22))]" />
                    <cite className="not-italic text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        {author}
                    </cite>
                </div>
            </div>
        </SpotlightCard>
    );
};

interface AboutClientProps {
    weather?: WeatherData | null;
    fishSpecies: Array<{
        id: string;
        name: string;
        description: string;
        imageSrc: string;
        stats: {
            strength: number;
            difficulty: number;
            activity: number;
        };
        tags: string[];
        whereToFind?: string;
        favBait?: string;
        lakeRecord?: string;
        priority: boolean;
    }>;
}

export const AboutClient = ({ weather, fishSpecies }: AboutClientProps) => {
    const t = useTranslations("about");

    const karp = fishSpecies.find(f => f.name.toLowerCase().includes("karp") || f.name.toLowerCase().includes("mirror"));
    const amur = fishSpecies.find(f => f.name.toLowerCase().includes("amur") || f.name.toLowerCase().includes("grass"));
    const karas = fishSpecies.find(f => f.name.toLowerCase().includes("karaś") || f.name.toLowerCase().includes("crucian"));
    const szczupak = fishSpecies.find(f => f.name.toLowerCase().includes("szczupak") || f.name.toLowerCase().includes("pike"));

    const specialIds = [karp?.id, amur?.id, karas?.id, szczupak?.id].filter(Boolean);
    const extraFish = fishSpecies.filter(f => !specialIds.includes(f.id));

    return (
        <>
            {/* 1. Solunar Dashboard (Render unconditionally - handles offline state internally) */}
            <SolunarDashboard weather={weather} />

            {/* 2. Gamified Fish Section ("Poznaj Przeciwnika") */}
            <SectionReveal className="mb-24" delay={0.2}>
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                        {t("fish_title")}
                    </h2>
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                </div>

                <div className="grid gap-8 grid-cols-1 md:grid-cols-12 items-stretch">
                    {/* Karp (Featured Horizontal) */}
                    {karp && (
                        <div className="md:col-span-12 lg:col-span-8">
                            <FishCard
                                name={karp.name}
                                description={karp.description}
                                imageSrc={karp.imageSrc}
                                stats={karp.stats}
                                tags={karp.tags}
                                whereToFind={karp.whereToFind}
                                favBait={karp.favBait}
                                lakeRecord={karp.lakeRecord}
                                priority={karp.priority}
                                layout="horizontal"
                            />
                        </div>
                    )}

                    {/* Amur (Vertical) */}
                    {amur && (
                        <div className="md:col-span-6 lg:col-span-4">
                            <FishCard
                                name={amur.name}
                                description={amur.description}
                                imageSrc={amur.imageSrc}
                                stats={amur.stats}
                                tags={amur.tags}
                                whereToFind={amur.whereToFind}
                                favBait={amur.favBait}
                                lakeRecord={amur.lakeRecord}
                                priority={amur.priority}
                                layout="vertical"
                            />
                        </div>
                    )}

                    {/* Quote 1 */}
                    <div className="md:col-span-6 lg:col-span-4">
                        <QuoteCard 
                            text={t("quote_1_text")}
                            author={t("quote_1_author")}
                        />
                    </div>

                    {/* Karaś (Vertical) */}
                    {karas && (
                        <div className="md:col-span-6 lg:col-span-4">
                            <FishCard
                                name={karas.name}
                                description={karas.description}
                                imageSrc={karas.imageSrc}
                                stats={karas.stats}
                                tags={karas.tags}
                                whereToFind={karas.whereToFind}
                                favBait={karas.favBait}
                                lakeRecord={karas.lakeRecord}
                                priority={karas.priority}
                                layout="vertical"
                            />
                        </div>
                    )}

                    {/* Quote 2 */}
                    <div className="md:col-span-6 lg:col-span-4">
                        <QuoteCard 
                            text={t("quote_2_text")}
                            author={t("quote_2_author")}
                        />
                    </div>

                    {/* Szczupak (Featured Horizontal-Reverse) */}
                    {szczupak && (
                        <div className="md:col-span-12 lg:col-span-8">
                            <FishCard
                                name={szczupak.name}
                                description={szczupak.description}
                                imageSrc={szczupak.imageSrc}
                                stats={szczupak.stats}
                                tags={szczupak.tags}
                                whereToFind={szczupak.whereToFind}
                                favBait={szczupak.favBait}
                                lakeRecord={szczupak.lakeRecord}
                                priority={szczupak.priority}
                                layout="horizontal-reverse"
                            />
                        </div>
                    )}

                    {/* Render extra fish if any exist */}
                    {extraFish.map((fish) => (
                        <div key={fish.id} className="md:col-span-6 lg:col-span-4">
                            <FishCard
                                name={fish.name}
                                description={fish.description}
                                imageSrc={fish.imageSrc}
                                stats={fish.stats}
                                tags={fish.tags}
                                whereToFind={fish.whereToFind}
                                favBait={fish.favBait}
                                lakeRecord={fish.lakeRecord}
                                priority={fish.priority}
                                layout="vertical"
                            />
                        </div>
                    ))}
                </div>
            </SectionReveal>


            {/* Bento Grid: Dlaczego Warto? */}
            <SectionReveal className="mb-24" delay={0.3}>
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                        {t("why_worth")}
                    </h2>
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                </div>

                <div className="grid gap-6 md:grid-cols-12">
                    {/* Karta 1: Dzika Natura */}
                    <SpotlightCard 
                        className="md:col-span-8 rounded-3xl p-8 md:p-10 relative overflow-hidden group border"
                        style={{ borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.15)" }}
                    >
                        <div className="absolute inset-0 bg-[url('/krajobraz.jpg')] bg-cover bg-center opacity-5 dark:opacity-10 group-hover:scale-105 transition-transform duration-700 pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center h-full justify-between">
                            <div className="space-y-4 max-w-md">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/20 shadow-xs">
                                    <Leaf className="h-6 w-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-pine-green-dark dark:text-white">{t("card_nature_title")}</h3>
                                <p className="text-sm text-earth-brown dark:text-neutral-300 leading-relaxed">
                                    {t("card_nature_desc")}
                                </p>
                            </div>
                            <div className="hidden md:flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                                <Leaf className="h-12 w-12 text-green-500/30 animate-pulse" />
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Karta 2: Duże Okazy */}
                    <SpotlightCard 
                        className="md:col-span-4 rounded-3xl p-8 relative overflow-hidden group border"
                        style={{ borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.15)" }}
                    >
                        <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 shadow-xs">
                                <Trophy className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-pine-green-dark dark:text-white mb-2">{t("card_trophy_title")}</h3>
                                <p className="text-sm text-earth-brown dark:text-neutral-300 leading-relaxed">
                                    {t("card_trophy_desc")}
                                </p>
                            </div>
                        </div>
                    </SpotlightCard>

                    {/* Karta 3: Bezpieczeństwo */}
                    <SpotlightCard 
                        className="md:col-span-12 rounded-3xl p-8 relative overflow-hidden group border"
                        style={{ borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.15)" }}
                    >
                        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex gap-4 items-start md:items-center">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
                                    <ShieldCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-pine-green-dark dark:text-white">{t("card_security_title")}</h3>
                                    <p className="text-sm text-earth-brown dark:text-neutral-300 leading-relaxed mt-1">
                                        {t("card_security_desc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                </div>
            </SectionReveal>

            {/* Modern Seasonal Guide with Icons */}
            <SectionReveal delay={0.4}>
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                        {t("nature_calendar")}
                    </h2>
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { name: t("spring"), months: t("spring_months"), desc: t("spring_desc"), color: "from-green-500 to-emerald-600", Icon: Sprout, iconColor: "text-green-600 dark:text-green-400", bgIcon: "bg-green-500/10 dark:bg-green-500/20" },
                        { name: t("summer"), months: t("summer_months"), desc: t("summer_desc"), color: "from-yellow-500 to-amber-600", Icon: Sun, iconColor: "text-yellow-600 dark:text-yellow-400", bgIcon: "bg-yellow-500/10 dark:bg-yellow-500/20" },
                        { name: t("autumn"), months: t("autumn_months"), desc: t("autumn_desc"), color: "from-orange-500 to-red-600", Icon: CloudRain, iconColor: "text-orange-600 dark:text-orange-400", bgIcon: "bg-orange-500/10 dark:bg-orange-500/20" },
                        { name: t("winter"), months: t("winter_months"), desc: t("winter_desc"), color: "from-blue-500 to-indigo-600", Icon: Snowflake, iconColor: "text-blue-600 dark:text-blue-400", bgIcon: "bg-blue-500/10 dark:bg-blue-500/20" }
                    ].map((season) => (
                        <SpotlightCard 
                            key={season.name} 
                            className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm dark:bg-white/5 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${season.color} transition-all duration-300 group-hover:w-1.5`} />
                                <div className="mb-4 flex justify-between items-start pl-2">
                                    <div className={`p-2 rounded-lg ${season.bgIcon} ${season.iconColor}`}>
                                        <season.Icon className="h-6 w-6" />
                                    </div>
                                    <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/10 px-2 py-1 rounded">
                                        {season.months}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-pine-green-dark dark:text-white uppercase mb-1 pl-2">
                                    {season.name}
                                </h3>
                                <p className="text-sm text-earth-brown dark:text-neutral-300 leading-relaxed pl-2">
                                    {season.desc}
                                </p>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>
            </SectionReveal>
        </>
    );
};
