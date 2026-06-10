"use client";

import { useOptimistic, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GalleryGrid, GalleryImage } from "./GalleryGrid";
import { GalleryUploadForm } from "./GalleryUploadForm";
import { SectionReveal } from "@/components/ui/section-reveal";

interface GalleryClientContainerProps {
    initialImages: GalleryImage[];
}

export const GalleryClientContainer = ({ initialImages }: GalleryClientContainerProps) => {
    const router = useRouter();

    // React 19 useOptimistic to add new uploads instantly to the grid
    const [optimisticImages, addOptimisticImage] = useOptimistic(
        initialImages,
        (state, newImage: GalleryImage) => [newImage, ...state]
    );

    // Automatyczne odświeżanie w tle (Polling) co 30 sekund
    // Dzięki temu, gdy administrator zaakceptuje zdjęcie w CMS, pojawi się ono samo u wszystkich przeglądających.
    useEffect(() => {
        const interval = setInterval(() => {
            router.refresh();
        }, 30000);
        return () => clearInterval(interval);
    }, [router]);

    return (
        <>
            <GalleryGrid images={optimisticImages} />
            <SectionReveal delay={0.4} className="mt-24 mb-12">
                <GalleryUploadForm onOptimisticAdd={addOptimisticImage} />
            </SectionReveal>
        </>
    );
};
