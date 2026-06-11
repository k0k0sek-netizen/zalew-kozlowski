"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface HeroVideoProps {
    videoSrc?: string;
    mobileVideoSrc?: string;
    posterSrc?: string;
}

export const HeroVideo = ({ videoSrc, mobileVideoSrc, posterSrc }: HeroVideoProps) => {
    const [activeVideoSrc, setActiveVideoSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!videoSrc) return;

        const mediaQuery = window.matchMedia("(max-width: 768px)");
        const handleMatch = (e: MediaQueryListEvent | MediaQueryList) => {
            if (e.matches && mobileVideoSrc) {
                setActiveVideoSrc(mobileVideoSrc);
            } else {
                setActiveVideoSrc(videoSrc);
            }
        };

        // Run once on mount
        handleMatch(mediaQuery);

        // Listen for screen size changes
        mediaQuery.addEventListener("change", handleMatch);
        return () => mediaQuery.removeEventListener("change", handleMatch);
    }, [videoSrc, mobileVideoSrc]);

    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-pine-green-dark">
            {/* LCP Optimization: High Priority Poster Image */}
            {posterSrc && (
                <Image
                    src={posterSrc}
                    alt="Zalew Kozłowski"
                    fill
                    priority
                    fetchPriority="high"
                    quality={70}
                    sizes="100vw"
                    className="absolute inset-0 h-full w-full object-cover -z-20 hero-video-scroll"
                />
            )}

            {/* Cinematic Noise Overlay */}
            <div className="absolute inset-0 z-10 bg-[url('/noise.svg')] opacity-[0.035] pointer-events-none mix-blend-overlay" />

            {/* Overlay gradient for text readability and atmosphere */}
            <div
                className="absolute inset-0 z-10 bg-linear-to-b from-black/60 via-black/30 to-pine-green-dark/95 transition-opacity duration-1000"
            />

            {!videoSrc && posterSrc && (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-2000 ease-out animate-zoom-out hero-video-scroll"
                    style={{ backgroundImage: `url('${posterSrc}')` }}
                />
            )}

            {activeVideoSrc && (
                <video
                    key={activeVideoSrc}
                    className="absolute inset-0 h-full w-full object-cover animate-zoom-out hero-video-scroll"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                >
                    <source src={activeVideoSrc} type="video/mp4" />
                </video>
            )}
        </div>
    );
};
