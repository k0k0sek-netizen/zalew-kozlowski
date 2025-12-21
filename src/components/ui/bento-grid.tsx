import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SpotlightCard } from "./spotlight-card";

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
}

export const BentoCard = ({
    name,
    className,
    background,
    Icon,
    description,
    href,
    cta,
}: BentoCardProps) => {
    return (
        <SpotlightCard
            className={cn(
                "col-span-3 flex flex-col justify-between",
                className
            )}
        >
            <div className="absolute inset-0 z-0">{background}</div>

            <div className="relative z-20 pointer-events-none flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 md:group-hover:-translate-y-10">
                <Icon className="h-12 w-12 origin-left transform-gpu text-earth-brown dark:text-sand-beige transition-all duration-300 ease-in-out md:group-hover:scale-75 md:group-hover:text-sunset-orange" />
                <h3 className="text-xl font-semibold text-pine-green-dark dark:text-white md:group-hover:text-sunset-orange transition-colors">
                    {name}
                </h3>
                <p className="max-w-lg text-neutral-500 dark:text-neutral-300">{description}</p>
            </div>

            <div
                className={cn(
                    "pointer-events-none absolute bottom-0 z-20 flex w-full transform-gpu flex-row items-center p-4 transition-all duration-300",
                    "translate-y-0 opacity-100", // Mobile: Always visible
                    "md:translate-y-10 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100" // Desktop: Hover reveal
                )}
            >
                <Link
                    href={href}
                    className="pointer-events-auto flex items-center gap-2 rounded-lg bg-sunset-orange px-4 py-2 text-sm font-bold text-pine-green-dark shadow-md transition-all hover:bg-orange-700 hover:scale-105"
                >
                    {cta}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/5 group-hover:dark:bg-white/5 z-10" />
        </SpotlightCard >
    );
};
