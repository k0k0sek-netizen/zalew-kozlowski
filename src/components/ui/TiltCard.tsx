"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    glowColor?: string; // RGB values or CSS var
    noBorder?: boolean;
    noBg?: boolean;
}

export const TiltCard = ({ 
    children, 
    className = "", 
    glowColor = "var(--active-glow-color, 249, 115, 22)", 
    noBorder = false,
    noBg = false,
    ...props 
}: TiltCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setMouse({ x, y });
    };

    const handleFocus = () => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        // Center the spotlight on focus
        setMouse({ x: rect.width / 2, y: rect.height / 2 });
        setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) {
            return;
        }
        setIsFocused(false);
    };

    const showGlow = isHovering || isFocused;

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={cn(
                "group relative rounded-2xl overflow-hidden drop-shadow-sm",
                !noBg && "bg-white dark:bg-pine-green-dark",
                className
            )}
            style={{
                transform: showGlow ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
                boxShadow: showGlow ? "0 20px 40px -15px rgba(12, 37, 28, 0.15)" : "none",
                transition: "transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease-out, border-color 0.3s ease-out, background-color 0.3s ease-out",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transformStyle: "flat",
                isolation: "isolate",
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                maskImage: "-webkit-radial-gradient(white, black)"
            }}
            {...props}
        >
            {/* Static Base Border (drawn inside to prevent clipping) */}
            {!noBorder && (
                <div className="pointer-events-none absolute inset-0 border border-pine-green/10 dark:border-white/5 rounded-[inherit] z-10" />
            )}

            {/* Mouse-tracking radial gradient overlay (inside, on top of background but behind text) */}
            <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
                style={{
                    opacity: showGlow ? 1 : 0,
                    background: `radial-gradient(300px circle at ${mouse.x}px ${mouse.y}px, rgba(${glowColor}, 0.25), transparent 80%)`,
                }}
            />

            {/* Border Spotlight (rendered exactly on top of the 1px static border) */}
            {!noBorder && (
                <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-20 rounded-[inherit]"
                    style={{
                        opacity: showGlow ? 1 : 0,
                        border: `1px solid rgba(${glowColor}, 0.9)`,
                        maskImage: `radial-gradient(250px circle at ${mouse.x}px ${mouse.y}px, black 20%, transparent 70%)`,
                        WebkitMaskImage: `radial-gradient(250px circle at ${mouse.x}px ${mouse.y}px, black 20%, transparent 70%)`,
                    }}
                />
            )}

            {children}
        </div>
    );
};
