"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SPRING_TOKENS } from "@/lib/motion";
import { 
    CheckCircle, 
    XCircle, 
    Cctv, 
    Phone, 
    FileText, 
    ShieldAlert, 
    HelpCircle, 
    Calendar,
    Award,
    Search,
    X,
    Leaf
} from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";
import { trackPhoneCall } from "@/lib/analytics";
import { useTranslations } from "next-intl";

interface RuleEntry {
    fields: {
        title: string;
        rules: string[];
        type?: string;
        order?: number;
    };
}

interface RulesClientProps {
    generalRules?: RuleEntry;
    safetyRules?: RuleEntry;
    phoneNumber?: string;
}

type TabType = "general" | "safety" | "contact";

export const RulesClient = ({ generalRules, safetyRules, phoneNumber }: RulesClientProps) => {
    const t = useTranslations("rules");
    const phone = phoneNumber || "601 389 365";
    const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = [
        { id: "general", label: t("tab_general"), icon: FileText },
        { id: "safety", label: t("tab_safety"), icon: ShieldAlert },
        { id: "contact", label: t("tab_help"), icon: HelpCircle },
    ] as const;

    // List of bento grid summary cards (TL;DR)
    const bentoItems = [
        {
            title: t("bento_nokill_title"),
            desc: t("bento_nokill_desc"),
            icon: Award,
            color: "rgba(249, 115, 22, 0.15)", // Warm orange accent
            iconBg: "bg-orange-500/10 text-orange-500 dark:bg-orange-500/20"
        },
        {
            title: t("bento_gear_title"),
            desc: t("bento_gear_desc"),
            icon: ShieldAlert,
            color: "rgba(59, 130, 246, 0.15)", // Cool blue accent
            iconBg: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20"
        },
        {
            title: t("bento_booking_title"),
            desc: t("bento_booking_desc"),
            icon: Calendar,
            color: "rgba(16, 185, 129, 0.15)", // Green accent
            iconBg: "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
        },
        {
            title: t("bento_nature_title"),
            desc: t("bento_nature_desc"),
            icon: Leaf,
            color: "rgba(234, 179, 8, 0.15)", // Yellow accent
            iconBg: "bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20"
        }
    ];

    // Live search filtering across all rules
    const filteredRules = useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return null;

        const results: { text: string; category: "general" | "safety" }[] = [];

        generalRules?.fields.rules.forEach(rule => {
            if (rule.toLowerCase().includes(query)) {
                results.push({ text: rule, category: "general" });
            }
        });

        safetyRules?.fields.rules.forEach(rule => {
            if (rule.toLowerCase().includes(query)) {
                results.push({ text: rule, category: "safety" });
            }
        });

        return results;
    }, [searchQuery, generalRules, safetyRules]);

    // Helper to highlight matching search words
    const highlightMatch = (text: string, search: string) => {
        if (!search.trim()) return text;
        const escapedSearch = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearch})`, 'gi');
        const parts = text.split(regex);
        return parts.map((part, i) => 
            regex.test(part) 
                ? <mark key={i} className="bg-amber-500/30 text-amber-900 dark:text-amber-200 px-0.5 rounded font-bold">{part}</mark> 
                : part
        );
    };

    return (
        <div className="space-y-16">
            {/* 1. Bento Grid - TL;DR Quick Rules */}
            <div>
                <h2 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 text-center lg:text-left">
                    {t("highlight_title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {bentoItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <SpotlightCard 
                                key={idx}
                                className="p-6 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white/5 backdrop-blur-md transition-all duration-300 hover:scale-[1.02]"
                                style={{ borderColor: item.color }}
                            >
                                <div className="relative z-10 flex flex-col h-full gap-4">
                                    <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl shrink-0", item.iconBg)}>
                                        <Icon className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-base font-extrabold text-pine-green-dark dark:text-white leading-tight">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </SpotlightCard>
                        );
                    })}
                </div>
            </div>

            {/* 2. Double-Column Layout (Sidebar + Rich Doc View) */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
                
                {/* Left Column (Sticky Sidebar with WAI-ARIA tablist) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
                    
                    {/* Search Bar Card */}
                    <div className="rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/5 p-4 shadow-xl">
                        <div className="relative flex items-center">
                            <Search className="absolute left-3.5 h-4.5 w-4.5 text-neutral-400" />
                            <input 
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t("search_placeholder")}
                                className="w-full pl-10 pr-10 py-2.5 rounded-2xl text-sm border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900/50 text-neutral-800 dark:text-white placeholder:text-neutral-400 focus:outline-hidden focus:ring-2 focus:ring-[rgb(var(--active-glow-color,249,115,22))] transition-all font-semibold"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* WAI-ARIA Tablist Menu */}
                    <div 
                        role="tablist"
                        aria-label="Wybór kategorii regulaminu"
                        className="flex overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:flex-col gap-2 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 rounded-3xl border border-neutral-200 dark:border-white/5 bg-white dark:bg-white/5 p-4 shadow-xl shrink-0"
                    >
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    role="tab"
                                    aria-selected={isActive}
                                    id={`tab-${tab.id}`}
                                    aria-controls={`panel-${tab.id}`}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setSearchQuery(""); // Clear search query when selecting a tab
                                    }}
                                    className={cn(
                                        "relative flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                        isActive 
                                            ? "text-white" 
                                            : "text-pine-green dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="active-rules-tab"
                                            className="absolute inset-0 rounded-2xl z-0"
                                            style={{
                                                backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                boxShadow: "0 4px 15px -3px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                            }}
                                            transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                        />
                                    )}
                                    <Icon className={cn("h-4 w-4 relative z-10 shrink-0", isActive ? "text-white" : "text-[rgb(var(--active-glow-color,249,115,22))]")} />
                                    <span className="relative z-10">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column (Rich Doc View - matching tab panel) */}
                <div className="lg:col-span-8 w-full">
                    <AnimatePresence mode="wait">
                        {filteredRules !== null ? (
                            /* 1. Search Results panel (replaces the tab panel when searching) */
                            <motion.div
                                key="search-results"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="space-y-6"
                            >
                                <SpotlightCard className="rounded-3xl p-6 md:p-8">
                                    <h3 className="text-xl font-extrabold text-pine-green-dark dark:text-white mb-6 border-b border-neutral-100 dark:border-white/10 pb-4">
                                        Szukana fraza: &quot;{searchQuery}&quot;
                                    </h3>
                                    {filteredRules.length > 0 ? (
                                        <ul className="space-y-4">
                                            {filteredRules.map((rule, idx) => (
                                                <li key={idx} className="flex items-start gap-3.5 text-pine-green-dark dark:text-neutral-200 border-b border-neutral-50 dark:border-white/5 pb-4 last:border-0 last:pb-0">
                                                    {rule.category === "general" ? (
                                                        <CheckCircle className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    ) : (
                                                        <XCircle className="mt-1 h-5 w-5 text-red-500 shrink-0" />
                                                    )}
                                                    <span className="text-sm leading-relaxed font-semibold">
                                                        {highlightMatch(rule.text, searchQuery)}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-8">
                                            {t("no_results")}
                                        </p>
                                    )}
                                </SpotlightCard>
                            </motion.div>
                        ) : (
                            /* 2. Structured Tab Panels (toggled via activeTab) */
                            <motion.div
                                key={activeTab}
                                role="tabpanel"
                                id={`panel-${activeTab}`}
                                aria-labelledby={`tab-${activeTab}`}
                                tabIndex={0}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]/50 rounded-3xl"
                            >
                                {/* Tab panel 1: Zasady Ogólne */}
                                {activeTab === "general" && generalRules && (
                                    <SpotlightCard className="rounded-3xl p-6 md:p-8">
                                        <div className="relative z-10">
                                            <h3 className="text-lg font-bold text-pine-green-dark dark:text-white mb-6 border-b border-neutral-100 dark:border-white/10 pb-3">
                                                {t("standard_rules_title")}
                                            </h3>
                                            <ul className="space-y-5">
                                                {generalRules.fields.rules.map((rule, idx) => (
                                                    <li key={idx} className="flex items-start gap-3.5 text-pine-green-dark dark:text-neutral-200">
                                                        <CheckCircle className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                        <span className="text-sm font-semibold leading-relaxed">{rule}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </SpotlightCard>
                                )}

                                {/* Tab panel 2: Bezpieczeństwo */}
                                {activeTab === "safety" && safetyRules && (
                                    <SpotlightCard className="rounded-3xl p-6 md:p-8 border border-red-200/50 dark:border-red-950/20 bg-red-500/[0.02] dark:bg-red-500/[0.01]">
                                        <div className="relative z-10">
                                            <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-6 border-b border-red-100 dark:border-red-950/30 pb-3">
                                                {safetyRules.fields.title}
                                            </h3>
                                            
                                            <div className="grid gap-8 md:grid-cols-12 items-stretch">
                                                {/* Restrictions list */}
                                                <div className="md:col-span-7">
                                                    <ul className="space-y-4">
                                                        {safetyRules.fields.rules.map((rule, idx) => {
                                                            const isForbidden = rule.toUpperCase().includes("ZABRONIONE") || rule.toUpperCase().includes("FORBIDDEN");
                                                            return (
                                                                <li 
                                                                    key={idx} 
                                                                    className={cn(
                                                                        "flex items-start gap-3 text-sm leading-relaxed font-semibold",
                                                                        isForbidden 
                                                                            ? "text-red-600 dark:text-red-400" 
                                                                            : "text-pine-green-dark dark:text-neutral-200"
                                                                    )}
                                                                >
                                                                    <XCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-500" />
                                                                    <span>{rule}</span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </div>

                                                {/* CCTV Box */}
                                                <div className="md:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-pine-green-dark/95 p-6 text-white relative overflow-hidden min-h-[180px] shadow-lg">
                                                    <div className="relative z-10 flex flex-col items-center gap-2">
                                                        <Cctv className="h-14 w-14 text-[rgb(var(--active-glow-color,249,115,22))]" />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-2">
                                                            {t("monitoring_title")}
                                                        </span>
                                                    </div>
                                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/45 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider text-red-500 border border-red-500/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        REC
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                )}

                                {/* Tab panel 3: Pomoc & Rezerwacje */}
                                {activeTab === "contact" && (
                                    <SpotlightCard className="rounded-3xl p-6 md:p-8">
                                        <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center py-4">
                                            <div className="p-4 rounded-full bg-pine-green/5 dark:bg-white/5 border border-pine-green/10 dark:border-white/10 mb-4 flex items-center justify-center">
                                                <Phone className="h-8 w-8 text-[rgb(var(--active-glow-color,249,115,22))] animate-pulse" />
                                            </div>
                                            <h3 className="text-xl font-bold text-pine-green-dark dark:text-white">
                                                {t("have_questions")}
                                            </h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm leading-relaxed font-semibold">
                                                {t("have_questions_desc")}
                                            </p>
                                            
                                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                                                <div 
                                                    className="p-4 rounded-2xl bg-pine-green/5 dark:bg-white/5 border border-pine-green/10 dark:border-white/10 flex items-center gap-3 transition-all duration-300 hover:scale-[1.03] hover:bg-pine-green/10 dark:hover:bg-white/10 group cursor-default"
                                                    style={{
                                                        ['--hover-shadow' as any]: "0 8px 20px -6px rgba(var(--active-glow-color, 249, 115, 22), 0.25)",
                                                        ['--hover-border' as any]: "rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.boxShadow = "var(--hover-shadow)";
                                                        e.currentTarget.style.borderColor = "var(--hover-border)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.boxShadow = "";
                                                        e.currentTarget.style.borderColor = "";
                                                    }}
                                                >
                                                    <Calendar className="h-5 w-5 text-[rgb(var(--active-glow-color,249,115,22))] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0" />
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{t("card_bookings")}</span>
                                                        <p className="text-sm font-semibold text-pine-green-dark dark:text-white">{t("card_bookings_desc")}</p>
                                                    </div>
                                                </div>
                                                <div 
                                                    className="p-4 rounded-2xl bg-pine-green/5 dark:bg-white/5 border border-pine-green/10 dark:border-white/10 flex items-center gap-3 transition-all duration-300 hover:scale-[1.03] hover:bg-pine-green/10 dark:hover:bg-white/10 group cursor-default"
                                                    style={{
                                                        ['--hover-shadow' as any]: "0 8px 20px -6px rgba(var(--active-glow-color, 249, 115, 22), 0.25)",
                                                        ['--hover-border' as any]: "rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.boxShadow = "var(--hover-shadow)";
                                                        e.currentTarget.style.borderColor = "var(--hover-border)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.boxShadow = "";
                                                        e.currentTarget.style.borderColor = "";
                                                    }}
                                                >
                                                    <ShieldAlert className="h-5 w-5 text-[rgb(var(--active-glow-color,249,115,22))] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0" />
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{t("card_safety")}</span>
                                                        <p className="text-sm font-semibold text-pine-green-dark dark:text-white">{t("card_safety_desc")}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <Magnetic strength={0.15}>
                                                <a
                                                    href={phoneHref}
                                                    onClick={() => trackPhoneCall("rules_page", phone)}
                                                    className="mt-8 inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md btn-hero-shine group"
                                                    style={{
                                                        backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                        boxShadow: "0 10px 20px -5px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                    }}
                                                >
                                                    <span className="relative flex h-2 w-2 shrink-0">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                    <Phone className="h-4 w-4 transition-transform group-hover:animate-shake shrink-0" />
                                                    <span>{t("btn_call_host", { phone })}</span>
                                                </a>
                                            </Magnetic>
                                        </div>
                                    </SpotlightCard>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};
