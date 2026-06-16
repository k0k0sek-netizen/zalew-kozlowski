"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
type ViewModeType = "details" | "chart";

export const WeatherBentoCard = ({ className, weather }: WeatherBentoCardProps) => {
    const t = useTranslations("weather");
    const [activeMode, setActiveMode] = useState<ModeType>("general");
    const [viewMode, setViewMode] = useState<ViewModeType>("details");
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

    // SVG Line Chart Settings
    const hourlyData = weather?.hourlyForecast || [];
    const svgWidth = 500;
    const svgHeight = 120;
    const paddingX = 20;
    const paddingY = 15;
    const chartW = svgWidth - 2 * paddingX;
    const chartH = svgHeight - 2 * paddingY;

    const points = hourlyData.map((item, idx) => {
        const score = activeMode === "carp" ? item.carpScore : (activeMode === "predator" ? item.predatorScore : item.score);
        const x = paddingX + (idx / (hourlyData.length - 1)) * chartW;
        // Invert Y axis because 0 is at the top in SVG
        const y = svgHeight - paddingY - (score / 100) * chartH;
        return { x, y, score, hour: item.hourLabel };
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

                {/* Main Score Display */}
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
                                <span className="text-xs md:text-sm font-bold text-white drop-shadow-md">
                                    {t(`labels.${activeLabel}`)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Toggle for chart vs details */}
                <div className="flex justify-between items-center mt-4 mb-2 px-1 relative z-30">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                        {viewMode === "chart" ? t("chart_title") : t("details_title")}
                    </div>
                    <div className="flex gap-0.5 bg-black/40 p-0.5 rounded-lg border border-white/5 relative">
                        <button
                            onClick={() => setViewMode("details")}
                            className={cn(
                                "relative px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer z-10",
                                viewMode === "details" ? "text-white" : "text-white/40 hover:text-white/70"
                            )}
                        >
                            {viewMode === "details" && (
                                <motion.div
                                    layoutId="weather-view-mode-active"
                                    className="absolute inset-0 bg-white/10 rounded-md z-0"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{t("details_tab")}</span>
                        </button>
                        <button
                            onClick={() => setViewMode("chart")}
                            className={cn(
                                "relative px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer z-10",
                                viewMode === "chart" ? "text-white" : "text-white/40 hover:text-white/70"
                            )}
                        >
                            {viewMode === "chart" && (
                                <motion.div
                                    layoutId="weather-view-mode-active"
                                    className="absolute inset-0 bg-white/10 rounded-md z-0"
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                />
                            )}
                            <span className="relative z-10">{t("chart_tab")}</span>
                        </button>
                    </div>
                </div>

                {/* Content Area (Details Grid or SVG Chart) */}
                <div className="min-h-[120px] relative z-30 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {viewMode === "details" ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="w-full grid grid-cols-3 gap-y-3 gap-x-1 border-t border-white/10 pt-3 bg-black/15 rounded-xl p-2 backdrop-blur-sm mx-auto transition-all duration-300"
                            >
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chart"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="w-full relative flex flex-col items-center bg-black/25 border border-white/5 rounded-xl p-2 pb-1.5 backdrop-blur-sm"
                            >
                                <svg
                                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                    className="w-full h-auto pointer-events-none"
                                >
                                    <defs>
                                        <linearGradient id={`areaGradient-${activeMode}`} x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.45" />
                                            <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.0" />
                                        </linearGradient>
                                        <linearGradient id={`lineGradient-${activeMode}`} x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.75" />
                                            <stop offset="50%" stopColor={`rgb(${glowColor})`} stopOpacity="1.0" />
                                            <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.75" />
                                        </linearGradient>
                                    </defs>

                                    {/* Grid Lines */}
                                    <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                    <line x1={paddingX} y1={paddingY + chartH / 2} x2={svgWidth - paddingX} y2={paddingY + chartH / 2} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                    <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

                                    {/* Chart Path and Area */}
                                    {points.length > 0 && (
                                        <>
                                            <path d={areaPathD} fill={`url(#areaGradient-${activeMode})`} />
                                            <path d={linePathD} fill="none" stroke={`url(#lineGradient-${activeMode})`} strokeWidth="2.5" strokeLinecap="round" />
                                            
                                            {/* Glow effect on the line */}
                                            <path d={linePathD} fill="none" stroke={`rgb(${glowColor})`} strokeWidth="6" strokeLinecap="round" strokeOpacity="0.15" />
                                        </>
                                    )}

                                    {/* Tooltip & Pointer elements */}
                                    {hoveredIdx !== null && points[hoveredIdx] && (
                                        <g>
                                            {/* Vertical line indicator */}
                                            <line
                                                x1={points[hoveredIdx].x}
                                                y1={paddingY}
                                                x2={points[hoveredIdx].x}
                                                y2={svgHeight - paddingY}
                                                stroke="rgba(255, 255, 255, 0.2)"
                                                strokeWidth="1"
                                                strokeDasharray="3,3"
                                            />
                                            {/* Dot on the point */}
                                            <circle
                                                cx={points[hoveredIdx].x}
                                                cy={points[hoveredIdx].y}
                                                r="4.5"
                                                fill={`rgb(${glowColor})`}
                                                stroke="white"
                                                strokeWidth="1.5"
                                            />
                                            {/* Tooltip Background */}
                                            <rect
                                                x={Math.max(paddingX, Math.min(svgWidth - paddingX - 60, points[hoveredIdx].x - 30))}
                                                y={Math.max(2, points[hoveredIdx].y - 34)}
                                                width="60"
                                                height="26"
                                                rx="4"
                                                fill="rgba(5, 15, 10, 0.95)"
                                                stroke={`rgba(${glowColor}, 0.5)`}
                                                strokeWidth="1"
                                            />
                                            {/* Tooltip Hour */}
                                            <text
                                                x={Math.max(paddingX + 30, Math.min(svgWidth - paddingX - 30, points[hoveredIdx].x))}
                                                y={Math.max(2, points[hoveredIdx].y - 34) + 10}
                                                fill="rgba(255,255,255,0.7)"
                                                fontSize="8"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                                fontFamily="var(--font-outfit)"
                                            >
                                                {points[hoveredIdx].hour}
                                            </text>
                                            {/* Tooltip Score */}
                                            <text
                                                x={Math.max(paddingX + 30, Math.min(svgWidth - paddingX - 30, points[hoveredIdx].x))}
                                                y={Math.max(2, points[hoveredIdx].y - 34) + 21}
                                                fill={`rgb(${glowColor})`}
                                                fontSize="10"
                                                fontWeight="black"
                                                textAnchor="middle"
                                                fontFamily="var(--font-syne)"
                                            >
                                                {points[hoveredIdx].score}%
                                            </text>
                                        </g>
                                    )}

                                    {/* Time labels below the chart */}
                                    {points.length > 0 && (
                                        <g opacity="0.5">
                                            {/* Start Label */}
                                            <text x={paddingX} y={svgHeight - 2} fill="white" fontSize="7" fontWeight="bold" textAnchor="start" fontFamily="var(--font-outfit)">
                                                {t("forecast_label")}: {points[0].hour}
                                            </text>
                                            {/* Middle Label */}
                                            {points[Math.floor(points.length / 2)] && (
                                                <text x={svgWidth / 2} y={svgHeight - 2} fill="white" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="var(--font-outfit)">
                                                    {points[Math.floor(points.length / 2)].hour}
                                                </text>
                                            )}
                                            {/* End Label */}
                                            <text x={svgWidth - paddingX} y={svgHeight - 2} fill="white" fontSize="7" fontWeight="bold" textAnchor="end" fontFamily="var(--font-outfit)">
                                                +{points.length}h
                                            </text>
                                        </g>
                                    )}

                                    {/* Invisible hover regions for interactive tooltip */}
                                    {points.map((p, idx) => {
                                        const barWidth = chartW / points.length;
                                        return (
                                            <rect
                                                key={idx}
                                                x={p.x - barWidth / 2}
                                                y={paddingY}
                                                width={barWidth}
                                                height={chartH}
                                                fill="transparent"
                                                className="cursor-crosshair pointer-events-auto"
                                                onMouseEnter={() => setHoveredIdx(idx)}
                                                onMouseLeave={() => setHoveredIdx(null)}
                                                onTouchStart={() => setHoveredIdx(idx)}
                                                onTouchEnd={() => setHoveredIdx(null)}
                                            />
                                        );
                                    })}
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
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
