"use client";

import { SectionReveal } from "@/components/ui/section-reveal";
import { useState } from "react";
import { Lightbox } from "@/components/ui/lightbox";
import Image from "next/image";
import contentfulLoader from "@/lib/contentful-loader";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "next-intl";

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

interface GalleryImageItemProps {
    image: GalleryImage;
    onClick: () => void;
    priority?: boolean;
}

const GalleryImageItem = ({ image, onClick, priority }: GalleryImageItemProps) => {
    const t = useTranslations("gallery");
    const locale = useLocale();
    const [isLoaded, setIsLoaded] = useState(false);
    const isLarge = image.span && (image.span.includes("col-span-2") || image.span.includes("sm:col-span-2"));
    const sizes = isLarge
        ? "(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 66vw, (max-width: 1280px) 50vw, 640px"
        : "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 320px";

    const formattedAriaLabel = t("photo_aria", { 
        title: image.title, 
        author: image.author || t("anonymous") 
    });

    return (
        <button
            onClick={onClick}
            disabled={!!image.isOptimistic}
            aria-label={formattedAriaLabel}
            className={cn(
                "relative overflow-hidden rounded-xl group text-left transition-all duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[rgb(var(--active-glow-color,249,115,22))] focus-visible:outline-hidden",
                image.isOptimistic ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:shadow-[0_10px_20px_rgba(var(--active-glow-color,249,115,22),0.15)]",
                image.span || "col-span-1 row-span-1"
            )}
        >
            {/* Skeleton Background */}
            <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-0" />
            
            <Image
                loader={contentfulLoader}
                src={image.src}
                alt={image.title}
                fill
                quality={80}
                priority={priority}
                className={cn(
                    "object-cover transition-all duration-700 ease-out group-hover:scale-110 transform-gpu",
                    isLoaded ? "blur-0 scale-100 opacity-100" : "blur-md scale-105 opacity-0"
                )}
                sizes={sizes}
                onLoad={() => setIsLoaded(true)}
            />
            {image.isOptimistic ? (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-10">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-t-transparent mb-2" />
                    <p className="text-xs font-semibold">{t("sending")}</p>
                </div>
            ) : (
                <>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                    <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <p className="font-bold">{image.title}</p>
                        {image.author && <p className="text-xs opacity-80">{t("photo_by")} {image.author}</p>}
                        {image.date && <p className="text-[10px] opacity-60 mt-0.5">{new Date(image.date).toLocaleDateString(locale === "en" ? "en-US" : "pl-PL")}</p>}
                    </div>
                </>
            )}
        </button>
    );
};

export const GalleryGrid = ({ images }: GalleryGridProps) => {
    const t = useTranslations("gallery");
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    return (
        <>
            {images.length === 0 ? (
                <div className="text-center py-12 opacity-60">
                    <p>{t("empty_gallery")}</p>
                </div>
            ) : (
                <SectionReveal delay={0.2} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px]">
                    {images.map((image, index) => (
                        <GalleryImageItem
                            key={index}
                            image={image}
                            onClick={() => setSelectedIndex(index)}
                            priority={index < 4}
                        />
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
