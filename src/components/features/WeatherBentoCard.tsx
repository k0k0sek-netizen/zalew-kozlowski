"use client";

import { TiltCard } from "@/components/ui/TiltCard";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { WebGLCaustics } from "@/components/ui/WebGLCaustics";
import { ArrowRight, CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, Moon, Thermometer, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/app/actions/weather";
import { getGlowColorForScore } from "@/lib/bite-index-theme";

interface WeatherBentoCardProps {
    className?: string;
    weather: WeatherData;
}

export const WeatherBentoCard = ({ className, weather }: WeatherBentoCardProps) => {
    // Helper to pick main icon
    const StatusIcon = (() => {
        if (!weather) return CloudSun;
        if (weather.rain > 0) return CloudRain;
        if (weather.cloudCover > 80) return Cloud;
        if (weather.cloudCover < 20) return Sun;
        return CloudSun;
    })();

    // Centralized color from bite-index-theme.ts
    const glowColor = getGlowColorForScore(weather?.score ?? 50);

    return (
        <TiltCard
            glowColor={weather ? glowColor : "59, 130, 246"}
            className={cn("col-span-3 md:col-span-2 w-full overflow-hidden relative group h-full border-none shadow-xl", className)}
        >

            {/* 1. Dark base — always visible, fallback if WebGL fails */}
            <div className="absolute inset-0 z-0 bg-neutral-950" />

            {/* 2. WebGL Water Caustics — color & speed driven by score */}
            <WebGLCaustics
                glowColor={glowColor}
                score={weather?.score ?? 50}
                className="z-[1] opacity-90"
            />

            {/* 3. Subtle dark vignette overlay so text stays readable */}
            <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/60 via-black/10 to-black/20 pointer-events-none" />

            {/* Content Container - Compact Padding */}
            <div className="bento-parallax-content-static relative z-20 p-4 pb-12 h-full flex flex-col justify-between text-white">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-lg md:text-xl font-bold text-white shadow-black/20 drop-shadow-md group-hover:translate-x-1 transition-transform duration-300">
                                Indeks Brań
                            </h3>
                            <div className="flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse border border-red-500/50">
                                LIVE
                            </div>
                        </div>
                        <p className="text-xs md:text-sm text-white/70 font-medium group-hover:text-white/90 transition-colors">
                            Zalew Kozłowski • Prognoza
                        </p>
                    </div>
                    {/* Icon */}
                    <div className="rounded-full bg-white/10 p-2 md:p-3 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 cubic-bezier-spring">
                        <StatusIcon className="h-5 w-5" />
                    </div>
                </div>

                {/* Main Score Display - More Compact */}
                <div className="flex-1 flex flex-col justify-center items-center my-1 group-hover:scale-105 transition-all duration-300">
                    {weather && (
                        <div className="text-center">
                            <div className="flex items-baseline justify-center gap-1 px-2">
                                <span className="text-5xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 drop-shadow-sm">
                                    {weather.score}
                                </span>
                                <span className="text-lg md:text-2xl text-white/60 font-medium">/100</span>
                            </div>
                            <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 backdrop-blur-md">
                                <span className="text-base md:text-lg font-bold text-white drop-shadow-md">
                                    {weather.label}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Grid of details - Compact Rows (Icon+Label on one line) */}
                {weather && (
                    <div className="grid grid-cols-3 gap-y-3 gap-x-1 border-t border-white/10 pt-3 opacity-100 md:opacity-90 group-hover:opacity-100 bg-black/15 rounded-xl p-2 backdrop-blur-sm mx-auto w-full transition-all duration-300">

                        {/* 1. Temp */}
                        <div className="flex flex-col items-center justify-center border-r border-white/10">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Thermometer className="h-3.5 w-3.5" />
                                <span className="text-[9px] uppercase font-bold">Temp.</span>
                            </div>
                            <span className="text-lg font-bold text-white leading-none">{weather.temperature}°C</span>
                        </div>

                        {/* 2. Wind */}
                        <div className="flex flex-col items-center justify-center border-r border-white/10">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Wind className="h-3.5 w-3.5" />
                                <span className="text-[9px] uppercase font-bold">Wiatr</span>
                            </div>
                            <span className="text-lg font-bold text-white leading-none">{weather.windSpeed} <span className="text-[10px] font-normal opacity-70">km/h</span></span>
                        </div>

                        {/* 3. Pressure */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Gauge className="h-3.5 w-3.5" />
                                <span className="text-[9px] uppercase font-bold">Ciśnienie</span>
                            </div>
                            <span className="text-lg font-bold text-white leading-none">{weather.pressure} <span className="text-[10px] font-normal opacity-70">hPa</span></span>
                        </div>

                        {/* 4. Humidity */}
                        <div className="flex flex-col items-center justify-center border-r border-t border-white/10 pt-2 mt-1">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Droplets className="h-3.5 w-3.5" />
                                <span className="text-[9px] uppercase font-bold">Wilgoć</span>
                            </div>
                            <span className="text-lg font-bold text-white leading-none">{weather.humidity}%</span>
                        </div>

                        {/* 5. Clouds */}
                        <div className="flex flex-col items-center justify-center border-r border-t border-white/10 pt-2 mt-1">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Cloud className="h-3.5 w-3.5" />
                                <span className="text-[9px] uppercase font-bold">Chmury</span>
                            </div>
                            <span className="text-lg font-bold text-white leading-none">{weather.cloudCover}%</span>
                        </div>

                        {/* 6. Phase */}
                        <div className="flex flex-col items-center justify-center border-t border-white/10 pt-2 mt-1">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                {weather.moonPhase ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
                                <span className="text-[9px] uppercase font-bold">Faza</span>
                            </div>
                            <span className="text-sm md:text-base font-bold text-white leading-none text-center">
                                {weather.moonPhase ? weather.moonPhase : (weather.isDay ? "Dzień" : "Noc")}
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
                    Szczegóły
                    <ArrowRight className="h-4 w-4" />
                </TransitionLink>
            </div>
        </TiltCard>
    );
};
