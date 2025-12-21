"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CookieConsentProps {
    privacyPolicyUrl?: string;
}

export const CookieConsent = ({ privacyPolicyUrl = "/polityka-prywatnosci" }: CookieConsentProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            // Show banner immediately to minimize LCP delay if this element is picked by Lighthouse
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
        // Force re-render of analytics component via custom event or reload
        // For now, simpler approach: simple reload ensures all scripts fire correctly
        // window.location.reload(); // Removed to prevent refresh
    };

    const handleDecline = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="mx-auto max-w-4xl rounded-xl border border-pine-green/30 bg-pine-green-dark/95 p-6 shadow-2xl backdrop-blur-md dark:border-white/10 text-sand-beige">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                                <h3 className="mb-2 text-lg font-semibold text-white">
                                    Szanujemy Twoją prywatność 🍪
                                </h3>
                                <p className="text-sm text-neutral-300">
                                    Używamy plików cookie, aby zapewnić najlepszą jakość korzystania z naszej strony.
                                    Możesz dowiedzieć się więcej w naszej{" "}
                                    <Link href={privacyPolicyUrl} className="text-sunset-orange hover:underline">
                                        Polityce Prywatności
                                    </Link>.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    onClick={handleDecline}
                                    className="rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                                >
                                    Odrzuć
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="rounded-lg bg-sunset-orange px-6 py-2 text-sm font-bold text-pine-green-dark shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    Akceptuję
                                </button>
                            </div>
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute right-2 top-2 rounded-full p-1 text-neutral-400 hover:bg-white/10 hover:text-white md:hidden"
                                aria-label="Zamknij powiadomienie o plikach cookie"
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
