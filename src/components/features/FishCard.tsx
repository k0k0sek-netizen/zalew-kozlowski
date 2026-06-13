"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import contentfulLoader from "@/lib/contentful-loader";
import { TiltCard } from "@/components/ui/TiltCard";

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
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span className="w-20 text-right opacity-70 dark:text-gray-300">{label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-white/10">
                <div
                    className={`h-full ${color} transition-all duration-1000 ease-out`}
                    style={{ width: `${width * 10}%` }}
                />
            </div>
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
    priority?: boolean;
}

export const FishCard = ({ name, description, imageSrc, stats, tags, priority }: FishCardProps) => {
    return (
        <TiltCard
            noBg
            className="group rounded-2xl bg-white/70 backdrop-blur-md shadow-xl dark:bg-white/5 scroll-reveal-card overflow-hidden"
        >
            {/* Image Area */}
            <div className="relative h-48 w-full overflow-hidden z-10">
                <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                <Image
                    loader={contentfulLoader}
                    src={imageSrc}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1152px) 33vw, 384px"
                    priority={priority}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{name}</h3>
                </div>
            </div>

            {/* Content Area */}
            <div className="p-6 relative z-10">
                <div className="mb-6 flex flex-wrap gap-2">
                    {tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 text-[10px] uppercase font-bold bg-pine-green/10 text-pine-green-dark rounded-md dark:bg-white/10 dark:text-neutral-200">
                            {tag}
                        </span>
                    ))}
                </div>

                <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed min-h-[60px]">
                    {description}
                </p>

                {/* Gamified Stats */}
                <div className="space-y-3">
                    <StatBar label="SIŁA" value={stats.strength} color="bg-red-500" />
                    <StatBar label="SPRYT" value={stats.difficulty} color="bg-purple-500" />
                    <StatBar label="AKTYWNOŚĆ" value={stats.activity} color="bg-green-500" />
                </div>
            </div>
        </TiltCard>
    );
};
