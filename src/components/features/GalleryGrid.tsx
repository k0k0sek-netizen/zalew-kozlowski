"use client";

import { SectionReveal } from "@/components/ui/section-reveal";
import { Camera } from "lucide-react";
import { useState } from "react";
import { Lightbox } from "@/components/ui/lightbox";
import Image from "next/image";
import contentfulLoader from "@/lib/contentful-loader";

export interface GalleryImage {
    src: string;
    title: string;
    span?: string;
    author?: string;
    date?: string;
    isOptimistic?: boolean;
}

interface GalleryGridProps {
    images: GalleryImage[];
}

export const GalleryGrid = ({ images }: GalleryGridProps) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    return (
        <>
            {images.length === 0 ? (
                <div className="text-center py-12 opacity-60">
                    <p>Galeria jest jeszcze pusta. Bądź pierwszy!</p>
                </div>
            ) : (
                <SectionReveal delay={0.2} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px]">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => !image.isOptimistic && setSelectedIndex(index)}
                            disabled={!!image.isOptimistic}
                            aria-label={`Zdjęcie: ${image.title}${image.author ? `, autor: ${image.author}` : ""}`}
                            className={`relative overflow-hidden rounded-xl group text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))] focus-visible:outline-hidden ${image.isOptimistic ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:shadow-[0_10px_20px_rgba(var(--active-glow-color,249,115,22),0.15)]"} ${image.span || "col-span-1 row-span-1"}`}
                        >
                            <Image
                                loader={contentfulLoader}
                                src={image.src}
                                alt={image.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 320px"
                            />
                            {image.isOptimistic ? (
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-t-transparent mb-2" />
                                    <p className="text-xs font-semibold">Wysyłanie...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <p className="font-bold">{image.title}</p>
                                        {image.author && <p className="text-xs opacity-80">fot. {image.author}</p>}
                                        {image.date && <p className="text-[10px] opacity-60 mt-0.5">{new Date(image.date).toLocaleDateString('pl-PL')}</p>}
                                    </div>
                                </>
                            )}
                        </button>
                    ))}
                </SectionReveal>
            )}

            <Lightbox
                images={images}
                selectedIndex={selectedIndex}
                onClose={() => setSelectedIndex(null)}
                onNavigate={setSelectedIndex}
            />
        </>
    );
};

