import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { createContentfulClient, FishSpeciesSkeleton } from "@/lib/contentful";
import { Asset } from "contentful";
import { draftMode } from "next/headers";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { AboutClient } from "@/components/features/AboutClient";
import { getTranslations } from "next-intl/server";
import { getWeatherAction } from "@/app/actions/weather";
import { FisheryStatsBar } from "@/components/features/FisheryStatsBar";

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
            ],
            whereToFind: "Płytkie zatoczki, strefa przybrzeżna z roślinnością wodną.",
            whereToFindEn: "Shallow bays, near-shore zone with aquatic vegetation.",
            favBait: "Czerwone robaki, kukurydza z miodem, ciasto chlebowe.",
            favBaitEn: "Red worms, honey sweetcorn, bread paste.",
            lakeRecord: "1.8 kg (Stanowisko nr 4)",
            lakeRecordEn: "1.8 kg (Peg No. 4)"
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
            ],
            whereToFind: "Ciepłe, nasłonecznione partii wody, trzcinowiska.",
            whereToFindEn: "Warm, sunny water areas, reed beds.",
            favBait: "Świeża kukurydza, kulki proteinowe o smaku owocowym, śliwki.",
            favBaitEn: "Fresh sweetcorn, fruit-flavored boilies, plums.",
            lakeRecord: "14.2 kg (Stanowisko nr 1)",
            lakeRecordEn: "14.2 kg (Peg No. 1)"
        }
    },
    {
        sys: { id: "fallback-fish-karp" },
        fields: {
            name: locale === "en" ? "Mirror Carp" : "Karp Królewski",
            description: locale === "en"
                ? "Intelligent and strong. Our carps (up to 15kg) know anglers' tricks. Require patience and precise baiting."
                : "Inteligentny i silny. Nasze karpie (do 15kg) znają sztuczki wędkarzy. Wymają cierpliwości i precyzyjnego nęcenia.",
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
            ],
            whereToFind: "Głębokie dołki, okolice zwalonych drzew i strefy przydenne.",
            whereToFindEn: "Deep holes, near fallen trees and bottom zones.",
            favBait: "Kulki proteinowe (krab/muszla), pellet chlebowy, orzech tygrysi.",
            favBaitEn: "Boilies (crab/mussel), halibut pellet, tiger nut.",
            lakeRecord: "16.5 kg (Stanowisko nr 6)",
            lakeRecordEn: "16.5 kg (Peg No. 6)"
        }
    },
    {
        sys: { id: "fallback-fish-szczupak" },
        fields: {
            name: locale === "en" ? "Northern Pike" : "Szczupak Pospolity",
            description: locale === "en"
                ? "The king of ambush hunting. A clever predator hiding in the reeds, known for explosive strikes. Requires nerves of steel and precise lure action."
                : "Król polowania z zasadzki. Sprytny drapieżnik kryjący się w trzcinach, znany z gwałtownych ataków. Wymaga stalowych nerwów i precyzyjnego prowadzenia przynęty.",
            image: {
                fields: {
                    file: {
                        url: "/ryby/szczupak.png"
                    }
                }
            },
            stats: {
                activity: 7,
                strength: 8,
                difficulty: 8
            },
            tags: locale === "en" ? [
                "Predator",
                "Fast",
                "Sharp Teeth"
            ] : [
                "Drapieżnik",
                "Szybki",
                "Zębaty"
            ],
            whereToFind: "Strefy przybrzeżne, pasy trzcin, podwodne łąki.",
            whereToFindEn: "Near-shore zones, reed lines, submerged weed beds.",
            favBait: "Woblery imitujące płocie, gumowe rippery, blachy wahadłowe.",
            favBaitEn: "Roach-imitating crankbaits, soft plastic swimbaits, spoons.",
            lakeRecord: "9.8 kg (Stanowisko nr 3)",
            lakeRecordEn: "9.8 kg (Peg No. 3)"
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
    const [fishSpecies, t, weatherData] = await Promise.all([
        getFishSpecies(isEnabled, locale),
        getTranslations({ locale, namespace: "about" }),
        getWeatherAction().catch(() => null)
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
                    whereToFind: fish.fields.whereToFindEn || fish.fields.whereToFind,
                    favBait: fish.fields.favBaitEn || fish.fields.favBait,
                    lakeRecord: fish.fields.lakeRecordEn || fish.fields.lakeRecord,
                }
            };
        }
        return {
            ...fish,
            fields: {
                ...fish.fields,
                whereToFind: fish.fields.whereToFind,
                favBait: fish.fields.favBait,
                lakeRecord: fish.fields.lakeRecord,
            }
        };
    });

    const fishData = localizedFishSpecies.map((fish: any, idx: number) => {
        const image = fish.fields.image as Asset;
        const rawUrl = image?.fields?.file?.url as string | undefined;
        const imageUrl = rawUrl
            ? (rawUrl.startsWith("//") ? `https:${rawUrl}` : rawUrl)
            : "/ryby/karp.jpg"; // Fallback

        return {
            id: fish.sys.id,
            name: fish.fields.name,
            description: fish.fields.description,
            imageSrc: imageUrl,
            stats: fish.fields.stats as { strength: number; difficulty: number; activity: number; },
            tags: fish.fields.tags || [],
            whereToFind: fish.fields.whereToFind,
            favBait: fish.fields.favBait,
            lakeRecord: fish.fields.lakeRecord,
            priority: idx < 4
        };
    });

    // Ensure Northern Pike (Szczupak) is always rendered as the 4th card if missing from Contentful
    const hasPike = fishData.some(fish => 
        fish.name.toLowerCase().includes("szczupak") || 
        fish.name.toLowerCase().includes("pike")
    );

    if (!hasPike) {
        fishData.push({
            id: "fallback-fish-szczupak",
            name: locale === "en" ? "Northern Pike" : "Szczupak Pospolity",
            description: locale === "en"
                ? "The king of ambush hunting. A clever predator hiding in the reeds, known for explosive strikes. Requires nerves of steel and precise lure action."
                : "Król polowania z zasadzki. Sprytny drapieżnik kryjący się w trzcinach, znany z gwałtownych ataków. Wymaga stalowych nerwów i precyzyjnego prowadzenia przynęty.",
            imageSrc: "/ryby/szczupak.png",
            stats: {
                activity: 7,
                strength: 8,
                difficulty: 8
            },
            tags: locale === "en" ? ["Predator", "Fast", "Sharp Teeth"] : ["Drapieżnik", "Szybki", "Zębaty"],
            whereToFind: locale === "en" 
                ? "Near-shore zones, reed lines, submerged weed beds." 
                : "Strefy przybrzeżne, pasy trzcin, podwodne łąki.",
            favBait: locale === "en"
                ? "Roach-imitating crankbaits, soft plastic swimbaits, spoons."
                : "Woblery imitujące płocie, gumowe rippery, blachy wahadłowe.",
            lakeRecord: locale === "en"
                ? "9.8 kg (Peg No. 3)"
                : "9.8 kg (Stanowisko nr 3)",
            priority: true
        });
    }

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

                {/* 2. Lake Vital Stats Bar */}
                <FisheryStatsBar />

                {/* 3. Client Side Interactive Layout (Dashboard, Fish Cards, Bento, Calendar) */}
                <AboutClient weather={weatherData} fishSpecies={fishData} />
            </div>
        </SubpageWrapper>
    );
}
