"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { SPRING_TOKENS } from "@/lib/motion";
import { 
    Gauge, 
    Moon, 
    Wind, 
    Thermometer, 
    Cloud, 
    Droplets, 
    Sun,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/app/actions/weather";
import { getGlowColorForScore } from "@/lib/bite-index-theme";
import { useTranslations } from "next-intl";

interface SolunarDashboardProps {
    weather: WeatherData;
}

type ModeType = "general" | "carp" | "predator";

export const SolunarDashboard = ({ weather }: SolunarDashboardProps) => {
    const t = useTranslations("weather");
    const tAbout = useTranslations("about");
    const [activeMode, setActiveMode] = useState<ModeType>("general");
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Species scores & labels
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

    const glowColor = getGlowColorForScore(activeScore);

    const modes = [
        { id: "general", label: t("idx_general") },
        { id: "carp", label: t("idx_carp") },
        { id: "predator", label: t("idx_predator") }
    ] as const;

    // SVG Line Chart Settings
    const hourlyData = weather?.hourlyForecast || [];
    const svgWidth = 600;
    const svgHeight = 220;
    const paddingX = 40;
    const paddingY = 30;
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

    // Dynamic advice/tips based on species and score
    const speciesAdvice = (() => {
        if (activeMode === "carp") {
            if (activeScore > 75) {
                return tAbout("carp_tip_high") || "Warunki dla karpi są znakomite. Optymalna temperatura i stabilne ciśnienie pobudzają ryby do intensywnego żerowania.";
            } else if (activeScore < 45) {
                return tAbout("carp_tip_low") || "Niska temperatura wody lub gwałtowny spadek ciśnienia osłabiły aktywność karpi. Wybierz głębsze stanowiska i delikatniejsze zestawy.";
            }
            return tAbout("carp_tip_mid") || "Umiarkowana aktywność karpi. Szukaj ryb w okolicach zwalonych drzew i zarośli, nęć punktowo i precyzyjnie.";
        }
        if (activeMode === "predator") {
            if (activeScore > 75) {
                return tAbout("predator_tip_high") || "Rewelacyjne warunki na szczupaka i sandacza. Silniejszy wiatr i zachmurzenie ułatwiają drapieżnikom wzrokowe polowanie.";
            } else if (activeScore < 45) {
                return tAbout("predator_tip_low") || "Czyste niebo i upał zniechęcają drapieżniki. Spróbuj łowić wczesnym świtem lub o zmierzchu w cieniu roślinności.";
            }
            return tAbout("predator_tip_mid") || "Przeciętne warunki na szczupaka. Używaj naturalnych przynęt i aktywnie obławiaj zróżnicowane strefy głębokości.";
        }
        // General
        if (activeScore > 75) {
            return tAbout("general_tip_high") || "Świetne warunki solunarne i meteorologiczne dla większości gatunków ryb. Idealny czas na zasiadkę.";
        } else if (activeScore < 45) {
            return tAbout("general_tip_low") || "Niesprzyjające ciśnienie lub drastyczne skoki temperatur. Ryby mogą brać bardzo kapryśnie.";
        }
        return tAbout("general_tip_mid") || "Typowe warunki nad wodą. Sukces zależy od wyboru odpowiedniego stanowiska oraz doboru właściwej zanęty.";
    })();

    return (
        <SectionReveal className="mb-24" delay={0.25}>
            {/* Section Header */}
            <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                    {tAbout("live_index_title")}
                </h2>
                <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
            </div>

            {/* Dashboard Box */}
            <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-8 text-white shadow-2xl md:p-10 border border-white/5">
                {/* Background glow dynamic gradient */}
                <div 
                    className="absolute inset-0 transition-all duration-1000 animate-pulse-subtle pointer-events-none" 
                    style={{
                        background: `radial-gradient(circle at top right, rgba(${glowColor}, 0.22) 0%, rgba(${glowColor}, 0.03) 60%, transparent 100%)`
                    }}
                />
                <div className="absolute bottom-0 left-0 h-full w-full bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 grid gap-8 lg:grid-cols-12">
                    
                    {/* Left Column: Switcher & Full Weather Grid */}
                    <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                        <div>
                            {/* Species Segmented Switcher */}
                            <div className="rounded-xl border border-white/10 bg-black/40 p-1 flex gap-1 relative z-30 mb-6">
                                {modes.map((mode) => {
                                    const isActive = activeMode === mode.id;
                                    return (
                                        <button
                                            key={mode.id}
                                            onClick={() => setActiveMode(mode.id)}
                                            className={cn(
                                                "relative flex-1 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center transition-all cursor-pointer rounded-lg focus-visible:outline-hidden",
                                                isActive ? "text-white" : "text-white/50 hover:text-white/80"
                                            )}
                                        >
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-dashboard-species"
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

                            {/* Active Score Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-baseline gap-1">
                                    <span 
                                        className="text-6xl font-black tracking-tight drop-shadow-md transition-colors duration-500"
                                        style={{ color: `rgb(${glowColor})` }}
                                    >
                                        {activeScore}
                                    </span>
                                    <span className="text-xl text-white/50 font-bold">/100</span>
                                </div>
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                                        <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: `rgb(${glowColor})` }} />
                                        <span className="text-xs font-black uppercase tracking-wider text-white">
                                            {t(`labels.${activeLabel}`)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/60 font-bold uppercase mt-1 tracking-widest">
                                        {activeMode === "general" ? t("idx_general") : (activeMode === "carp" ? t("idx_carp") : t("idx_predator"))}
                                    </p>
                                </div>
                            </div>

                            {/* Species contextual advice */}
                            <div className="rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-xs flex gap-3 items-start">
                                <Info className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                                    {speciesAdvice}
                                </p>
                            </div>
                        </div>

                        {/* Full 6-Parameter Weather Grid */}
                        <div className="grid grid-cols-3 gap-3 bg-black/25 rounded-2xl p-4 border border-white/5 backdrop-blur-xs">
                            {/* 1. Temp */}
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/2">
                                <Thermometer className="h-4 w-4 text-orange-400 mb-1" />
                                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60 mb-0.5">{t("temp")}</span>
                                <span className="text-sm font-black text-white">{weather.temperature}°C</span>
                            </div>

                            {/* 2. Wind */}
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/2">
                                <Wind className="h-4 w-4 text-blue-400 mb-1" />
                                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60 mb-0.5">{t("wind")}</span>
                                <span className="text-sm font-black text-white text-center leading-tight">
                                    {weather.windSpeed} <span className="text-[8px] font-bold opacity-75">{t("kmh")}</span>
                                </span>
                            </div>

                            {/* 3. Pressure */}
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/2">
                                <Gauge className="h-4 w-4 text-green-400 mb-1" />
                                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60 mb-0.5">{t("pressure")}</span>
                                <span className="text-sm font-black text-white text-center leading-tight">
                                    {weather.pressure} <span className="text-[8px] font-bold opacity-75">{t("hpa")}</span>
                                </span>
                            </div>

                            {/* 4. Humidity */}
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/2">
                                <Droplets className="h-4 w-4 text-teal-400 mb-1" />
                                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60 mb-0.5">
                                    {t("humidity") === "Humidity" ? "Humid." : "Wilgoć"}
                                </span>
                                <span className="text-sm font-black text-white">{weather.humidity}%</span>
                            </div>

                            {/* 5. Clouds */}
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/2">
                                <Cloud className="h-4 w-4 text-neutral-400 mb-1" />
                                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60 mb-0.5">
                                    {t("humidity") === "Humidity" ? "Clouds" : "Chmury"}
                                </span>
                                <span className="text-sm font-black text-white">{weather.cloudCover}%</span>
                            </div>

                            {/* 6. Moon Phase */}
                            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/2 text-center">
                                <Moon className="h-4 w-4 text-purple-400 mb-1" />
                                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60 mb-0.5">
                                    {t("humidity") === "Humidity" ? "Moon" : "Księżyc"}
                                </span>
                                <span className="text-[10px] font-black text-white leading-tight">
                                    {weather.moonPhase ? t(`moon_phases.${weather.moonPhase}`) : (weather.isDay ? (t("humidity") === "Humidity" ? "Day" : "Dzień") : (t("humidity") === "Humidity" ? "Night" : "Noc"))}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Panoramic Interactive Chart */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                        <div className="mb-4 flex justify-between items-center px-1">
                            <h4 className="text-sm font-black uppercase tracking-wider text-white/80">
                                {t("wind") === "Wind" ? "Hourly Activity Forecast (24h)" : "Prognoza Godzinowa Aktywności (24h)"}
                            </h4>
                            <span className="text-[10px] font-mono opacity-50">Open-Meteo Solunar Model</span>
                        </div>

                        {/* Chart Body Container */}
                        <div className="relative bg-black/35 rounded-2xl p-4 border border-white/5 backdrop-blur-xs flex-1 flex items-center justify-center min-h-[200px]">
                            <svg
                                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                className="w-full h-auto pointer-events-auto"
                            >
                                <defs>
                                    <linearGradient id={`dashboardAreaGradient-${activeMode}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.4" />
                                        <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.0" />
                                    </linearGradient>
                                    <linearGradient id={`dashboardLineGradient-${activeMode}`} x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.7" />
                                        <stop offset="50%" stopColor={`rgb(${glowColor})`} stopOpacity="1.0" />
                                        <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.7" />
                                    </linearGradient>
                                </defs>

                                {/* Y-Axis grid lines & labels */}
                                <g opacity="0.15" stroke="white" strokeWidth="0.5">
                                    <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} />
                                    <line x1={paddingX} y1={paddingY + chartH / 2} x2={svgWidth - paddingX} y2={paddingY + chartH / 2} />
                                    <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} />
                                </g>

                                <g fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold" fontFamily="var(--font-outfit)" textAnchor="end">
                                    <text x={paddingX - 8} y={paddingY + 3}>100%</text>
                                    <text x={paddingX - 8} y={paddingY + chartH / 2 + 3}>50%</text>
                                    <text x={paddingX - 8} y={svgHeight - paddingY + 3}>0%</text>
                                </g>

                                {/* Chart curves */}
                                {points.length > 0 && (
                                    <>
                                        <path d={areaPathD} fill={`url(#dashboardAreaGradient-${activeMode})`} />
                                        <path d={linePathD} fill="none" stroke={`url(#dashboardLineGradient-${activeMode})`} strokeWidth="3" strokeLinecap="round" />
                                        {/* Outer glow */}
                                        <path d={linePathD} fill="none" stroke={`rgb(${glowColor})`} strokeWidth="7" strokeLinecap="round" strokeOpacity="0.15" />
                                    </>
                                )}

                                {/* Interactive vertical pointer and tooltip */}
                                {hoveredIdx !== null && points[hoveredIdx] && (
                                    <g>
                                        {/* Vertical line indicator */}
                                        <line
                                            x1={points[hoveredIdx].x}
                                            y1={paddingY}
                                            x2={points[hoveredIdx].x}
                                            y2={svgHeight - paddingY}
                                            stroke="rgba(255, 255, 255, 0.25)"
                                            strokeWidth="1"
                                            strokeDasharray="4,4"
                                        />
                                        {/* Glowing dot on the curve */}
                                        <circle
                                            cx={points[hoveredIdx].x}
                                            cy={points[hoveredIdx].y}
                                            r="5.5"
                                            fill={`rgb(${glowColor})`}
                                            stroke="white"
                                            strokeWidth="2"
                                            style={{ filter: `drop-shadow(0 0 4px rgba(${glowColor}, 0.5))` }}
                                        />
                                        {/* Tooltip Background */}
                                        <rect
                                            x={Math.max(paddingX, Math.min(svgWidth - paddingX - 70, points[hoveredIdx].x - 35))}
                                            y={Math.max(5, points[hoveredIdx].y - 40)}
                                            width="70"
                                            height="32"
                                            rx="6"
                                            fill="rgba(8, 18, 12, 0.98)"
                                            stroke={`rgba(${glowColor}, 0.6)`}
                                            strokeWidth="1.5"
                                        />
                                        {/* Tooltip Hour Label */}
                                        <text
                                            x={Math.max(paddingX + 35, Math.min(svgWidth - paddingX - 35, points[hoveredIdx].x))}
                                            y={Math.max(5, points[hoveredIdx].y - 40) + 12}
                                            fill="rgba(255,255,255,0.7)"
                                            fontSize="9"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            fontFamily="var(--font-outfit)"
                                        >
                                            {points[hoveredIdx].hour}
                                        </text>
                                        {/* Tooltip Index Value */}
                                        <text
                                            x={Math.max(paddingX + 35, Math.min(svgWidth - paddingX - 35, points[hoveredIdx].x))}
                                            y={Math.max(5, points[hoveredIdx].y - 40) + 26}
                                            fill={`rgb(${glowColor})`}
                                            fontSize="12"
                                            fontWeight="black"
                                            textAnchor="middle"
                                            fontFamily="var(--font-syne)"
                                        >
                                            {points[hoveredIdx].score}%
                                        </text>
                                    </g>
                                )}

                                {/* Bottom Time Labels (X-Axis) */}
                                {points.length > 0 && (
                                    <g fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold" fontFamily="var(--font-outfit)" opacity="0.8">
                                        {/* Start Label */}
                                        <text x={paddingX} y={svgHeight - 10} textAnchor="start">
                                            {t("forecast_label")}: {points[0].hour}
                                        </text>
                                        {/* Middle Label */}
                                        {points[Math.floor(points.length / 2)] && (
                                            <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle">
                                                {points[Math.floor(points.length / 2)].hour}
                                            </text>
                                        )}
                                        {/* End Label */}
                                        <text x={svgWidth - paddingX} y={svgHeight - 10} textAnchor="end">
                                            +{points.length}h
                                        </text>
                                    </g>
                                )}

                                {/* Hover detection zones (invisible vertical bars) */}
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
                        </div>
                    </div>
                </div>
            </div>
        </SectionReveal>
    );
};
