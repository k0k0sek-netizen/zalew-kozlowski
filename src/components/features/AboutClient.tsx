"use client";

import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { 
    Gauge, 
    Moon, 
    Wind, 
    ThermometerSun, 
    Leaf, 
    Trophy, 
    ShieldCheck, 
    Sprout, 
    Sun, 
    CloudRain, 
    Snowflake 
} from "lucide-react";
import { useTranslations } from "next-intl";

export const AboutClient = () => {
    const t = useTranslations("about");

    return (
        <>
            {/* Algorithm Explanation - LIVE Index Logic */}
            <SectionReveal className="mb-24" delay={0.25}>
                <div className="mb-12 flex items-center gap-4">
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                        {t("live_index_title")}
                    </h2>
                    <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                </div>

                <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-12 text-white shadow-2xl md:px-12">
                    {/* Background Effects */}
                    <div 
                        className="absolute inset-0 transition-all duration-1000 animate-pulse-subtle" 
                        style={{
                            background: `radial-gradient(circle at top right, rgba(var(--active-glow-color, 249, 115, 22), 0.2) 0%, rgba(var(--active-glow-color, 249, 115, 22), 0.03) 60%, transparent 100%)`
                        }}
                    />
                    <div className="absolute bottom-0 left-0 h-full w-full bg-[url('/noise.svg')] opacity-20 mix-blend-overlay" />

                    <div className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
                        <div>
                            <h3 className="mb-6 text-3xl font-bold leading-tight md:text-4xl text-transparent bg-clip-text bg-[linear-gradient(110deg,#ffffff,45%,rgb(var(--active-glow-color,249,115,22)),55%,#ffffff)] bg-size-[200%_100%] animate-shine">
                                {t("not_random")}
                                <br />
                                {t("science")}
                            </h3>
                            <p className="mb-8 text-lg text-neutral-300 leading-relaxed">
                                {t("live_index_desc")}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Factor 1 */}
                            <div 
                                className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-default"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.08)";
                                    e.currentTarget.style.borderColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.35)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px -6px rgba(var(--active-glow-color, 249, 115, 22), 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "";
                                    e.currentTarget.style.borderColor = "";
                                    e.currentTarget.style.boxShadow = "";
                                }}
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-blue-500/20 p-2 text-blue-400">
                                        <Gauge className="h-6 w-6" />
                                    </div>
                                    <span className="font-bold">{t("factor_pressure")}</span>
                                </div>
                                <p className="text-sm text-neutral-400">{t("factor_pressure_desc")}</p>
                            </div>

                            {/* Factor 2 */}
                            <div 
                                className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-default"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.08)";
                                    e.currentTarget.style.borderColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.35)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px -6px rgba(var(--active-glow-color, 249, 115, 22), 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "";
                                    e.currentTarget.style.borderColor = "";
                                    e.currentTarget.style.boxShadow = "";
                                }}
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                                        <Moon className="h-6 w-6" />
                                    </div>
                                    <span className="font-bold">{t("factor_moon")}</span>
                                </div>
                                <p className="text-sm text-neutral-400">{t("factor_moon_desc")}</p>
                            </div>

                            {/* Factor 3 */}
                            <div 
                                className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-default"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.08)";
                                    e.currentTarget.style.borderColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.35)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px -6px rgba(var(--active-glow-color, 249, 115, 22), 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "";
                                    e.currentTarget.style.borderColor = "";
                                    e.currentTarget.style.boxShadow = "";
                                }}
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-teal-500/20 p-2 text-teal-400">
                                        <Wind className="h-6 w-6" />
                                    </div>
                                    <span className="font-bold">{t("factor_wind")}</span>
                                </div>
                                <p className="text-sm text-neutral-400">{t("factor_wind_desc")}</p>
                            </div>

                            {/* Factor 4 */}
                            <div 
                                className="rounded-xl bg-white/5 p-4 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-[1.02] cursor-default"
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.08)";
                                    e.currentTarget.style.borderColor = "rgba(var(--active-glow-color, 249, 115, 22), 0.35)";
                                    e.currentTarget.style.boxShadow = "0 8px 20px -6px rgba(var(--active-glow-color, 249, 115, 22), 0.25)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = "";
                                    e.currentTarget.style.borderColor = "";
                                    e.currentTarget.style.boxShadow = "";
                                }}
                            >
                                <div className="mb-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-orange-500/20 p-2 text-orange-400">
                                        <ThermometerSun className="h-6 w-6" />
                                    </div>
                                    <span className="font-bold">{t("factor_season")}</span>
                                </div>
                                <p className="text-sm text-neutral-400">{t("factor_season_desc")}</p>
                            </div>
                        </div>
                    </div>
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
