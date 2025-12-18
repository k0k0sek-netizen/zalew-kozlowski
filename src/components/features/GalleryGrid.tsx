"use client";

import { SectionReveal } from "@/components/ui/section-reveal";
import { Camera } from "lucide-react";
import { useState } from "react";
import { Lightbox } from "@/components/ui/lightbox";

export interface GalleryImage {
    src: string;
    title: string;
    span?: string;
    author?: string;
    date?: string;
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
                        <div
                            key={index}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative overflow-hidden rounded-xl group cursor-pointer ${image.span || "col-span-1 row-span-1"}`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                style={{ backgroundImage: `url('${image.src}')` }}
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="font-bold">{image.title}</p>
                                {image.author && <p className="text-xs opacity-80">fot. {image.author}</p>}
                                {image.date && <p className="text-[10px] opacity-60 mt-0.5">{new Date(image.date).toLocaleDateString('pl-PL')}</p>}
                            </div>
                        </div>
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

