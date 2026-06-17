"use client";

import { useState, useEffect, useRef } from "react";
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
    Info,
    WifiOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/app/actions/weather";
import { getGlowColorForScore } from "@/lib/bite-index-theme";
import { useTranslations } from "next-intl";

interface SolunarDashboardProps {
    weather?: WeatherData | null;
}

type ModeType = "general" | "carp" | "predator";

interface GlossaryTooltipProps {
    term: string;
    definition: string;
    children: React.ReactNode;
}

const GlossaryTooltip = ({ term, definition, children }: GlossaryTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isOpen]);

    const capitalizedTerm = term.charAt(0).toUpperCase() + term.slice(1);

    return (
        <span 
            ref={tooltipRef}
            className="relative inline-block cursor-help group/tooltip select-none"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
            }}
        >
            <span className="underline decoration-dotted decoration-sunset-orange/60 hover:decoration-sunset-orange underline-offset-4 font-semibold text-white/95 transition-colors">
                {children}
            </span>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.span
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-xl border border-white/10 bg-neutral-950/90 p-3 text-xs text-neutral-300 shadow-xl backdrop-blur-md pointer-events-none text-left font-sans normal-case"
                    >
                        <span className="block font-bold text-sunset-orange mb-1 uppercase tracking-wider text-[10px]">
                            {capitalizedTerm}
                        </span>
                        <span className="block leading-relaxed font-medium">
                            {definition}
                        </span>
                        {/* Tooltip Arrow */}
                        <span className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-r border-b border-white/10 bg-neutral-950/90 pointer-events-none" />
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    );
};

export const SolunarDashboard = ({ weather }: SolunarDashboardProps) => {
    const t = useTranslations("weather");
    const tAbout = useTranslations("about");
    const [activeMode, setActiveMode] = useState<ModeType>("general");

    const renderWithGlossary = (text: string) => {
        const terms = [
            {
                key: "temp",
                termPl: "optimum termiczne",
                termEn: "thermal optimum",
            },
            {
                key: "pressure",
                termPl: "pęcherz pławny",
                termEn: "swim bladder",
            },
            {
                key: "humidity",
                termPl: "szał żerowania",
                termEn: "feeding frenzy",
            },
            {
                key: "moon",
                termPl: "siły grawitacyjne",
                termEn: "gravitational forces",
            }
        ];

        for (const item of terms) {
            const term = text.toLowerCase().includes(item.termPl.toLowerCase()) 
                ? item.termPl 
                : (text.toLowerCase().includes(item.termEn.toLowerCase()) ? item.termEn : null);
                
            if (term) {
                const definition = tAbout(`glossary_${item.key}_desc`);
                const index = text.toLowerCase().indexOf(term.toLowerCase());
                const before = text.substring(0, index);
                const match = text.substring(index, index + term.length);
                const after = text.substring(index + term.length);
                
                return (
                    <>
                        {before}
                        <GlossaryTooltip term={match} definition={definition}>
                            {match}
                        </GlossaryTooltip>
                        {after}
                    </>
                );
            }
        }
        
        return text;
    };
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    const isOffline = !weather;

    // Species scores & labels
    const activeScore = (() => {
        if (isOffline) return 50;
        if (activeMode === "carp") return weather?.carpScore ?? 50;
        if (activeMode === "predator") return weather?.predatorScore ?? 50;
        return weather?.score ?? 50;
    })();

    const activeLabel = (() => {
        if (isOffline) return "Średnia Aktywność";
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
        if (isOffline) {
            return tAbout("offline_advice") || "Tryb offline. Algorytm prezentuje uśrednione czynniki solunarne. Połącz się z siecią, aby pobrać prognozę na żywo.";
        }
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

    // 6 Unified Factor Cards (Edukacja + Live)
    const factors = [
        {
            id: "temp",
            title: tAbout("factor_temp") || "Temperatura",
            liveValue: weather ? `${weather.temperature}°C` : null,
            desc: tAbout("factor_temp_desc") || "Każdy gatunek ma swoje optimum termiczne. Zbyt zimna lub gorąca woda zwalnia metabolizm ryb.",
            icon: Thermometer,
            iconColor: "text-orange-400",
            bgIcon: "bg-orange-500/10 border-orange-500/20"
        },
        {
            id: "wind",
            title: tAbout("factor_wind") || "Wiatr",
            liveValue: weather ? `${weather.windSpeed} km/h` : null,
            desc: tAbout("factor_wind_desc") || "Lekki wiatr natlenia wodę i maskuje wędkarza. Silny wiatr (>30 km/h) utrudnia dalekie rzuty i nęcenie.",
            icon: Wind,
            iconColor: "text-blue-400",
            bgIcon: "bg-blue-500/10 border-blue-500/20"
        },
        {
            id: "pressure",
            title: tAbout("factor_pressure") || "Ciśnienie",
            liveValue: weather ? `${weather.pressure} hPa` : null,
            desc: tAbout("factor_pressure_desc") || "Stabilne ciśnienie sprzyja żerowaniu. Gwałtowne wahania ciśnienia wpływają negatywnie na pęcherz pławny ryb.",
            icon: Gauge,
            iconColor: "text-green-400",
            bgIcon: "bg-green-500/10 border-green-500/20"
        },
        {
            id: "humidity",
            title: tAbout("factor_humidity") || "Wilgotność",
            liveValue: weather ? `${weather.humidity}%` : null,
            desc: tAbout("factor_humidity_desc") || "Wysoka wilgotność zwiastuje deszcz lub burzę, co tuż przed opadem wyzwala u ryb szał żerowania.",
            icon: Droplets,
            iconColor: "text-teal-400",
            bgIcon: "bg-teal-500/10 border-teal-500/20"
        },
        {
            id: "clouds",
            title: tAbout("factor_clouds") || "Zachmurzenie",
            liveValue: weather ? `${weather.cloudCover}%` : null,
            desc: tAbout("factor_clouds_desc") || "Chmury rozpraszają światło. W pochmurne dni ryby czują się bezpieczniej i żerują bliżej powierzchni.",
            icon: Cloud,
            iconColor: "text-neutral-400",
            bgIcon: "bg-neutral-500/10 border-neutral-500/20"
        },
        {
            id: "moon",
            title: tAbout("factor_moon") || "Księżyc",
            liveValue: weather 
                ? (weather.moonPhase ? t(`moon_phases.${weather.moonPhase}`) : (weather.isDay ? (t("humidity") === "Humidity" ? "Day" : "Dzień") : (t("humidity") === "Humidity" ? "Night" : "Noc")))
                : null,
            desc: tAbout("factor_moon_desc") || "Fazy księżyca generują siły grawitacyjne wpływające na ryby. Nów i pełnia to szczyt aktywności.",
            icon: Moon,
            iconColor: "text-purple-400",
            bgIcon: "bg-purple-500/10 border-purple-500/20"
        }
    ];

    return (
        <SectionReveal className="mb-24" delay={0.25}>
            {/* Section Title */}
            <div className="mb-12 flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                    {tAbout("live_index_title")}
                </h2>
                <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
            </div>

            {/* Main Unified Dashboard Container */}
            <div className="relative overflow-hidden rounded-3xl bg-neutral-900 px-6 py-8 text-white shadow-2xl md:p-10 border border-white/5">
                {/* Dynamic Background Glow */}
                <div 
                    className="absolute inset-0 transition-all duration-1000 animate-pulse-subtle pointer-events-none" 
                    style={{
                        background: `radial-gradient(circle at top right, rgba(${glowColor}, 0.22) 0%, rgba(${glowColor}, 0.03) 60%, transparent 100%)`
                    }}
                />
                <div className="absolute bottom-0 left-0 h-full w-full bg-[url('/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                {/* Top Section: Switcher, Active Score & Chart */}
                <div className="relative z-10 grid gap-8 lg:grid-cols-12">
                    
                    {/* Left Column: Info & Tip */}
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
                                            disabled={isOffline}
                                            className={cn(
                                                "relative flex-1 py-2 text-[10px] sm:text-xs font-black uppercase tracking-wider text-center transition-all rounded-lg focus-visible:outline-hidden",
                                                isActive ? "text-white" : "text-white/50 hover:text-white/80",
                                                isOffline ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                                            )}
                                        >
                                            {isActive && !isOffline && (
                                                <motion.div
                                                    layoutId="active-dashboard-species-combined"
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
                                        className="text-6xl font-black tracking-tight drop-shadow-md transition-colors duration-500 font-mono"
                                        style={{ color: isOffline ? "rgb(156,163,175)" : `rgb(${glowColor})` }}
                                    >
                                        {isOffline ? "N/A" : activeScore}
                                    </span>
                                    {!isOffline && <span className="text-xl text-white/50 font-bold font-mono">/100</span>}
                                </div>
                                <div>
                                    <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                                        <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: isOffline ? "rgb(156,163,175)" : `rgb(${glowColor})` }} />
                                        <span className="text-xs font-black uppercase tracking-wider text-white">
                                            {isOffline ? tAbout("offline_label") || "OFFLINE" : t(`labels.${activeLabel}`)}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-white/60 font-bold uppercase mt-1 tracking-widest">
                                        {isOffline ? "Solunar Index" : (activeMode === "general" ? t("idx_general") : (activeMode === "carp" ? t("idx_carp") : t("idx_predator")))}
                                    </p>
                                </div>
                            </div>

                            {/* Contextual Advice Card */}
                            <div className="rounded-xl bg-white/5 p-4 border border-white/10 backdrop-blur-xs flex gap-3 items-start">
                                <Info className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-medium">
                                    {speciesAdvice}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Chart (or Offline Fallback) */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                        {isOffline ? (
                            /* Offline Fallback Component */
                            <div className="bg-black/35 rounded-2xl p-6 border border-white/5 backdrop-blur-xs flex-1 flex flex-col items-center justify-center min-h-[200px] text-center">
                                <div className="rounded-full bg-white/5 border border-white/10 p-4 mb-4 text-white/40 animate-pulse">
                                    <WifiOff className="h-10 w-10" />
                                </div>
                                <h4 className="text-base font-bold mb-2">
                                    {tAbout("offline_chart_title") || "Prognoza wykresu niedostępna"}
                                </h4>
                                <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
                                    {tAbout("offline_chart_desc") || "Brak aktywnego połączenia z serwerem. Uruchom stronę ponownie online, aby załadować interaktywny wykres prognozy 24h."}
                                </p>
                            </div>
                        ) : (
                            /* Panoramic Interactive Chart */
                            <>
                                <div className="mb-3 flex justify-between items-center px-1">
                                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white/80">
                                        {t("wind") === "Wind" ? "Hourly Activity Forecast (24h)" : "Prognoza Godzinowa Aktywności (24h)"}
                                    </h4>
                                    <span className="text-[9px] font-mono opacity-50">Open-Meteo Solunar Model</span>
                                </div>

                                <div className="relative bg-black/35 rounded-2xl p-4 border border-white/5 backdrop-blur-xs flex-1 flex items-center justify-center min-h-[200px]">
                                    <svg
                                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                                        className="w-full h-auto pointer-events-none"
                                    >
                                        <defs>
                                            <linearGradient id={`combinedAreaGradient-${activeMode}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.4" />
                                                <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.0" />
                                            </linearGradient>
                                            <linearGradient id={`combinedLineGradient-${activeMode}`} x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor={`rgb(${glowColor})`} stopOpacity="0.7" />
                                                <stop offset="50%" stopColor={`rgb(${glowColor})`} stopOpacity="1.0" />
                                                <stop offset="100%" stopColor={`rgb(${glowColor})`} stopOpacity="0.7" />
                                            </linearGradient>
                                        </defs>

                                        {/* Y-Axis lines & labels */}
                                        <g opacity="0.12" stroke="white" strokeWidth="0.5">
                                            <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} />
                                            <line x1={paddingX} y1={paddingY + chartH / 2} x2={svgWidth - paddingX} y2={paddingY + chartH / 2} />
                                            <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} />
                                        </g>

                                        <g fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold" fontFamily="var(--font-mono)" textAnchor="end">
                                            <text x={paddingX - 8} y={paddingY + 3}>100%</text>
                                            <text x={paddingX - 8} y={paddingY + chartH / 2 + 3}>50%</text>
                                            <text x={paddingX - 8} y={svgHeight - paddingY + 3}>0%</text>
                                        </g>

                                        {/* Chart curves */}
                                        {points.length > 0 && (
                                            <>
                                                <path d={areaPathD} fill={`url(#combinedAreaGradient-${activeMode})`} />
                                                <path d={linePathD} fill="none" stroke={`url(#combinedLineGradient-${activeMode})`} strokeWidth="3" strokeLinecap="round" />
                                                <path d={linePathD} fill="none" stroke={`rgb(${glowColor})`} strokeWidth="7" strokeLinecap="round" strokeOpacity="0.15" />
                                            </>
                                        )}

                                        {/* Tooltip & Guides */}
                                        {hoveredIdx !== null && points[hoveredIdx] && (
                                            <g>
                                                <line
                                                    x1={points[hoveredIdx].x}
                                                    y1={paddingY}
                                                    x2={points[hoveredIdx].x}
                                                    y2={svgHeight - paddingY}
                                                    stroke="rgba(255, 255, 255, 0.25)"
                                                    strokeWidth="1"
                                                    strokeDasharray="4,4"
                                                />
                                                <circle
                                                    cx={points[hoveredIdx].x}
                                                    cy={points[hoveredIdx].y}
                                                    r="5.5"
                                                    fill={`rgb(${glowColor})`}
                                                    stroke="white"
                                                    strokeWidth="2"
                                                    style={{ filter: `drop-shadow(0 0 4px rgba(${glowColor}, 0.5))` }}
                                                />
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
                                                <text
                                                    x={Math.max(paddingX + 35, Math.min(svgWidth - paddingX - 35, points[hoveredIdx].x))}
                                                    y={Math.max(5, points[hoveredIdx].y - 40) + 12}
                                                    fill="rgba(255,255,255,0.7)"
                                                    fontSize="9"
                                                    fontWeight="bold"
                                                    textAnchor="middle"
                                                    fontFamily="var(--font-mono)"
                                                >
                                                    {points[hoveredIdx].hour}
                                                </text>
                                                <text
                                                    x={Math.max(paddingX + 35, Math.min(svgWidth - paddingX - 35, points[hoveredIdx].x))}
                                                    y={Math.max(5, points[hoveredIdx].y - 40) + 26}
                                                    fill={`rgb(${glowColor})`}
                                                    fontSize="12"
                                                    fontWeight="black"
                                                    textAnchor="middle"
                                                    fontFamily="var(--font-mono)"
                                                >
                                                    {points[hoveredIdx].score}%
                                                </text>
                                            </g>
                                        )}

                                        {/* Bottom X-Axis labels */}
                                        {points.length > 0 && (
                                            <g fill="rgba(255,255,255,0.4)" fontSize="8" fontWeight="bold" fontFamily="var(--font-mono)" opacity="0.8">
                                                <text x={paddingX} y={svgHeight - 10} textAnchor="start">
                                                    {t("forecast_label")}: {points[0].hour}
                                                </text>
                                                {points[Math.floor(points.length / 2)] && (
                                                    <text x={svgWidth / 2} y={svgHeight - 10} textAnchor="middle">
                                                        {points[Math.floor(points.length / 2)].hour}
                                                    </text>
                                                )}
                                                <text x={svgWidth - paddingX} y={svgHeight - 10} textAnchor="end">
                                                    +{points.length}h
                                                </text>
                                            </g>
                                        )}

                                        {/* Hover regions */}
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
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Section: Unified 6 Factor Cards Grid (Fuzja Edukacji i Live) */}
                <div className="relative z-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10 pt-8 border-t border-white/10">
                    {factors.map((factor) => {
                        const Icon = factor.icon;
                        return (
                            <SpotlightCard
                                key={factor.id}
                                className="rounded-2xl p-6 bg-white/3 dark:bg-white/5 border relative overflow-visible group transition-all duration-300 hover:scale-[1.02]"
                                style={{ borderColor: `rgba(${glowColor}, 0.15)` }}
                            >
                                <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                                    {/* Icon & Title Row */}
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("rounded-xl p-2 border shrink-0", factor.bgIcon, factor.iconColor)}>
                                                <Icon className="h-5 w-5 animate-pulse-subtle" />
                                            </div>
                                            <h3 className="font-bold text-white tracking-wide text-sm sm:text-base">
                                                {factor.title}
                                            </h3>
                                        </div>

                                        {/* Live Value Indicator */}
                                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 backdrop-blur-md">
                                            <span 
                                                className="text-xs font-black font-mono"
                                                style={{ color: factor.liveValue ? `rgb(${glowColor})` : "rgba(255,255,255,0.3)" }}
                                            >
                                                {factor.liveValue || "N/A"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Scientific explanation */}
                                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-medium">
                                        {renderWithGlossary(factor.desc)}
                                    </p>
                                </div>
                            </SpotlightCard>
                        );
                    })}
                </div>
            </div>
        </SectionReveal>
    );
};
