"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const SpotlightCard = ({ children, className = "", ...props }: SpotlightCardProps) => {
    const divRef = useRef<HTMLDivElement>(null);
    const [opacity, setOpacity] = useState(0);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const handleFocus = () => {
        setOpacity(1);
    };

    const handleBlur = () => {
        setOpacity(0);
    };

    const handleMouseEnter = () => {
        setOpacity(1);
    };

    const handleMouseLeave = () => {
        setOpacity(0);
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative overflow-hidden rounded-xl transition-all duration-300",
                "bg-white/70 backdrop-blur-md dark:bg-white/5",
                "drop-shadow-sm hover:shadow-2xl",
                className
            )}
            {...props}
        >
            {/* Static Base Border (drawn inside to prevent clipping) */}
            <div className="pointer-events-none absolute inset-0 border border-earth-brown/10 dark:border-pine-green/20 rounded-[inherit] z-10" />

            {/* Inner background glow (behind content) */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(1200px circle at ${position.x}px ${position.y}px, rgba(var(--active-glow-color, 249, 115, 22), 0.25), transparent 40%)`,
                }}
            />
            {/* Inner Border Gradient (rendered exactly on top of the static border) */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-20 rounded-[inherit]"
                style={{
                    opacity,
                    border: "1px solid rgba(var(--active-glow-color, 249, 115, 22), 0.95)",
                    maskImage: `radial-gradient(250px circle at ${position.x}px ${position.y}px, black 30%, transparent 70%)`,
                    WebkitMaskImage: `radial-gradient(250px circle at ${position.x}px ${position.y}px, black 30%, transparent 70%)`,
                }}
            />
            {children}
        </div>
    );
};
