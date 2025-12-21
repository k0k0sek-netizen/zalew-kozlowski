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
                "group relative overflow-hidden rounded-xl",
                "bg-white dark:bg-pine-green-dark border-2 border-transparent dark:border-pine-green/30",
                "drop-shadow-sm transition-shadow duration-300 hover:shadow-2xl",
                className
            )}
            {...props}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(1200px circle at ${position.x}px ${position.y}px, rgba(249, 115, 22, 0.08), transparent 40%)`,
                }}
            />
            {/* Inner Border Gradient */}
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 z-0"
                style={{
                    opacity,
                    background: `radial-gradient(1000px circle at ${position.x}px ${position.y}px, rgba(249, 115, 22, 0.25), transparent 40%)`,
                    maskImage: "linear-gradient(#fff, #fff) padding-box, linear-gradient(#fff, #fff)",
                    WebkitMaskImage: "linear-gradient(#fff, #fff) padding-box, linear-gradient(#fff, #fff)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                }}
            />
            {children}
        </div>
    );
};
