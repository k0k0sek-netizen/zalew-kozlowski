"use client";

import { useWeather } from "@/hooks/useWeather";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ArrowRight, CloudSun, CloudRain, Sun, Cloud, Wind, Droplets, Moon, Sunrise, Sunset, Loader2, Info, Thermometer, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const WeatherBentoCard = ({ className }: { className?: string }) => {
    const { weather, loading } = useWeather();

    // Helper to pick main icon
    const StatusIcon = (() => {
        if (!weather) return CloudSun;
        if (weather.rain > 0) return CloudRain;
        if (weather.cloudCover > 80) return Cloud;
        if (weather.cloudCover < 20) return Sun;
        return CloudSun;
    })();

    // Determine colors based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-purple-500";
        if (score >= 60) return "text-green-500";
        if (score <= 35) return "text-red-500";
        return "text-yellow-500";
    };

    const getBgClass = (score: number) => {
        if (score >= 80) return "bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700"; // Wyśmienite (Purple/Indigo)
        if (score >= 60) return "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700"; // Dobre (Teal/Green)
        if (score <= 35) return "bg-gradient-to-br from-slate-600 via-gray-700 to-zinc-800"; // Słabe (Gary/Dark)
        return "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700"; // Średnie (Blue)
    };

    return (
        <SpotlightCard className={cn("col-span-3 md:col-span-2 w-full overflow-hidden relative group h-full border-none shadow-xl", className)}>

            {/* 1. Dynamic Animated Gradient Background - Grayscale until hover */}
            <div className={cn(
                "absolute inset-0 z-0 h-full w-full bg-size-[400%_400%] md:animate-gradient md:grayscale group-hover:grayscale-0 transition-[filter] duration-1000",
                weather ? getBgClass(weather.score) : "bg-neutral-900"
            )} />

            {/* 2. Abstract Shapes/Noise Overlay */}
            <div className="absolute inset-0 z-0 opacity-50 mix-blend-soft-light md:grayscale group-hover:grayscale-0 transition-all duration-700">
                <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                    <filter id="noiseFilter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.8" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#noiseFilter)" />
                </svg>
            </div>

            {/* 3. Subtle Radial Glow */}
            <div className="absolute -top-1/2 -right-1/2 h-[200%] w-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_50%)] blur-3xl pointer-events-none" />

            {/* Content Container - Compact Padding */}
            <div className="relative z-20 p-4 pb-12 h-full flex flex-col justify-between text-white">

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
                    <div className="rounded-full bg-white/10 p-2 md:p-3 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <StatusIcon className="h-5 w-5" />}
                    </div>
                </div>

                {/* Main Score Display - More Compact */}
                <div className="flex-1 flex flex-col justify-center items-center my-1 group-hover:scale-105 md:grayscale group-hover:grayscale-0 transition-all duration-700">
                    {loading ? (
                        <div className="h-20 w-20 animate-pulse rounded-full bg-white/10" />
                    ) : weather ? (
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
                    ) : null}
                </div>

                {/* Grid of details - Compact Rows (Icon+Label on one line) */}
                {weather && (
                    <div className="grid grid-cols-3 gap-y-3 gap-x-1 border-t border-white/10 pt-3 opacity-100 md:opacity-80 group-hover:opacity-100 bg-black/10 rounded-xl p-2 backdrop-blur-sm mx-auto w-full md:grayscale group-hover:grayscale-0 transition-all duration-700">

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
                            <span className="text-lg font-bold text-white leading-none truncate max-w-[80px]">
                                {weather.moonPhase ? weather.moonPhase : (weather.isDay ? "Dzień" : "Noc")}
                            </span>
                        </div>

                    </div>
                )}
            </div>

            {/* Hover Effect CTA */}
            <div className="pointer-events-none absolute bottom-0 z-20 flex w-full transform-gpu flex-row items-center p-4 transition-all duration-300 translate-y-0 opacity-100 md:translate-y-10 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 justify-end">
                <Link
                    href="/o-lowisku"
                    className="pointer-events-auto flex items-center gap-2 rounded-lg bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-bold text-white shadow-lg border border-white/30 transition-all hover:bg-white/30 hover:scale-105"
                >
                    Szczegóły
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </SpotlightCard>
    );
};
