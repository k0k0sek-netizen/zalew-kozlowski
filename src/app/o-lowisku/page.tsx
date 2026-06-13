import { FishCard } from "@/components/features/FishCard";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { createContentfulClient, FishSpeciesSkeleton } from "@/lib/contentful";
import { Asset } from "contentful";
import { draftMode } from "next/headers";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { AboutClient } from "@/components/features/AboutClient";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "O Łowisku | Zalew Kozłowski",
    description: "Poznaj charakterystykę Zalewu Kozłowskiego. Sprawdź jakie ryby u nas występują i dlaczego warto nas odwiedzić.",
    openGraph: {
        title: "O Łowisku — Zalew Kozłowski",
        description: "Poznaj charakterystykę zalewu, gatunki ryb i dlaczego warto nas odwiedzić.",
        url: "/o-lowisku",
    },
};

const fallbackFishSpecies = [
    {
        sys: { id: "fallback-fish-karas" },
        fields: {
            name: "Karaś Srebrzysty",
            description: "Piękna, złota ryba, która cieszy oko. Idealny cel dla początkujących i miłośników metody spławikowej.",
            image: {
                fields: {
                    file: {
                        url: "//images.unsplash.com/photo-1522858547137-f1dcec554f55?q=80&w=600"
                    }
                }
            },
            stats: {
                activity: 9,
                strength: 4,
                difficulty: 3
            },
            tags: [
                "Złoty",
                "Aktywny",
                "Spławik"
            ]
        }
    },
    {
        sys: { id: "fallback-fish-amur" },
        fields: {
            name: "Amur Biały",
            description: "Torpeda naszych wód. Po zacięciu startuje jak rakieta. Uwielbia roślinność i słoneczne dni.",
            image: {
                fields: {
                    file: {
                        url: "//images.unsplash.com/photo-1504280506338-331291887e3f?q=80&w=600"
                    }
                }
            },
            stats: {
                activity: 8,
                strength: 10,
                difficulty: 6
            },
            tags: [
                "Siłacz",
                "Szybki",
                "Apetyt"
            ]
        }
    },
    {
        sys: { id: "fallback-fish-karp" },
        fields: {
            name: "Karp Królewski",
            description: "Inteligentny i silny. Nasze karpie (do 15kg) znają sztuczki wędkarzy. Wymagają cierpliwości i precyzyjnego nęcenia.",
            image: {
                fields: {
                    file: {
                        url: "//images.unsplash.com/photo-1544551763-46a8723ba3f9?q=80&w=600"
                    }
                }
            },
            stats: {
                activity: 6,
                strength: 8,
                difficulty: 9
            },
            tags: [
                "Król Wód",
                "Waleczny",
                "Sprytny"
            ]
        }
    }
];

async function getFishSpecies(preview: boolean) {
    try {
        const client = createContentfulClient({ preview });
        const response = await client.getEntries<FishSpeciesSkeleton>({
            content_type: "fishSpecies",
        });
        return response.items;
    } catch (err) {
        console.error("[Contentful] Failed to getFishSpecies, using fallback:", err);
        return fallbackFishSpecies;
    }
}


export default async function AboutPage() {
    const { isEnabled } = await draftMode();
    const fishSpecies = await getFishSpecies(isEnabled);

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        O Łowisku
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        Zalew Kozłowski to 100 arów czystej natury. Tutaj cisza spotyka się z adrenaliną, a wędkarz staje oko w oko z wymagającym przeciwnikiem.
                    </p>
                </SectionReveal>

                {/* Gamified Fish Section */}
                <SectionReveal className="mb-24" delay={0.2}>
                    <div className="mb-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                        <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                            Poznaj Przeciwnika
                        </h2>
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {fishSpecies.map((fish, idx) => {
                            const image = fish.fields.image as Asset;
                            const imageUrl = image?.fields?.file?.url
                                ? `https:${image.fields.file.url}`
                                : "/ryby/karp.jpg"; // Fallback

                            return (
                                <FishCard
                                    key={fish.sys.id}
                                    name={fish.fields.name}
                                    description={fish.fields.description}
                                    imageSrc={imageUrl}
                                    stats={fish.fields.stats as any}
                                    tags={fish.fields.tags || []}
                                    priority={idx < 3}
                                />
                            );
                        })}
                    </div>
                </SectionReveal>

                {/* Client Side Interactive Layout (Weather index, Bento grid, Seasonal calendar) */}
                <AboutClient />
            </div>
        </SubpageWrapper>
    );
}
