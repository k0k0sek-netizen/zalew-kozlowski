"use client";

import { cn } from "@/lib/utils";
import { InteractiveGridCanvas } from "./InteractiveGridCanvas";

interface SpotlightSectionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    as?: any;
}

export const SpotlightSectionWrapper = ({ children, className = "", as: Component = "div", ...props }: SpotlightSectionWrapperProps) => {
    return (
        <Component
            className={cn("relative overflow-hidden bg-aurora-dots", className)}
            {...props}
        >
            {/* Interactive Canvas Dot Grid (Google Stitch Repel + Glow Physics) */}
            <InteractiveGridCanvas className="-z-10" />
            {children}
        </Component>
    );
};
