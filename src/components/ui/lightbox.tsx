"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useCallback } from "react";

interface LightboxProps {
    images: { src: string; alt?: string; title?: string }[];
    selectedIndex: number | null;
    onClose: () => void;
    onNavigate: (index: number) => void;
}

export const Lightbox = ({ images, selectedIndex, onClose, onNavigate }: LightboxProps) => {
    const isOpen = selectedIndex !== null;
    const currentImage = selectedIndex !== null ? images[selectedIndex] : null;

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

    return (
        <AnimatePresence>
            {isOpen && currentImage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
                    onClick={onClose}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Content */}
                    <div
                        className="relative h-full w-full max-w-7xl flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Navigation Buttons */}
                        {selectedIndex > 0 && (
                            <button
                                onClick={() => onNavigate(selectedIndex - 1)}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 disabled:opacity-50"
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </button>
                        )}

                        {selectedIndex < images.length - 1 && (
                            <button
                                onClick={() => onNavigate(selectedIndex + 1)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                            >
                                <ChevronRight className="h-8 w-8" />
                            </button>
                        )}

                        <motion.div
                            key={selectedIndex}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="relative max-h-full max-w-full"
                        >
                            <img
                                src={currentImage.src}
                                alt={currentImage.alt || "Galeria"}
                                className="max-h-[85vh] w-auto max-w-full rounded-md object-contain shadow-2xl"
                            />
                            {currentImage.title && (
                                <div className="mt-4 text-center">
                                    <p className="text-xl font-bold text-white">{currentImage.title}</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
