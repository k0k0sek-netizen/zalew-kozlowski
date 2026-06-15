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
    Search,
    X,
    Fish,
    Shield,
    MessageCircle,
} from "lucide-react";
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

// Premium Spring for panel transitions
const PANEL_SPRING = {
    type: "spring" as const,
    stiffness: 200,
    damping: 28,
    mass: 0.8,
};

export const RulesClient = ({ generalRules, safetyRules, phoneNumber }: RulesClientProps) => {
    const t = useTranslations("rules");
    const phone = phoneNumber || "601 389 365";
    const phoneHref = `tel:${phone.replace(/\s/g, "")}`;
    const [activeTab, setActiveTab] = useState<TabType>("general");
    const [searchQuery, setSearchQuery] = useState("");

    const tabs = [
        {
            id: "general" as const,
            label: t("tab_general"),
            icon: Fish,
            tagline: t("accordion_general_tagline"),
            iconColor: "text-emerald-600 dark:text-emerald-400",
            iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
            activeGlow: "from-emerald-500/10 to-emerald-500/5",
        },
        {
            id: "safety" as const,
            label: t("tab_safety"),
            icon: Shield,
            tagline: t("accordion_safety_tagline"),
            iconColor: "text-red-500 dark:text-red-400",
            iconBg: "bg-red-500/10 dark:bg-red-500/15",
            activeGlow: "from-red-500/10 to-red-500/5",
        },
        {
            id: "contact" as const,
            label: t("tab_help"),
            icon: MessageCircle,
            tagline: t("accordion_contact_tagline"),
            iconColor: "text-blue-500 dark:text-blue-400",
            iconBg: "bg-blue-500/10 dark:bg-blue-500/15",
            activeGlow: "from-blue-500/10 to-blue-500/5",
        },
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

    const handleTabSwitch = (id: TabType) => {
        setActiveTab(id);
        setSearchQuery(""); // Clear search on tab switch
    };

    const activeTabData = tabs.find(t => t.id === activeTab)!;

    return (
        <div className="space-y-8">
            {/* Search Bar — Floating, minimal, Apple style */}
            <div className="max-w-md mx-auto">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-neutral-400 transition-colors group-focus-within:text-[rgb(var(--active-glow-color,249,115,22))]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("search_placeholder")}
                        className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-sm border border-neutral-200/80 dark:border-white/8 bg-white/80 dark:bg-white/5 backdrop-blur-xl text-neutral-800 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--active-glow-color,249,115,22))]/40 focus:border-[rgb(var(--active-glow-color,249,115,22))]/30 transition-all shadow-sm font-medium"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Search Results Overlay */}
            <AnimatePresence>
                {filteredRules !== null && (
                    <motion.div
                        key="search-results"
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={PANEL_SPRING}
                        className="rounded-3xl border border-neutral-200/80 dark:border-white/5 bg-white/80 dark:bg-white/[0.03] backdrop-blur-xl p-8 shadow-xl"
                    >
                        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
                            {t("search_results_label")} &quot;{searchQuery}&quot;
                        </p>
                        {filteredRules.length > 0 ? (
                            <ul className="space-y-4">
                                {filteredRules.map((rule, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-pine-green-dark dark:text-neutral-200">
                                        {rule.category === "general" ? (
                                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                                                <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                        ) : (
                                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            </div>
                                        )}
                                        <span className="text-sm leading-relaxed font-medium">
                                            {highlightMatch(rule.text, searchQuery)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-12">
                                {t("no_results")}
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══ Apple/Stripe Pill Tablist ═══ */}
            {!filteredRules && (
                <>
                    <div
                        role="tablist"
                        aria-label="Wybór kategorii regulaminu"
                        className="flex flex-col sm:flex-row gap-3 sm:gap-2"
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
                                    onClick={() => handleTabSwitch(tab.id)}
                                    tabIndex={isActive ? 0 : -1}
                                    className={cn(
                                        "relative flex items-center gap-3.5 px-5 sm:px-6 py-4 sm:py-5 rounded-2xl sm:rounded-3xl text-left cursor-pointer transition-all duration-500 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]/50 group overflow-hidden",
                                        isActive
                                            ? "bg-white/90 dark:bg-white/[0.05] shadow-xl dark:shadow-2xl border border-neutral-200/80 dark:border-white/8"
                                            : "bg-white/40 dark:bg-white/[0.02] border border-neutral-200/40 dark:border-white/4 hover:bg-white/70 dark:hover:bg-white/[0.04] hover:border-neutral-200/60 dark:hover:border-white/6"
                                    )}
                                >
                                    {/* Active indicator background gradient */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="rules-tab-glow"
                                            className={cn("absolute inset-0 bg-gradient-to-r opacity-40 dark:opacity-20", tab.activeGlow)}
                                            transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div className={cn(
                                        "flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl transition-all duration-500 relative z-10",
                                        isActive ? tab.iconBg : "bg-neutral-100 dark:bg-white/5 group-hover:bg-neutral-50 dark:group-hover:bg-white/8"
                                    )}>
                                        <Icon className={cn(
                                            "h-5 w-5 sm:h-5.5 sm:w-5.5 transition-all duration-500",
                                            isActive ? tab.iconColor : "text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-500 dark:group-hover:text-neutral-400"
                                        )} />
                                    </div>

                                    {/* Label + Tagline */}
                                    <div className="flex-1 min-w-0 relative z-10">
                                        <span className={cn(
                                            "block text-sm sm:text-[15px] font-bold transition-colors duration-300",
                                            isActive ? "text-pine-green-dark dark:text-white" : "text-neutral-500 dark:text-neutral-400"
                                        )}>
                                            {tab.label}
                                        </span>
                                        <span className={cn(
                                            "block text-[11px] sm:text-xs mt-0.5 transition-colors duration-300 line-clamp-1",
                                            isActive ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-400 dark:text-neutral-500"
                                        )}>
                                            {tab.tagline}
                                        </span>
                                    </div>

                                    {/* Active Dot */}
                                    {isActive && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                            className={cn("h-2 w-2 rounded-full shrink-0 relative z-10", isActive ? tab.iconColor.replace("text-", "bg-") : "")}
                                            style={{ backgroundColor: isActive ? undefined : undefined }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ═══ Tab Panel Content — fullscreen with Spring animation ═══ */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            role="tabpanel"
                            id={`panel-${activeTab}`}
                            aria-labelledby={`tab-${activeTab}`}
                            tabIndex={0}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.98 }}
                            transition={PANEL_SPRING}
                            className="rounded-3xl border border-neutral-200/80 dark:border-white/5 bg-white/90 dark:bg-white/[0.03] backdrop-blur-xl shadow-xl overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]/30 focus-visible:ring-inset"
                        >
                            <div className="p-6 sm:p-8 lg:p-10">
                                {/* ═══ GENERAL RULES ═══ */}
                                {activeTab === "general" && generalRules && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-neutral-100 dark:border-white/5">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15">
                                                <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-pine-green-dark dark:text-white">
                                                    {t("standard_rules_title")}
                                                </h3>
                                            </div>
                                        </div>
                                        <ul className="space-y-5">
                                            {generalRules.fields.rules.map((rule, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                    className="flex items-start gap-4"
                                                >
                                                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/15">
                                                        <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <span className="text-sm sm:text-[15px] font-medium text-pine-green-dark dark:text-neutral-200 leading-relaxed">
                                                        {rule}
                                                    </span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* ═══ SAFETY RULES ═══ */}
                                {activeTab === "safety" && safetyRules && (
                                    <div>
                                        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-red-100 dark:border-red-950/20">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 dark:bg-red-500/15">
                                                <ShieldAlert className="h-5 w-5 text-red-500 dark:text-red-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-red-600 dark:text-red-400">
                                                    {safetyRules.fields.title}
                                                </h3>
                                            </div>
                                        </div>

                                        <div className="grid gap-8 lg:grid-cols-12 items-start">
                                            {/* Rules List */}
                                            <div className="lg:col-span-7">
                                                <ul className="space-y-5">
                                                    {safetyRules.fields.rules.map((rule, idx) => {
                                                        const isForbidden = rule.toUpperCase().includes("ZABRONIONE") || rule.toUpperCase().includes("FORBIDDEN");
                                                        return (
                                                            <motion.li
                                                                key={idx}
                                                                initial={{ opacity: 0, x: -8 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.04, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                                                className="flex items-start gap-4"
                                                            >
                                                                <div className={cn(
                                                                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                                                                    isForbidden ? "bg-red-500/15" : "bg-red-500/10"
                                                                )}>
                                                                    <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                                                                </div>
                                                                <span className={cn(
                                                                    "text-sm sm:text-[15px] font-medium leading-relaxed",
                                                                    isForbidden
                                                                        ? "text-red-600 dark:text-red-400 font-bold"
                                                                        : "text-pine-green-dark dark:text-neutral-200"
                                                                )}>
                                                                    {rule}
                                                                </span>
                                                            </motion.li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>

                                            {/* CCTV Badge */}
                                            <div className="lg:col-span-5">
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                                    className="flex flex-col items-center justify-center rounded-2xl bg-pine-green-dark/95 dark:bg-black/40 p-8 text-white relative overflow-hidden min-h-[200px] border border-white/5"
                                                >
                                                    <div className="relative z-10 flex flex-col items-center gap-3">
                                                        <Cctv className="h-14 w-14 text-[rgb(var(--active-glow-color,249,115,22))]" />
                                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-1">
                                                            {t("monitoring_title")}
                                                        </span>
                                                        <p className="text-xs text-neutral-300 text-center max-w-[180px] leading-relaxed font-medium">
                                                            {t("monitoring_desc")}
                                                        </p>
                                                    </div>
                                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/45 px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider text-red-500 border border-red-500/20">
                                                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                        REC
                                                    </div>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* ═══ CONTACT / HELP ═══ */}
                                {activeTab === "contact" && (
                                    <div className="space-y-8">
                                        <div className="text-center max-w-lg mx-auto">
                                            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-blue-500/10 dark:bg-blue-500/15 mb-5">
                                                <Phone className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                                            </div>
                                            <h3 className="text-xl sm:text-2xl font-bold text-pine-green-dark dark:text-white">
                                                {t("have_questions")}
                                            </h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed font-medium max-w-sm mx-auto">
                                                {t("have_questions_desc")}
                                            </p>
                                        </div>

                                        {/* Info Cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 flex items-center gap-4 transition-all duration-300 hover:border-neutral-300 dark:hover:border-white/10 hover:shadow-md"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 shrink-0">
                                                    <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{t("card_bookings")}</span>
                                                    <p className="text-sm font-semibold text-pine-green-dark dark:text-white">{t("card_bookings_desc")}</p>
                                                </div>
                                            </motion.div>
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.15 }}
                                                className="p-5 rounded-2xl bg-neutral-50/80 dark:bg-white/[0.03] border border-neutral-200/60 dark:border-white/5 flex items-center gap-4 transition-all duration-300 hover:border-neutral-300 dark:hover:border-white/10 hover:shadow-md"
                                            >
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 shrink-0">
                                                    <ShieldAlert className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">{t("card_safety")}</span>
                                                    <p className="text-sm font-semibold text-pine-green-dark dark:text-white">{t("card_safety_desc")}</p>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* CTA Button */}
                                        <div className="text-center pt-2">
                                            <a
                                                href={phoneHref}
                                                onClick={() => trackPhoneCall("rules_page", phone)}
                                                className="inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-base font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-lg btn-hero-shine group"
                                                style={{
                                                    backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                    boxShadow: "0 10px 30px -8px rgba(var(--active-glow-color, 249, 115, 22), 0.4)"
                                                }}
                                            >
                                                <span className="relative flex h-2 w-2 shrink-0">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                                </span>
                                                <Phone className="h-4 w-4 transition-transform group-hover:animate-shake shrink-0" />
                                                <span>{t("btn_call_host", { phone })}</span>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};
