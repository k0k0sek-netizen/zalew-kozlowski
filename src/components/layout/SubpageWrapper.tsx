"use client";

import { SpotlightSectionWrapper } from "@/components/ui/spotlight-section-wrapper";
import { cn } from "@/lib/utils";

interface SubpageWrapperProps {
    children: React.ReactNode;
    className?: string;
    as?: any;
    hideTopFade?: boolean;
    hideBottomFade?: boolean;
}

export const SubpageWrapper = ({
    children,
    className = "",
    as = "div",
    hideTopFade = false,
    hideBottomFade = false,
}: SubpageWrapperProps) => {
    return (
        <SpotlightSectionWrapper
            as={as}
            className={cn(
                "min-h-screen bg-sand-beige dark:bg-[#071610] bg-aurora-dots pt-24 pb-36 relative px-0",
                className
            )}
        >
            {/* Top Fade-in transition to mask the start of dots and aurora under the floating navbar */}
            {!hideTopFade && (
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sand-beige dark:from-[#071610] to-transparent z-[2] pointer-events-none" />
            )}

            {children}

            {/* Bottom Fade-out transition to smooth entry into the footer */}
            {!hideBottomFade && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-clay-gray dark:from-pine-green-dark to-transparent z-[2] pointer-events-none" />
            )}
        </SpotlightSectionWrapper>
    );
};
