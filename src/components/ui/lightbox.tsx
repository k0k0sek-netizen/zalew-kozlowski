"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SPRING_TOKENS } from "@/lib/motion";
import { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import contentfulLoader from "@/lib/contentful-loader";

interface LightboxProps {
    images: { src: string; alt?: string; title?: string; author?: string; date?: string }[];
    selectedIndex: number | null;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export const Lightbox = ({ images, selectedIndex, onClose, onNavigate }: LightboxProps) => {
    const isOpen = selectedIndex !== null;
    const currentImage = selectedIndex !== null ? images[selectedIndex] : null;
    const [mounted, setMounted] = useState(false);

    // Client-side hydration check
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft" && selectedIndex !== null) onNavigate(Math.max(0, selectedIndex - 1));
        if (e.key === "ArrowRight" && selectedIndex !== null) onNavigate(Math.min(images.length - 1, selectedIndex + 1));
    }, [isOpen, onClose, onNavigate, selectedIndex, images.length]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKeyDown]);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && currentImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        aria-label="Zamknij podgląd"
                        className="absolute right-4 top-4 z-[1010] rounded-full bg-white/10 p-3 text-white transition-all duration-300 border border-transparent hover:text-white hover:bg-[rgba(var(--active-glow-color,249,115,22),0.2)] hover:border-[rgba(var(--active-glow-color,249,115,22),0.4)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Content */}
                    <div
                        className="relative h-full w-full max-w-7xl flex items-center justify-center p-4"
                    >
                        {/* Navigation Buttons */}
                        {selectedIndex > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate(selectedIndex - 1);
                                }}
                                aria-label="Poprzednie zdjęcie"
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white transition-all duration-300 border border-transparent hover:text-white hover:bg-[rgba(var(--active-glow-color,249,115,22),0.2)] hover:border-[rgba(var(--active-glow-color,249,115,22),0.4)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                        )}

                        {selectedIndex < images.length - 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate(selectedIndex + 1);
                                }}
                                aria-label="Następne zdjęcie"
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white transition-all duration-300 border border-transparent hover:text-white hover:bg-[rgba(var(--active-glow-color,249,115,22),0.2)] hover:border-[rgba(var(--active-glow-color,249,115,22),0.4)] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))]"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        )}

                        <motion.div
                            key={selectedIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", ...SPRING_TOKENS.bouncy }}
                            className="relative max-h-full max-w-full flex flex-col items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                             <img
                                src={contentfulLoader({ src: currentImage.src, width: 1080, quality: 80 })}
                                srcSet={`${contentfulLoader({ src: currentImage.src, width: 640, quality: 80 })} 640w, ${contentfulLoader({ src: currentImage.src, width: 1080, quality: 80 })} 1080w, ${contentfulLoader({ src: currentImage.src, width: 1920, quality: 80 })} 1920w`}
                                sizes="(max-width: 768px) 100vw, 1920px"
                                alt={currentImage.alt || "Galeria"}
                                className="max-h-[85vh] w-auto max-w-full rounded-md object-contain shadow-2xl"
                            />
                            {currentImage.title && (
                                <div className="mt-4 text-center bg-black/60 backdrop-blur-xs rounded-xl p-3 inline-block mx-auto max-w-lg border border-white/5">
                                    <p className="text-lg font-bold text-white leading-tight">{currentImage.title}</p>
                                    {(currentImage.author || currentImage.date) && (
                                        <p className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-2">
                                            {currentImage.author && <span>fot. <strong className="text-neutral-300">{currentImage.author}</strong></span>}
                                            {currentImage.author && currentImage.date && <span className="opacity-40">|</span>}
                                            {currentImage.date && <span>{new Date(currentImage.date).toLocaleDateString('pl-PL')}</span>}
                                        </p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
