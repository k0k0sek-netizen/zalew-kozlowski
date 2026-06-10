"use client";

import { useState, useEffect } from "react";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Phone, MessageSquare, ShieldCheck, Calendar, Info } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";
import { cn } from "@/lib/utils";
import { trackPhoneCall, trackSmsSend } from "@/lib/analytics";
import { motion } from "framer-motion";
import { SPRING_TOKENS } from "@/lib/motion";

type TypeType = "karp" | "ogolne" | "pytanie";
type DurationType = "1d" | "weekend" | "dluzszy";

interface ContactClientProps {
    phone?: string;
    email?: string;
}

export const ContactClient = ({ phone = "601 389 365", email = "lowiskokozlow@gmail.com" }: ContactClientProps) => {
    const [type, setType] = useState<TypeType>("karp");
    const [duration, setDuration] = useState<DurationType>("weekend");
    const [customText, setCustomText] = useState("");
    const [smsBody, setSmsBody] = useState("");

    // Generowanie treści SMS przy każdej zmianie parametrów
    useEffect(() => {
        let text = "";
        if (type === "karp") {
            const durText = duration === "1d" 
                ? "jednodobową" 
                : duration === "weekend" 
                    ? "weekendową (2 doby)" 
                    : "dłuższą";
            text = `Dzień dobry, chciałbym zarezerwować stanowisko na ${durText} zasiadkę karpiową na Zalewie Kozłowskim. Proszę o potwierdzenie dostępności.`;
        } else if (type === "ogolne") {
            const durText = duration === "1d" 
                ? "jednodniowe" 
                : duration === "weekend" 
                    ? "dwudniowe" 
                    : "kilkudniowe";
            text = `Dzień dobry, chciałbym zarezerwować stanowisko na ${durText} wędkowanie ogólne na Zalewie Kozłowskim. Proszę o informację o dostępnych miejscach.`;
        } else {
            text = `Dzień dobry, piszę z pytaniem odnośnie łowiska Zalew Kozłowski: ${customText}`;
        }
        setSmsBody(text);
    }, [type, duration, customText]);

    return (
        <SpotlightCard 
            className="flex flex-col bg-white/70 dark:bg-pine-green-dark/40 backdrop-blur-md p-8 text-pine-green-dark dark:text-white relative overflow-hidden transition-all duration-300 border border-earth-brown/10 dark:border-white/10"
            style={{
                borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
            } as React.CSSProperties}
        >
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                    <h2 className="mb-2 text-2xl font-bold">Interaktywna Rezerwacja</h2>
                    <p className="text-sm opacity-80 mb-6 text-earth-brown dark:text-neutral-300">
                        Skonfiguruj rezerwację w kilka sekund i wyślij gotowy szablon SMS lub zadzwoń.
                    </p>

                    {/* Wybór typu */}
                    <div className="space-y-3 mb-5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Co planujesz?</span>
                        <div className="flex flex-wrap gap-1.5 bg-neutral-100/50 dark:bg-white/5 p-1 rounded-2xl md:rounded-full border border-neutral-200/30 dark:border-white/5 relative overflow-hidden">
                            {[
                                { id: "karp", label: "Zasiadka Karpiowa 🎣" },
                                { id: "ogolne", label: "Wędkowanie Ogólne 🐟" },
                                { id: "pytanie", label: "Inne Pytanie 💬" }
                            ].map((opt) => (
                                <button
                                    key={opt.id}
                                    type="button"
                                    onClick={() => setType(opt.id as TypeType)}
                                    className={cn(
                                        "relative px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer flex-1 text-center min-w-[120px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                        type === opt.id 
                                            ? "text-white" 
                                            : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                    )}
                                >
                                    {type === opt.id && (
                                        <motion.div
                                            layoutId="contact-type-active"
                                            className="absolute inset-0 rounded-full z-0"
                                            style={{
                                                backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                boxShadow: "0 4px 12px -3px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                            }}
                                            transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                        />
                                    )}
                                    <span className="relative z-10">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wybór czasu (ukrywany, jeśli wybrane inne pytanie) */}
                    {type !== "pytanie" && (
                        <div className="space-y-3 mb-6">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Na jak długo?</span>
                            <div className="flex flex-wrap gap-1.5 bg-neutral-100/50 dark:bg-white/5 p-1 rounded-2xl md:rounded-full border border-neutral-200/30 dark:border-white/5 relative overflow-hidden">
                                {[
                                    { id: "1d", label: "1 Doba" },
                                    { id: "weekend", label: "Weekend (2 doby)" },
                                    { id: "dluzszy", label: "Dłuższy pobyt" }
                                ].map((opt) => (
                                    <button
                                        key={opt.id}
                                        type="button"
                                        onClick={() => setDuration(opt.id as DurationType)}
                                        className={cn(
                                            "relative px-4 py-2 rounded-full text-xs font-bold transition-colors duration-300 cursor-pointer flex-1 text-center min-w-[90px] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]",
                                            duration === opt.id 
                                                ? "text-white" 
                                                : "text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
                                        )}
                                    >
                                        {duration === opt.id && (
                                            <motion.div
                                                layoutId="contact-duration-active"
                                                className="absolute inset-0 rounded-full z-0"
                                                style={{
                                                    backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                                    boxShadow: "0 4px 12px -3px rgba(var(--active-glow-color, 249, 115, 22), 0.3)"
                                                }}
                                                transition={{ type: "spring", ...SPRING_TOKENS.snappy }}
                                            />
                                        )}
                                        <span className="relative z-10">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pole tekstowe dla innego pytania */}
                    {type === "pytanie" && (
                        <div className="space-y-2 mb-6">
                            <label htmlFor="custom-question" className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                                Wpisz treść pytania
                            </label>
                            <textarea
                                id="custom-question"
                                rows={3}
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                placeholder="Wpisz treść swojego pytania..."
                                className="w-full p-3.5 rounded-xl bg-neutral-100/50 dark:bg-black/20 border border-neutral-200 dark:border-white/10 text-sm text-pine-green-dark dark:text-white placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-hidden focus:ring-2 focus:ring-[rgb(var(--active-glow-color,249,115,22))] transition-all resize-none"
                            />
                        </div>
                    )}

                    {/* Podgląd wiadomości SMS */}
                    <div className="p-4 rounded-xl bg-neutral-100/50 dark:bg-black/30 border border-neutral-200/50 dark:border-white/5 mb-6">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                            <MessageSquare className="h-3 w-3 text-[rgb(var(--active-glow-color,249,115,22))]" />
                            Podgląd wiadomości SMS
                        </div>
                        <p className="text-xs italic text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            "{smsBody}"
                        </p>
                    </div>
                </div>

                {/* Przyciski Akcji */}
                <div className="space-y-3">
                    <Magnetic strength={0.1}>
                        <a 
                            href={`sms:${phone.replace(/\s+/g, "")}?body=${encodeURIComponent(smsBody)}`}
                            onClick={() => trackSmsSend("contact_page", phone)}
                            className="flex items-center justify-center gap-2.5 rounded-full py-3.5 text-center font-bold text-white transition-all hover:scale-102 active:scale-98 shadow-md btn-hero-shine group text-sm w-full cursor-pointer"
                            style={{
                                backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                                boxShadow: "0 10px 20px -5px rgba(var(--active-glow-color, 249, 115, 22), 0.45)"
                            }}
                        >
                            <MessageSquare className="h-4 w-4 shrink-0" />
                            Wyślij SMS rezerwacyjny
                        </a>
                    </Magnetic>

                    <Magnetic strength={0.1}>
                        <a 
                            href={`tel:${phone.replace(/\s+/g, "")}`}
                            onClick={() => trackPhoneCall("contact_page", phone)}
                            className="flex items-center justify-center gap-2.5 rounded-full py-3.5 text-center font-bold text-neutral-700 hover:text-pine-green-dark dark:text-neutral-200 dark:hover:text-white transition-all bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-sm w-full cursor-pointer hover:scale-102 active:scale-98"
                        >
                            <Phone className="h-4 w-4 shrink-0 transition-transform group-hover:animate-shake" />
                            Zadzwoń do gospodarza
                        </a>
                    </Magnetic>
                </div>
            </div>
        </SpotlightCard>
    );
};
