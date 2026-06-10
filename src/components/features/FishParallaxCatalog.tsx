"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface FishCardProps {
    name: string;
    latin: string;
    description: string;
    weight: string;
    bait: string;
    imageUrl?: string;
    colorFrom: string;
    colorTo: string;
}

const fishData: FishCardProps[] = [
    {
        name: "Karp",
        latin: "Cyprinus carpio",
        description: "Król naszych wód. Waleczny i sprytny. Łowisko obfituje w piękne okazy pełnołuskie i lustrzenie.",
        weight: "do 25 kg",
        bait: "Kulki proteinowe, kukurydza, pellet",
        colorFrom: "from-amber-700/80",
        colorTo: "to-orange-900/80",
        imageUrl: "/bento/ryba2.webp"
    },
    {
        name: "Amur",
        latin: "Ctenopharyngodon idella",
        description: "Azjatycki siłacz, tak zwana 'torpeda'. Bardzo silny przy brzegu, wymaga mocnego sprzętu.",
        weight: "do 20 kg",
        bait: "Kukurydza, kulki owocowe, śliwka",
        colorFrom: "from-emerald-700/80",
        colorTo: "to-pine-green-dark/80",
        imageUrl: "/bento/ryba2.webp"
    },
    {
        name: "Szczupak",
        latin: "Esox lucius",
        description: "Władca trzcin. Drapieżnik pilnujący równowagi w ekosystemie zalewu.",
        weight: "do 12 kg",
        bait: "Woblery, gumy, żywiec",
        colorFrom: "from-slate-700/80",
        colorTo: "to-zinc-900/80",
        imageUrl: "/bento/ryba2.webp"
    }
];

export const FishParallaxCatalog = () => {
    return (
        <div className="w-full py-24 bg-transparent relative z-10">
            <div className="mx-auto max-w-7xl px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] md:animate-shine drop-shadow-sm">
                        Gatunki Ryb
                    </h2>
                    <p className="mt-4 text-earth-brown dark:text-neutral-400 font-sans text-lg">
                        Poznaj mieszkańców Zalewu Kozłowskiego.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {fishData.map((fish, idx) => (
                        <FishParallaxCard key={idx} {...fish} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const FishParallaxCard = ({ name, latin, description, weight, bait, colorFrom, colorTo, imageUrl }: FishCardProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMouse({ x, y });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="group relative h-96 w-full rounded-2xl overflow-hidden cursor-pointer shadow-xl transition-shadow hover:shadow-2xl"
            style={{ perspective: "1000px" }}
        >
            {/* Background Layer - Deep Water effect */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br transition-all duration-500 scale-110",
                colorFrom, colorTo
            )} style={{
                transform: isHovering ? `translate3d(${mouse.x * -10}px, ${mouse.y * -10}px, 0)` : "translate3d(0, 0, 0)",
            }} />

            {/* Subtle Grid / Noise */}
            <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />

            {/* Floating Fish Image (Parallax layer 1) */}
            <div 
                className="absolute inset-0 z-10 flex items-center justify-center transition-transform duration-200 ease-out"
                style={{
                    transform: isHovering ? `translate3d(${mouse.x * 40}px, ${mouse.y * 40}px, 50px) scale(1.1)` : "translate3d(0, 0, 0) scale(1.0)",
                }}
            >
                {imageUrl && (
                    <Image 
                        src={imageUrl} 
                        alt={name} 
                        width={300} 
                        height={300} 
                        className="object-cover w-full h-full drop-shadow-2xl opacity-50 mix-blend-luminosity group-hover:mix-blend-normal group-hover:opacity-100 transition-all duration-500"
                    />
                )}
            </div>

            {/* Foreground Content (Parallax layer 2) */}
            <div 
                className="absolute inset-0 z-20 flex flex-col justify-end p-6 transition-transform duration-200 ease-out"
                style={{
                    transform: isHovering ? `translate3d(${mouse.x * -20}px, ${mouse.y * -20}px, 20px)` : "translate3d(0, 0, 0)",
                }}
            >
                <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-4 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <h3 className="font-display text-2xl font-bold text-white tracking-wide">{name}</h3>
                    <p className="text-xs text-white/50 italic mb-2 font-mono">{latin}</p>
                    
                    <div className="opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-500 overflow-hidden">
                        <p className="text-sm text-white/80 mb-3">{description}</p>
                        <div className="flex flex-col gap-1 text-xs">
                            <div className="flex justify-between border-b border-white/10 pb-1">
                                <span className="text-white/60">Waga:</span>
                                <span className="text-white font-bold">{weight}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="text-white/60">Przynęty:</span>
                                <span className="text-white font-bold text-right pl-2 truncate">{bait}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
