import { FishCard } from "@/components/features/FishCard";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { createContentfulClient, FishSpeciesSkeleton } from "@/lib/contentful";
import { Asset } from "contentful";
import { draftMode } from "next/headers";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { AboutClient } from "@/components/features/AboutClient";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "en" ? "About the Fishery | Kozłowski Reservoir" : "O Łowisku | Zalew Kozłowski",
        description: locale === "en"
            ? "Learn about the characteristics of the Kozłowski Reservoir. Check which fish species live here and why you should visit us."
            : "Poznaj charakterystykę Zalewu Kozłowskiego. Sprawdź jakie ryby u nas występują i dlaczego warto nas odwiedzić.",
        openGraph: {
            title: locale === "en" ? "About the Fishery — Kozłowski Reservoir" : "O Łowisku — Zalew Kozłowski",
            description: locale === "en"
                ? "Learn about the lake characteristics, fish species, and why you should visit us."
                : "Poznaj charakterystykę zalewu, gatunki ryb i dlaczego warto nas odwiedzić.",
            url: "/o-lowisku",
        },
    };
}

const getFallbackFishSpecies = (locale: string) => [
    {
        sys: { id: "fallback-fish-karas" },
        fields: {
            name: locale === "en" ? "Crucian Carp" : "Karaś Srebrzysty",
            description: locale === "en" 
                ? "Beautiful, golden fish that pleases the eye. Perfect target for beginners and float fishing lovers."
                : "Piękna, złota ryba, która cieszy oko. Idealny cel dla początkujących i miłośników metody spławikowej.",
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
            tags: locale === "en" ? [
                "Golden",
                "Active",
                "Float"
            ] : [
                "Złoty",
                "Aktywny",
                "Spławik"
            ]
        }
    },
    {
        sys: { id: "fallback-fish-amur" },
        fields: {
            name: locale === "en" ? "Grass Carp" : "Amur Biały",
            description: locale === "en"
                ? "The torpedo of our waters. Runs like a rocket after a bite. Loves vegetation and sunny days."
                : "Torpeda naszych wód. Po zacięciu startuje jak rakieta. Uwielbia roślinność i słoneczne dni.",
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
            tags: locale === "en" ? [
                "Strongman",
                "Fast",
                "Appetite"
            ] : [
                "Siłacz",
                "Szybki",
                "Apetyt"
            ]
        }
    },
    {
        sys: { id: "fallback-fish-karp" },
        fields: {
            name: locale === "en" ? "Mirror Carp" : "Karp Królewski",
            description: locale === "en"
                ? "Intelligent and strong. Our carps (up to 15kg) know anglers' tricks. Require patience and precise baiting."
                : "Inteligentny i silny. Nasze karpie (do 15kg) znają sztuczki wędkarzy. Wymagają cierpliwości i precyzyjnego nęcenia.",
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
            tags: locale === "en" ? [
                "Water King",
                "Fighter",
                "Clever"
            ] : [
                "Król Wód",
                "Waleczny",
                "Sprytny"
            ]
        }
    }
];

async function getFishSpecies(preview: boolean, locale: string) {
    try {
        const client = createContentfulClient({ preview });
        const response = await client.getEntries<FishSpeciesSkeleton>({
            content_type: "fishSpecies",
            locale: locale === "en" ? "en-US" : "pl",
        });
        return response.items;
    } catch (err) {
        console.error("[Contentful] Failed to getFishSpecies, using fallback:", err);
        return getFallbackFishSpecies(locale);
    }
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const { isEnabled } = await draftMode();
    const [fishSpecies, t] = await Promise.all([
        getFishSpecies(isEnabled, locale),
        getTranslations({ locale, namespace: "about" })
    ]);

    const localizedFishSpecies = fishSpecies.map((fish: any) => {
        if (locale === "en") {
            return {
                ...fish,
                fields: {
                    ...fish.fields,
                    name: fish.fields.nameEn || fish.fields.name,
                    description: fish.fields.descriptionEn || fish.fields.description,
                    tags: fish.fields.tagsEn || fish.fields.tags,
                }
            };
        }
        return fish;
    });

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        {t("subtitle")}
                    </p>
                </SectionReveal>

                {/* Gamified Fish Section */}
                <SectionReveal className="mb-24" delay={0.2}>
                    <div className="mb-12 flex items-center gap-4">
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                        <h2 className="text-2xl font-black uppercase tracking-widest text-pine-green dark:text-neutral-400">
                            {t("fish_title")}
                        </h2>
                        <div className="h-px flex-1 bg-neutral-300 dark:bg-white/10" />
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {localizedFishSpecies.map((fish, idx) => {
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
