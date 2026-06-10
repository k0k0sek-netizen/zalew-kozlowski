import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TiltCard } from "./TiltCard";
import { TransitionLink } from "./TransitionLink";

export const BentoGrid = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                "grid w-full auto-rows-[22rem] grid-cols-1 gap-4 md:grid-cols-3",
                className
            )}
        >
            {children}
        </div>
    );
};

interface BentoCardProps {
    name: string;
    className?: string;
    background: ReactNode;
    Icon: React.ElementType;
    description: string;
    href: string;
    cta: string;
    glowColor?: string;
}

export const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
    glowColor,
}: BentoCardProps) => {
    return (
        <TiltCard
            glowColor={glowColor}
            noBg
            className={cn(
                "col-span-3 flex flex-col justify-between",
                className
            )}
        >
            <div className="bento-parallax-bg">{background}</div>

            <div className="bento-parallax-content-slide relative z-20 pointer-events-none flex transform-gpu flex-col gap-1 p-6">
                <Icon className="h-12 w-12 origin-left transform-gpu text-sunset-orange transition-all duration-500 cubic-bezier-spring md:group-hover:scale-75 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                <h3 className="text-xl font-semibold text-white md:group-hover:text-sunset-orange transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {name}
                </h3>
                <p className="max-w-lg text-stone-100 font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">{description}</p>
            </div>

            <div
                className={cn(
                    "pointer-events-none absolute bottom-0 z-20 flex w-full transform-gpu flex-row items-center p-4 transition-all duration-300",
                    "translate-y-0 opacity-100", // Mobile: Always visible
                    "md:translate-y-10 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100" // Desktop: Hover reveal
                )}
            >
                <TransitionLink
                    href={href}
                    className="btn-ai-glow pointer-events-auto"
                >
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                </TransitionLink>
            </div>

            <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/5 group-hover:dark:bg-white/5 z-10" />
        </TiltCard >
    );
};
