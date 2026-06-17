"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import contentfulLoader from "@/lib/contentful-loader";
import { TiltCard } from "@/components/ui/TiltCard";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { MapPin, Sparkles, Trophy } from "lucide-react";

interface FishStatProps {
    label: string;
    value: number; // 1-10
    color: string;
}

const StatBar = ({ label, value, color }: FishStatProps) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setWidth(value), 500); // Slight delay for impact
        return () => clearTimeout(timer);
    }, [value]);

    return (
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-wider">
            <span className="w-20 sm:w-22 text-right opacity-70 dark:text-gray-300">{label}</span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10 relative">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-out rounded-full`}
                    style={{ width: `${width * 10}%` }}
                />
            </div>
            <span className="w-8 text-left font-mono text-[10px] sm:text-xs opacity-80 dark:text-gray-400">{value}/10</span>
        </div>
    );
};

interface FishCardProps {
    name: string;
    description: string;
    imageSrc: string;
    stats: {
        strength: number;
        difficulty: number;
        activity: number;
    };
    tags: string[];
    whereToFind?: string;
    favBait?: string;
    lakeRecord?: string;
    priority?: boolean;
    layout?: "vertical" | "horizontal" | "horizontal-reverse";
}

export const FishCard = ({ 
    name, 
    description, 
    imageSrc, 
    stats, 
    tags, 
    whereToFind, 
    favBait, 
    lakeRecord, 
    priority,
    layout = "vertical"
}: FishCardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const t = useTranslations("about");

    return (
        <TiltCard
            noBg
            className={cn(
                "group rounded-2xl bg-white/70 backdrop-blur-md shadow-xl dark:bg-white/5 scroll-reveal-card overflow-hidden",
                layout === "horizontal" && "flex flex-col md:flex-row h-full",
                layout === "horizontal-reverse" && "flex flex-col md:flex-row-reverse h-full",
                layout === "vertical" && "flex flex-col h-full"
            )}
        >
            {/* Image Area */}
            <div className={cn(
                "relative overflow-hidden z-10",
                (layout === "horizontal" || layout === "horizontal-reverse")
                    ? "h-48 md:h-auto md:w-[40%] lg:w-[45%] shrink-0"
                    : "h-48 w-full"
            )}>
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-0" />
                <Image
                    loader={contentfulLoader}
                    src={imageSrc}
                    alt={name}
                    fill
                    className={cn(
                        "object-cover transition-all duration-700 ease-out group-hover:scale-110 transform-gpu",
                        isLoaded ? "blur-0 scale-100 opacity-100" : "blur-md scale-105 opacity-0"
                    )}
                    sizes="(max-width: 768px) 100vw, (max-width: 1152px) 33vw, 384px"
                    priority={priority}
                    onLoad={() => setIsLoaded(true)}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100 z-10" />
                <div className={cn(
                    "absolute bottom-4 left-4 z-20",
                    (layout === "horizontal" || layout === "horizontal-reverse") && "md:hidden"
                )}>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{name}</h3>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 relative z-10 flex-1 flex flex-col justify-between">
                <div>
                    {(layout === "horizontal" || layout === "horizontal-reverse") && (
                        <h3 className="hidden md:block text-2xl font-black text-pine-green-dark dark:text-white uppercase tracking-tight mb-3">
                            {name}
                        </h3>
                    )}
                    <div className="mb-6 flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 text-[10px] uppercase font-bold bg-pine-green/10 text-pine-green-dark rounded-md dark:bg-white/10 dark:text-neutral-200">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <p className={cn(
                        "mb-6 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed",
                        layout === "vertical" && "min-h-[60px]"
                    )}>
                        {description}
                    </p>

                    {/* Biology Details */}
                    {(whereToFind || favBait || lakeRecord) && (
                        <div className="mb-6 space-y-3.5 border-t border-neutral-100 dark:border-white/5 pt-5 text-xs text-neutral-600 dark:text-neutral-400">
                            {whereToFind && (
                                <div className="flex gap-2.5 items-start">
                                    <MapPin className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                                    <div>
                                        <span className="font-bold text-pine-green dark:text-neutral-300 block mb-0.5 uppercase tracking-wide text-[10px]">
                                            {t("where_to_find")}
                                        </span>
                                        <span className="leading-relaxed">{whereToFind}</span>
                                    </div>
                                </div>
                            )}
                            {favBait && (
                                <div className="flex gap-2.5 items-start">
                                    <Sparkles className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                                    <div>
                                        <span className="font-bold text-pine-green dark:text-neutral-300 block mb-0.5 uppercase tracking-wide text-[10px]">
                                            {t("fav_bait")}
                                        </span>
                                        <span className="leading-relaxed">{favBait}</span>
                                    </div>
                                </div>
                            )}
                            {lakeRecord && (
                                <div className="flex gap-2.5 items-start">
                                    <Trophy className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                                    <div>
                                        <span className="font-bold text-pine-green dark:text-neutral-300 block mb-0.5 uppercase tracking-wide text-[10px]">
                                            {t("lake_record")}
                                        </span>
                                        <span className="leading-relaxed font-mono">{lakeRecord}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Gamified Stats */}
                <div className="space-y-3">
                    <StatBar label={t("stat_strength")} value={stats.strength} color="bg-gradient-to-r from-red-500 to-rose-500" />
                    <StatBar label={t("stat_cunning")} value={stats.difficulty} color="bg-gradient-to-r from-purple-500 to-indigo-500" />
                    <StatBar label={t("stat_activity")} value={stats.activity} color="bg-gradient-to-r from-green-500 to-emerald-500" />
                </div>
            </div>
        </TiltCard>
    );
};
