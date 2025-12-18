
import { GalleryUploadForm } from "@/components/features/GalleryUploadForm";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { GalleryGrid, GalleryImage } from "@/components/features/GalleryGrid";
import { contentfulClient, GalleryPhotoSkeleton } from "@/lib/contentful";

export const metadata: Metadata = {
    title: "Galeria | Zalew Kozłowski",
    description: "Zobacz zdjęcia naszych gości i piękne okazy złowione na Zalewie Kozłowskim. Dołącz do naszej społeczności!",
};

// Fallback data (gdyby Contentful był pusty lub niedostępny)
const fallbackImages: GalleryImage[] = [
    {
        src: "https://images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=2670",
        title: "Adam, Karp 12kg",
        span: "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2"
    },
    {
        src: "https://images.unsplash.com/photo-1498146831523-fbe4104726f7?q=80&w=2662",
        title: "Zachód Słońca"
    },
    {
        src: "https://images.unsplash.com/photo-1522858547137-f1dcec554f55?q=80&w=2670",
        title: "Stanowisko 4"
    },
    {
        src: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2670",
        title: "Poranne Mgły",
        span: "col-span-1 row-span-1 sm:col-span-2"
    },
    {
        src: "https://images.unsplash.com/photo-1536739678839-8664157b8c7f?q=80&w=2487",
        title: "Amur 8kg",
        span: "col-span-1 row-span-2"
    },
    {
        src: "https://images.unsplash.com/photo-1504280506338-331291887e3f?q=80&w=2574",
        title: "Klimat nad wodą"
    }
];

// Helper to assign spans for Bento layout effect
const assignSpans = (index: number) => {
    // Co 5 element jest duży?
    if (index % 5 === 0) return "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2";
    if (index % 3 === 0) return "col-span-1 row-span-1 sm:col-span-2";
    return "col-span-1 row-span-1";
};

export default async function GalleryPage() {
    let images = fallbackImages;

    try {
        const response = await contentfulClient.getEntries<GalleryPhotoSkeleton>({
            content_type: "galleryPhoto",
            order: ["-sys.createdAt"]
        });

        if (response.items.length > 0) {
            // Mapowanie danych z Contentfula
            const mappedImages = response.items.map((item, index) => {
                // Rzutowanie na any, aby ominąć problemy z typowaniem Contentfula bez generatora typów
                // W wersji produkcyjnej warto użyć contentful-typescript-codegen
                const photoField = item.fields.photo as any;
                const url = photoField?.fields?.file?.url;

                if (!url) return null;

                return {
                    src: url.startsWith("//") ? `https:${url}` : url,
                    title: (item.fields.title as string) || "Bez tytułu",
                    author: (item.fields.author as string) || undefined,
                    date: (item.fields.date as string) || undefined,
                    span: assignSpans(index)
                } as GalleryImage;
            }).filter((item): item is GalleryImage => item !== null);

            if (mappedImages.length > 0) {
                // @ts-ignore - kompatybilność typów (fallback vs contentful)
                images = mappedImages;
            }
        }
    } catch (error) {
        console.error("Błąd pobierania z Contentful (używam fallback):", error);
        // Soft fail - show fallback images so page isn't broken
    }

    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-7xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Galeria Społeczności
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        Zobacz, co słychać nad wodą. Oto galeria nadesłana przez naszych wędkarzy. Chcesz dołączyć? Wyślij nam zdjęcie!
                    </p>
                </SectionReveal>

                <GalleryGrid images={images} />

                <SectionReveal delay={0.4} className="mt-24 mb-12">
                    <GalleryUploadForm />
                </SectionReveal>
            </div>
        </div>
    );
}
