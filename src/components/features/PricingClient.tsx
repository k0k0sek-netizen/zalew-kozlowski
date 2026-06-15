"use client";

import { useState, useEffect } from "react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { ShieldCheck, Calendar, Phone, Info, Clock, Users, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { trackPhoneCall } from "@/lib/analytics";
import { SPRING_TOKENS } from "@/lib/motion";
import { useTranslations } from "next-intl";

interface PriceItem {
    sys: { id: string };
    fields: {
        title: string;
        description?: string;
        price: string;
        category: string;
        details?: string[];
        order?: number;
    };
}

interface PricingClientProps {
    initialPrices: PriceItem[];
    phone?: string;
    price1Rod?: number;
    price2Rods?: number;
    priceSpinning?: number;
}

type MethodType = "grunt" | "spinning";
type RodsType = 1 | 2;

export const PricingClient = ({ 
    initialPrices, 
    phone = "601 389 365",
    price1Rod,
    price2Rods,
    priceSpinning
}: PricingClientProps) => {
    const t = useTranslations("pricing");
    const mainPrice = initialPrices.find(p => p.fields.category === 'Główne');
    const infoPrice = initialPrices.find(p => p.fields.category === 'Info');

    // Parsowanie cen z Contentful (jako fallback)
    const priceMatches = mainPrice?.fields.price.match(/\d+(?=\s*zł)/gi) || mainPrice?.fields.price.match(/\d+/g) || [];
    const parsedBase = priceMatches[0] ? parseInt(priceMatches[0], 10) : 15;
    const parsedDouble = priceMatches[1] ? parseInt(priceMatches[1], 10) : (parsedBase === 15 ? 20 : parsedBase * 2);

    // Ostateczne stawki (z infoBlock lub sparsowane)
    const basePrice = price1Rod ?? parsedBase;
    const doubleRodPrice = price2Rods ?? parsedDouble;
    const spinningPrice = priceSpinning ?? basePrice;

    // Stany kalkulatora
    const [method, setMethod] = useState<MethodType>("grunt");
    const [rods, setRods] = useState<RodsType>(2);
    const [days, setDays] = useState(1);
    const [calculatedPrice, setCalculatedPrice] = useState(doubleRodPrice);

    // Wymuszenie 1 wędki przy wyborze spinningu
    useEffect(() => {
        if (method === "spinning") {
            setRods(1);
        }
    }, [method]);

    // Obliczanie ceny na podstawie parametrów
    useEffect(() => {
        let perDayPrice = basePrice;
        if (method === "spinning") {
            perDayPrice = spinningPrice;
        } else {
            // Grunt
            perDayPrice = rods === 1 ? basePrice : doubleRodPrice;
        }
        setCalculatedPrice(perDayPrice * days);
    }, [method, rods, days, basePrice, doubleRodPrice, spinningPrice]);

    return (
        <div className="space-y-12">
            <div className="grid gap-6 md:grid-cols-2 items-stretch">
                {/* Karta 1: Cennik Zezwoleń z Kalkulatorem */}
                {mainPrice && (
                    <SpotlightCard className="flex flex-col p-8 rounded-2xl border" style={{ borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.15)" }}>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-pine-green-dark dark:text-white">{mainPrice.fields.title}</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                    {mainPrice.fields.description
                                        ?.replace(/\{\{price-1-rod\}\}/g, String(basePrice))
                                        ?.replace(/\{\{price-2-rods\}\}/g, String(doubleRodPrice))
                                        ?.replace(/\{\{price-spinning\}\}/g, String(spinningPrice))}
                                </p>
                                
                                {/* Zaawansowany Kalkulator Zasiadki */}
                                <div className="mt-6 p-5 rounded-2xl bg-pine-green/5 dark:bg-white/5 border border-pine-green/10 dark:border-white/10 text-left space-y-4">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">{t("calculator_title")}</span>
                                    
                                    {/* Wybór Metody */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">{t("method_label")}</span>
                                        <div className="flex gap-1.5 bg-neutral-100/50 dark:bg-white/5 p-1 rounded-full border border-neutral-200/30 dark:border-white/5 relative overflow-hidden">
                                            <button
                                                onClick={() => setMethod("grunt")}
                                                aria-pressed={method === "grunt"}
                                                className={cn(
                                                    "relative px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer flex-1 text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                                    method === "grunt"
                                                        ? "text-white"
                                                        : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                                )}
                                            >
                                                {method === "grunt" && (
                                                    <motion.div
                                                        layoutId="pricing-method-active"
                                                        className="absolute inset-0 rounded-full z-0"
                                                        style={{
                                                            backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                            boxShadow: "0 4px 10px -3px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                        }}
                                                        transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                                    />
                                                )}
                                                <span className="relative z-10">{t("method_ground")}</span>
                                            </button>
                                            <button
                                                onClick={() => setMethod("spinning")}
                                                aria-pressed={method === "spinning"}
                                                className={cn(
                                                    "relative px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer flex-1 text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                                    method === "spinning"
                                                        ? "text-white"
                                                        : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                                )}
                                            >
                                                {method === "spinning" && (
                                                    <motion.div
                                                        layoutId="pricing-method-active"
                                                        className="absolute inset-0 rounded-full z-0"
                                                        style={{
                                                            backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                            boxShadow: "0 4px 10px -3px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                        }}
                                                        transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                                    />
                                                )}
                                                <span className="relative z-10">{t("method_spinning")}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Wybór Wędzisk */}
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500">{t("rods_label")}</span>
                                        <div className={cn(
                                            "flex gap-1.5 bg-neutral-100/50 dark:bg-white/5 p-1 rounded-full border border-neutral-200/30 dark:border-white/5 relative overflow-hidden transition-opacity duration-300",
                                            method === "spinning" && "opacity-50 pointer-events-none"
                                        )}>
                                            <button
                                                disabled={method === "spinning"}
                                                onClick={() => method === "grunt" && setRods(1)}
                                                aria-pressed={rods === 1 && method !== "spinning"}
                                                className={cn(
                                                    "relative px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer flex-1 text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                                    rods === 1 && method !== "spinning"
                                                        ? "text-white"
                                                        : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                                )}
                                            >
                                                {rods === 1 && method !== "spinning" && (
                                                    <motion.div
                                                        layoutId="pricing-rods-active"
                                                        className="absolute inset-0 rounded-full z-0"
                                                        style={{
                                                            backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                            boxShadow: "0 4px 10px -3px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                        }}
                                                        transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                                    />
                                                )}
                                                <span className="relative z-10">{t("rod_one")}</span>
                                            </button>
                                            <button
                                                disabled={method === "spinning"}
                                                onClick={() => setRods(2)}
                                                aria-pressed={rods === 2 && method !== "spinning"}
                                                className={cn(
                                                    "relative px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer flex-1 text-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                                    rods === 2 && method !== "spinning"
                                                        ? "text-white"
                                                        : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                                )}
                                            >
                                                {rods === 2 && method !== "spinning" && (
                                                    <motion.div
                                                        layoutId="pricing-rods-active"
                                                        className="absolute inset-0 rounded-full z-0"
                                                        style={{
                                                            backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                            boxShadow: "0 4px 10px -3px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                        }}
                                                        transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                                    />
                                                )}
                                                <span className="relative z-10">{t("rod_two")}</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Suwak (Slider) */}
                                    <div className="space-y-2">
                                        <label htmlFor="zasiadka-duration-slider" className="text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 block">{t("duration_label")} ({t("duration_days", { count: days })})</label>
                                        <div className="px-1">
                                            <input 
                                                type="range" 
                                                id="zasiadka-duration-slider"
                                                min="1" 
                                                max="7" 
                                                value={days}
                                                onChange={(e) => setDays(parseInt(e.target.value, 10))}
                                                className="w-full h-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 appearance-none cursor-pointer accent-[rgb(var(--active-glow-color,249,115,22))]"
                                                aria-label="Liczba dób zasiadki"
                                            />
                                            <div className="flex justify-between text-[10px] font-bold text-neutral-400 dark:text-neutral-500 mt-2 px-1">
                                                <span>{t("duration_days", { count: 1 })}</span>
                                                <span>{t("duration_days", { count: 3 })}</span>
                                                <span>{t("duration_days", { count: 5 })}</span>
                                                <span>{t("duration_days", { count: 7 })}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Wynik */}
                                    <div className="pt-3 border-t border-white/5 text-center">
                                        <motion.div 
                                            key={calculatedPrice}
                                            initial={{ scale: 0.85, opacity: 0.7 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", ...SPRING_TOKENS.bouncy }}
                                            className="text-4xl font-black transition-colors duration-300"
                                            style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                        >
                                            {calculatedPrice} {t("currency")}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            <ul className="mt-6 mb-2 space-y-3 text-sm flex-1">
                                {mainPrice.fields.details?.map((detailRaw, idx) => {
                                    const detail = detailRaw
                                        .replace(/\{\{price-1-rod\}\}/g, String(basePrice))
                                        .replace(/\{\{price-2-rods\}\}/g, String(doubleRodPrice))
                                        .replace(/\{\{price-spinning\}\}/g, String(spinningPrice));
                                    
                                    const isResidents = detail.toLowerCase().includes("mieszkańcy kozłowa") || detail.toLowerCase().includes("kozłów residents") || detail.toLowerCase().includes("kozlow residents");
                                    const isCash = detail.toLowerCase().includes("tylko gotówka") || detail.toLowerCase().includes("cash only");

                                    return (
                                        <li key={idx} className={`flex items-center gap-2 ${isResidents ? 'pt-2 text-pine-green font-bold dark:text-green-400' : 'text-pine-green-dark dark:text-neutral-200'}`}>
                                            <span 
                                                className="h-1.5 w-1.5 rounded-full shrink-0"
                                                style={{ backgroundColor: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                            />
                                            {isCash ? <strong>{detail}</strong> : detail}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </SpotlightCard>
                )}

                {/* Karta 2: Ważne Informacje / Dostępność Łowiska (Przebudowany Layout) */}
                {infoPrice && (
                    <SpotlightCard 
                        className="flex flex-col bg-white/70 dark:bg-pine-green-dark/40 backdrop-blur-md p-8 text-pine-green-dark dark:text-white relative overflow-hidden transition-all duration-300 border border-earth-brown/10 dark:border-white/10"
                        style={{
                            borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                        } as React.CSSProperties}
                    >
                        <div 
                            className="absolute right-0 top-0 px-3 py-1 text-xs font-bold text-white rounded-bl-lg z-20 transition-colors duration-300"
                            style={{ backgroundColor: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                        >
                            INFO
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-[rgb(var(--active-glow-color,249,115,22))]" />
                                    {infoPrice.fields.title || t("info_title")}
                                </h3>
                                
                                {/* Nowoczesny Asymetryczny Układ Informacji */}
                                <div className="space-y-4">
                                    {/* Sekcja 1: Weekend */}
                                    <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 flex gap-3.5 hover:bg-neutral-100/50 dark:hover:bg-white/10 transition-colors">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--active-glow-color,249,115,22))]/10 text-[rgb(var(--active-glow-color,249,115,22))]">
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{t("weekend_label")}</span>
                                            <p className="text-sm font-semibold text-pine-green-dark dark:text-neutral-100">{t("weekend_desc")}</p>
                                        </div>
                                    </div>

                                    {/* Sekcja 2: Pon - Pt */}
                                    <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 flex gap-3.5 hover:bg-neutral-100/50 dark:hover:bg-white/10 transition-colors">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--active-glow-color,249,115,22))]/10 text-[rgb(var(--active-glow-color,249,115,22))]">
                                            <Phone className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{t("weekday_label")}</span>
                                            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{t("weekday_desc")}</p>
                                        </div>
                                    </div>

                                    {/* Sekcja 3: Goście */}
                                    <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-white/5 border border-neutral-200/50 dark:border-white/5 flex gap-3.5 hover:bg-neutral-100/50 dark:hover:bg-white/10 transition-colors">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[rgb(var(--active-glow-color,249,115,22))]/10 text-[rgb(var(--active-glow-color,249,115,22))]">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{t("guests_label")}</span>
                                            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{t("guests_desc")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-5 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-0.5">{t("reservation_contact")}</div>
                                    <a 
                                        href={`tel:${phone.replace(/\s+/g, "")}`}
                                        onClick={() => trackPhoneCall("pricing_page", phone)}
                                        className="text-2xl font-black transition-colors duration-300 hover:brightness-110"
                                        style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                    >
                                        {phone}
                                    </a>
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 relative">
                                    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </div>
                            </div>
                        </div>
                    </SpotlightCard>
                )}
            </div>

            {/* Dolna Karta: Brak ukrytych opłat (Dodano pełną interakcję na hover i animację) */}
            <div 
                className="relative overflow-hidden rounded-2xl border p-8 shadow-lg bg-white/40 dark:bg-white/5 backdrop-blur-md transition-all duration-500 hover:scale-[1.01] group cursor-default"
                style={{ 
                    "--accent-glow": "rgba(var(--active-glow-color, 249, 115, 22), 0.15)",
                    ['--hover-border' as any]: "rgba(var(--active-glow-color, 249, 115, 22), 0.35)",
                    ['--hover-shadow' as any]: "0 20px 35px -10px rgba(var(--active-glow-color, 249, 115, 22), 0.15)"
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--hover-border)";
                    e.currentTarget.style.boxShadow = "var(--hover-shadow)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "";
                    e.currentTarget.style.boxShadow = "";
                }}
            >
                {/* Background subtle glow */}
                <div 
                    className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-60 pointer-events-none transition-all duration-1000"
                    style={{
                        background: `radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)`
                    }}
                />
                <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div 
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-earth-brown/10 dark:bg-white/10 dark:border-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                            style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                        >
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-pine-green-dark dark:text-white">
                                {t("no_hidden_fees")}
                            </h3>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                {t("transparency_rules")}
                            </p>
                        </div>
                    </div>
                    
                    <div className="max-w-xl md:border-l md:border-earth-brown/10 md:dark:border-white/10 md:pl-8">
                        <p className="text-earth-brown dark:text-neutral-300 leading-relaxed text-sm md:text-base">
                            {t("no_hidden_fees_desc")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
