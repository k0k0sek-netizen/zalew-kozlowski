"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TiltCard } from "@/components/ui/TiltCard";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { WebGLCaustics } from "@/components/ui/WebGLCaustics";
import { SPRING_TOKENS } from "@/lib/motion";
import { 
    ArrowRight, 
    CloudSun, 
    CloudRain, 
    Sun, 
    Cloud, 
    Wind, 
    Droplets, 
    Moon, 
    Thermometer, 
    Gauge 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/app/actions/weather";
import { getGlowColorForScore } from "@/lib/bite-index-theme";
import { useTranslations } from "next-intl";

interface WeatherBentoCardProps {
    className?: string;
    weather: WeatherData;
}

type ModeType = "general" | "carp" | "predator";

export const WeatherBentoCard = ({ className, weather }: WeatherBentoCardProps) => {
    const t = useTranslations("weather");
    const [activeMode, setActiveMode] = useState<ModeType>("general");

    // Helper to pick main icon
    const StatusIcon = (() => {
        if (!weather) return CloudSun;
        if (weather.rain > 0) return CloudRain;
        if (weather.cloudCover > 80) return Cloud;
        if (weather.cloudCover < 20) return Sun;
        return CloudSun;
    })();

    // Get active score & label based on selected species mode
    const activeScore = (() => {
        if (activeMode === "carp") return weather?.carpScore ?? 50;
        if (activeMode === "predator") return weather?.predatorScore ?? 50;
        return weather?.score ?? 50;
    })();

    const activeLabel = (() => {
        if (activeMode === "carp") return weather?.carpLabel ?? "Średnia Aktywność";
        if (activeMode === "predator") return weather?.predatorLabel ?? "Średnia Aktywność";
        return weather?.label ?? "Średnia Aktywność";
    })();

    // Centralized color from bite-index-theme.ts driven by the active score
    const glowColor = getGlowColorForScore(activeScore);

    const modes = [
        { id: "general", label: t("idx_general") },
        { id: "carp", label: t("idx_carp") },
        { id: "predator", label: t("idx_predator") }
    ] as const;

    return (
        <TiltCard
            glowColor={weather ? glowColor : "59, 130, 246"}
            className={cn("col-span-3 md:col-span-2 w-full overflow-hidden relative group h-full border-none shadow-xl", className)}
        >
            {/* 1. Dark base — always visible, fallback if WebGL fails */}
            <div className="absolute inset-0 z-0 bg-neutral-950" />

            {/* 2. WebGL Water Caustics — color & speed driven by active score */}
            <WebGLCaustics
                glowColor={glowColor}
                score={activeScore}
                className="z-[1] opacity-95"
            />

            {/* 3. Subtle dark vignette overlay so text stays readable */}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Content Container - Compact Padding */}
            <div className="bento-parallax-content-static relative z-20 p-4 pb-12 h-full flex flex-col justify-between text-white">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-lg md:text-xl font-bold text-white shadow-black/20 drop-shadow-md group-hover:translate-x-1 transition-transform duration-300">
                                {t("wind") === "Wind" ? "Bite Index" : "Indeks Brań"}
                            </h3>
                            <div className="flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse border border-red-500/50">
                                LIVE
                            </div>
                        </div>
                        <p className="text-xs text-white/70 font-medium">
                            {t("wind") === "Wind" ? "Kozłowski Reservoir • Forecast" : "Zalew Kozłowski • Prognoza"}
                        </p>
                    </div>
                    {/* Icon */}
                    <div className="rounded-full bg-white/10 p-2 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 shrink-0">
                        <StatusIcon className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Species Segmented Switcher */}
                <div className="my-3 rounded-xl border border-white/10 bg-black/30 p-1 flex gap-1 relative z-30">
                    {modes.map((mode) => {
                        const isActive = activeMode === mode.id;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => setActiveMode(mode.id)}
                                className={cn(
                                    "relative flex-1 py-1 text-[10px] font-black uppercase tracking-wider text-center transition-all cursor-pointer rounded-lg focus-visible:outline-hidden",
                                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-weather-mode"
                                        className="absolute inset-0 rounded-lg z-0"
                                        style={{
                                            backgroundImage: `linear-gradient(135deg, rgba(${glowColor}, 0.85) 0%, rgb(${glowColor}) 100%)`,
                                            boxShadow: `0 4px 10px -3px rgba(${glowColor}, 0.4)`
                                        }}
                                        transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                    />
                                )}
                                <span className="relative z-10">{mode.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Score Display - More Compact */}
                <div className="flex-1 flex flex-col justify-center items-center my-1 group-hover:scale-102 transition-all duration-300">
                    {weather && (
                        <div className="text-center">
                            <div className="flex items-baseline justify-center gap-1 px-2">
                                <span className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 drop-shadow-sm">
                                    {activeScore}
                                </span>
                                <span className="text-base md:text-xl text-white/60 font-medium">/100</span>
                            </div>
                            <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 backdrop-blur-md">
                                <span className="text-sm md:text-base font-bold text-white drop-shadow-md">
                                    {t(`labels.${activeLabel}`)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid of details - Compact Rows */}
                {weather && (
                    <div className="grid grid-cols-3 gap-y-3 gap-x-1 border-t border-white/10 pt-3 opacity-100 md:opacity-90 group-hover:opacity-100 bg-black/15 rounded-xl p-2 backdrop-blur-sm mx-auto w-full transition-all duration-300">
                        {/* 1. Temp */}
                        <div className="flex flex-col items-center justify-center border-r border-white/10">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Thermometer className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("temp")}</span>
                            </div>
                            <span className="text-base font-bold text-white leading-none">{weather.temperature}°C</span>
                        </div>

                        {/* 2. Wind */}
                        <div className="flex flex-col items-center justify-center border-r border-white/10">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Wind className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("wind")}</span>
                            </div>
                            <span className="text-base font-bold text-white leading-none">{weather.windSpeed} <span className="text-[10px] font-normal opacity-70">{t("kmh")}</span></span>
                        </div>

                        {/* 3. Pressure */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Gauge className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("pressure")}</span>
                            </div>
                            <span className="text-base font-bold text-white leading-none">{weather.pressure} <span className="text-[10px] font-normal opacity-70">{t("hpa")}</span></span>
                        </div>

                        {/* 4. Humidity */}
                        <div className="flex flex-col items-center justify-center border-r border-t border-white/10 pt-2 mt-1">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Droplets className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("humidity") === "Humidity" ? "Humid." : "Wilgoć"}</span>
                            </div>
                            <span className="text-base font-bold text-white leading-none">{weather.humidity}%</span>
                        </div>

                        {/* 5. Clouds */}
                        <div className="flex flex-col items-center justify-center border-r border-t border-white/10 pt-2 mt-1">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Cloud className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("humidity") === "Humidity" ? "Clouds" : "Chmury"}</span>
                            </div>
                            <span className="text-base font-bold text-white leading-none">{weather.cloudCover}%</span>
                        </div>

                        {/* 6. Phase */}
                        <div className="flex flex-col items-center justify-center border-t border-white/10 pt-2 mt-1">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                {weather.moonPhase ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
                                <span className="text-[9px] uppercase font-bold">{t("humidity") === "Humidity" ? "Phase" : "Faza"}</span>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-white leading-none text-center">
                                {weather.moonPhase ? t(`moon_phases.${weather.moonPhase}`) : (weather.isDay ? (t("humidity") === "Humidity" ? "Day" : "Dzień") : (t("humidity") === "Humidity" ? "Night" : "Noc"))}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Hover Effect CTA */}
            <div className="pointer-events-none absolute bottom-0 z-20 flex w-full transform-gpu flex-row items-center p-4 transition-all duration-300 translate-y-0 opacity-100 md:translate-y-10 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 justify-end">
                <TransitionLink
                    href="/o-lowisku"
                    className="btn-ai-glow pointer-events-auto"
                >
                    {t("humidity") === "Humidity" ? "Details" : "Szczegóły"}
                    <ArrowRight className="h-4 w-4" />
                </TransitionLink>
            </div>
        </TiltCard>
    );
};
