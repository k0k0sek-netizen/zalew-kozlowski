"use client";

import { useState } from "react";
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
    Award
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

    const tabs = [
        { id: "general", label: t("tab_general"), icon: FileText },
        { id: "safety", label: t("tab_safety"), icon: ShieldAlert },
        { id: "contact", label: t("tab_help"), icon: HelpCircle },
    ] as const;

    // Funkcja do sprawdzania czy zasada jest kluczowa (np. NO KILL, maty, odkażacze)
    const isHighlightRule = (rule: string) => {
        const uppercaseRule = rule.toUpperCase();
        return (
            uppercaseRule.includes("NO KILL") ||
            uppercaseRule.includes("HAK") ||
            uppercaseRule.includes("MATY") ||
            uppercaseRule.includes("KOŁYSK") ||
            uppercaseRule.includes("ODKAŻA") ||
            uppercaseRule.includes("ŚRODEK DEZYNFEK") ||
            uppercaseRule.includes("ZASAD") ||
            uppercaseRule.includes("HOOK") ||
            uppercaseRule.includes("MAT") ||
            uppercaseRule.includes("CRADLE") ||
            uppercaseRule.includes("DISINFECT") ||
            uppercaseRule.includes("ANTISEPTIC") ||
            uppercaseRule.includes("CATCH AND RELEASE")
        );
    };

    // Filtrowanie zasad na kluczowe i standardowe
    const highlightRules = generalRules?.fields.rules.filter(r => isHighlightRule(r)) || [];
    const standardRules = generalRules?.fields.rules.filter(r => !isHighlightRule(r)) || [];

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start mt-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">

                {/* Tab Navigation Menu */}
                <div 
                    role="tablist"
                    aria-label="Wybór kategorii regulaminu"
                    className="flex overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 lg:flex-col gap-2 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0"
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
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "relative flex items-center gap-3 px-5 py-3 rounded-full lg:rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                    isActive 
                                        ? "text-white" 
                                        : "text-pine-green dark:text-neutral-400 hover:bg-pine-green/5 dark:hover:bg-white/5"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-rules-tab"
                                        className="absolute inset-0 rounded-full lg:rounded-xl z-0"
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

            {/* Content Area */}
            <div className="lg:col-span-8">
                <AnimatePresence mode="wait">
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
                        className="focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]/50 rounded-2xl"
                    >
                        {/* Tab Content 1: Zasady Ogólne */}
                        {activeTab === "general" && generalRules && (
                            <div className="space-y-6">
                                {/* Highlights Grid (Zasady Kluczowe) */}
                                {highlightRules.length > 0 && (
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
                                            <Award className="h-3.5 w-3.5 text-[rgb(var(--active-glow-color,249,115,22))]" />
                                            {t("highlight_title")}
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {highlightRules.map((rule, idx) => (
                                                <SpotlightCard 
                                                    key={idx} 
                                                    className="p-5 rounded-2xl border"
                                                    style={{ borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.15)" }}
                                                >
                                                    <div className="relative z-10 flex gap-3.5">
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                                            <CheckCircle className="h-5 w-5" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{t("fish_requirement")}</span>
                                                            <p className="text-sm font-semibold text-pine-green-dark dark:text-neutral-100 leading-snug">
                                                                {rule}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </SpotlightCard>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pozostałe zasady standardowe */}
                                <SpotlightCard className="rounded-2xl p-6 md:p-8">
                                    <div className="relative z-10">
                                        <h3 className="text-lg font-bold text-pine-green-dark dark:text-white mb-4">
                                            {t("standard_rules_title")}
                                        </h3>
                                        <ul className="space-y-4">
                                            {standardRules.map((rule, idx) => (
                                                <li key={idx} className="flex items-start gap-3 text-pine-green-dark dark:text-neutral-200">
                                                    <CheckCircle className="mt-1 h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    <span className="text-sm leading-relaxed">{rule}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </SpotlightCard>
                            </div>
                        )}

                        {/* Tab Content 2: Bezpieczeństwo i Monitoring */}
                        {activeTab === "safety" && safetyRules && (
                            <div className="space-y-6">
                                <SpotlightCard className="rounded-2xl p-6 md:p-8 border-2 border-red-200 dark:border-red-900/30">
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-5">
                                            {safetyRules.fields.title}
                                        </h3>
                                        
                                        <div className="grid gap-6 md:grid-cols-12 items-stretch">
                                            {/* List of restrictions */}
                                            <div className="md:col-span-7">
                                                <ul className="space-y-3">
                                                    {safetyRules.fields.rules?.map((rule, idx) => {
                                                        const isForbidden = rule.toUpperCase().includes("ZABRONIONE") || rule.toUpperCase().includes("FORBIDDEN");
                                                        return (
                                                            <li 
                                                                key={idx} 
                                                                className={cn(
                                                                    "flex items-start gap-2.5 text-sm leading-relaxed",
                                                                    isForbidden 
                                                                        ? "font-bold text-red-600 dark:text-red-400" 
                                                                        : "text-pine-green-dark dark:text-neutral-200"
                                                                )}
                                                            >
                                                                <XCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
                                                                <span>{rule}</span>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>

                                            {/* CCTV Monitoring Visual Box */}
                                            <div className="md:col-span-5 flex flex-col items-center justify-center rounded-xl bg-pine-green-dark p-6 text-white relative overflow-hidden min-h-[160px]">
                                                <div className="relative z-10 flex flex-col items-center gap-2">
                                                    <Cctv className="h-16 w-16 text-[rgb(var(--active-glow-color,249,115,22))]" />
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-2">
                                                        {t("monitoring_title")}
                                                    </span>
                                                </div>
                                                {/* Recording dot animation */}
                                                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/45 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider text-red-500 border border-red-500/20">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                                                    REC
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </div>
                        )}

                        {/* Tab Content 3: Pomoc & Rezerwacje */}
                        {activeTab === "contact" && (
                            <div className="space-y-6">
                                <SpotlightCard className="rounded-2xl p-6 md:p-8">
                                    <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center py-4">
                                        <div className="p-4 rounded-full bg-pine-green/5 dark:bg-white/5 border border-pine-green/10 dark:border-white/10 mb-4 flex items-center justify-center">
                                            <Phone className="h-8 w-8 text-[rgb(var(--active-glow-color,249,115,22))] animate-pulse" />
                                        </div>
                                        <h3 className="text-xl font-bold text-pine-green-dark dark:text-white">
                                            {t("have_questions")}
                                        </h3>
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm leading-relaxed">
                                            {t("have_questions_desc")}
                                        </p>
                                        
                                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
                                            <div 
                                                className="p-4 rounded-xl bg-pine-green/5 dark:bg-white/5 border border-pine-green/10 dark:border-white/10 flex items-center gap-3 transition-all duration-300 hover:scale-[1.03] hover:bg-pine-green/10 dark:hover:bg-white/10 group cursor-default"
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
                                                className="p-4 rounded-xl bg-pine-green/5 dark:bg-white/5 border border-pine-green/10 dark:border-white/10 flex items-center gap-3 transition-all duration-300 hover:scale-[1.03] hover:bg-pine-green/10 dark:hover:bg-white/10 group cursor-default"
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
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};
