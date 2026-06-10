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

async function getFishSpecies(preview: boolean) {
    const client = createContentfulClient({ preview });
    const response = await client.getEntries<FishSpeciesSkeleton>({
        content_type: "fishSpecies",
    });
    return response.items;
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
