"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CookieConsentProps {
    privacyPolicyUrl?: string;
}

export const CookieConsent = ({ privacyPolicyUrl = "/polityka-prywatnosci" }: CookieConsentProps) => {
    const t = useTranslations("cookies");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookie-consent");
        if (consent) return;

        // Pokazuj baner dopiero po pierwszej interakcji użytkownika (scroll/klik).
        const show = () => setIsVisible(true);
        window.addEventListener("scroll", show, { once: true, passive: true });
        window.addEventListener("pointerdown", show, { once: true });

        return () => {
            window.removeEventListener("scroll", show);
            window.removeEventListener("pointerdown", show);
        };
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    role="region"
                    aria-label={t("region_aria")}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div 
                        className="mx-auto max-w-4xl rounded-xl border border-pine-green/20 dark:border-white/10 bg-sand-beige/95 dark:bg-pine-green-dark/95 p-6 shadow-2xl backdrop-blur-md text-pine-green-dark dark:text-sand-beige transition-colors duration-300"
                    >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative">
                            <div className="flex-1 pr-6 md:pr-0">
                                <h3 className="mb-2 text-lg font-semibold text-pine-green-dark dark:text-white">
                                    {t("title")}
                                </h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                    {t("desc")}
                                    <Link href={privacyPolicyUrl} className="text-sunset-orange hover:underline font-medium">
                                        {t("privacy_link")}
                                    </Link>.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row shrink-0 mt-2 md:mt-0">
                                <button
                                    onClick={handleDecline}
                                    className="rounded-lg border border-pine-green/20 dark:border-white/20 px-5 py-2 text-sm font-semibold text-pine-green-dark dark:text-white transition-all hover:bg-pine-green/5 dark:hover:bg-white/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange animate-none"
                                >
                                    {t("btn_decline")}
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="rounded-lg bg-pine-green dark:bg-white px-6 py-2 text-sm font-bold text-white dark:text-pine-green-dark shadow-md transition-all hover:scale-105 hover:bg-pine-green/90 dark:hover:bg-white/95 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunset-orange cursor-pointer"
                                >
                                    {t("btn_accept")}
                                </button>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute -right-2 -top-2 rounded-full p-1.5 text-neutral-400 hover:bg-pine-green/5 dark:hover:bg-white/10 hover:text-pine-green-dark dark:hover:text-white md:hidden"
                                aria-label={t("close_aria")}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

