"use client";

import { TiltCard } from "@/components/ui/TiltCard";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { WebGLCaustics } from "@/components/ui/WebGLCaustics";
import { 
    ArrowRight, 
    CloudSun, 
    CloudRain, 
    Sun, 
    Cloud, 
    Wind, 
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

export const WeatherBentoCard = ({ className, weather }: WeatherBentoCardProps) => {
    const t = useTranslations("weather");

    // Helper to pick main icon
    const StatusIcon = (() => {
        if (!weather) return CloudSun;
        if (weather.rain > 0) return CloudRain;
        if (weather.cloudCover > 80) return Cloud;
        if (weather.cloudCover < 20) return Sun;
        return CloudSun;
    })();

    // Homepage Bento card always displays general score
    const activeScore = weather?.score ?? 50;
    const activeLabel = weather?.label ?? "Średnia Aktywność";

    // Centralized color from bite-index-theme.ts driven by the active score
    const glowColor = getGlowColorForScore(activeScore);

    // SVG Sparkline Settings
    const hourlyData = weather?.hourlyForecast || [];
    const svgWidth = 500;
    const svgHeight = 35;
    const paddingX = 10;
    const paddingY = 5;
    const chartW = svgWidth - 2 * paddingX;
    const chartH = svgHeight - 2 * paddingY;

    const points = hourlyData.map((item, idx) => {
        const x = paddingX + (idx / (hourlyData.length - 1)) * chartW;
        // Invert Y axis because 0 is at the top in SVG
        const y = svgHeight - paddingY - (item.score / 100) * chartH;
        return { x, y };
    });

    let linePathD = "";
    let areaPathD = "";
    if (points.length > 0) {
        linePathD = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(" ");
        areaPathD = `${linePathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;
    }

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

            {/* Content Container */}
            <div className="bento-parallax-content-static relative z-20 p-4 pb-12 h-full flex flex-col justify-between text-white">
                
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="text-lg md:text-xl font-bold text-white shadow-black/20 drop-shadow-md group-hover:translate-x-1 transition-transform duration-300">
                                {t("chart_title")}
                            </h3>
                            <div className="flex items-center justify-center rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse border border-red-500/50">
                                LIVE
                            </div>
                        </div>
                        <p className="text-xs text-white/70 font-medium">
                            {t("wind") === "Wind" ? "Kozłowski Reservoir • Solunar Index" : "Zalew Kozłowski • Indeks Solunarny"}
                        </p>
                    </div>
                    {/* Icon */}
                    <div className="rounded-full bg-white/10 p-2 backdrop-blur-md border border-white/20 text-white shadow-lg group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 shrink-0">
                        <StatusIcon className="h-4.5 w-4.5" />
                    </div>
                </div>

                {/* Main Score Display */}
                <div className="flex-1 flex flex-col justify-center items-center my-4 group-hover:scale-102 transition-all duration-300">
                    {weather && (
                        <div className="text-center">
                            <div className="flex items-baseline justify-center gap-1 px-2">
                                <span className="text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-white/60 drop-shadow-sm">
                                    {activeScore}
                                </span>
                                <span className="text-base md:text-xl text-white/60 font-medium">/100</span>
                            </div>
                            <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 backdrop-blur-md">
                                <span className="text-xs md:text-sm font-bold text-white drop-shadow-md">
                                    {t(`labels.${activeLabel}`)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sparkline (Neon Trend Line) */}
                {points.length > 0 && (
                    <div className="w-full my-2 px-1 opacity-85 group-hover:opacity-100 transition-opacity duration-300">
                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="w-full h-auto pointer-events-none"
                        >
                            <defs>
                                <linearGradient id={`sparklineGradient`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.3" />
                                    <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.0" />
                                </linearGradient>
                                <linearGradient id={`sparklineLineGradient`} x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.6" />
                                    <stop offset="50%" stopColor={`rgb(${glowColor})`} stopOpacity="1.0" />
                                    <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.6" />
                                </linearGradient>
                            </defs>
                            <path d={areaPathD} fill={`url(#sparklineGradient)`} />
                            <path d={linePathD} fill="none" stroke={`url(#sparklineLineGradient)`} strokeWidth="2.5" strokeLinecap="round" />
                            <path d={linePathD} fill="none" stroke={`rgb(${glowColor})`} strokeWidth="5" strokeLinecap="round" strokeOpacity="0.15" />
                        </svg>
                    </div>
                )}

                {/* Simplified Weather Grid (3 Core Parameters) */}
                {weather && (
                    <div className="w-full grid grid-cols-3 gap-x-2 border-t border-white/10 pt-3 bg-black/15 rounded-xl p-2 backdrop-blur-sm mx-auto mt-2">
                        {/* 1. Temp */}
                        <div className="flex flex-col items-center justify-center border-r border-white/10">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Thermometer className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("temp")}</span>
                            </div>
                            <span className="text-sm md:text-base font-bold text-white leading-none">{weather.temperature}°C</span>
                        </div>

                        {/* 2. Wind */}
                        <div className="flex flex-col items-center justify-center border-r border-white/10">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Wind className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("wind")}</span>
                            </div>
                            <span className="text-sm md:text-base font-bold text-white leading-none">
                                {weather.windSpeed} <span className="text-[9px] font-normal opacity-70">{t("kmh")}</span>
                            </span>
                        </div>

                        {/* 3. Pressure */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center gap-1 mb-0.5 opacity-60">
                                <Gauge className="h-3 w-3" />
                                <span className="text-[9px] uppercase font-bold">{t("pressure")}</span>
                            </div>
                            <span className="text-sm md:text-base font-bold text-white leading-none">
                                {weather.pressure} <span className="text-[9px] font-normal opacity-70">{t("hpa")}</span>
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
