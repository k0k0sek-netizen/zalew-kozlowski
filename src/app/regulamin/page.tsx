import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { createContentfulClient, RegulationEntrySkeleton } from "@/lib/contentful";
import { getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { RulesClient } from "@/components/features/RulesClient";

export const metadata: Metadata = {
    title: "Regulamin | Zalew Kozłowski",
    description: "Zasady wędkowania No Kill, bezpieczeństwo i etykieta na łowisku. Przeczytaj regulamin przed przyjazdem.",
    openGraph: {
        title: "Regulamin Łowiska — Zalew Kozłowski",
        description: "Zasady wędkowania No Kill, bezpieczeństwo i etykieta. Przeczytaj przed przyjazdem.",
        url: "/regulamin",
    },
};

export const revalidate = 3600;

const fallbackRegulations = [
    {
        sys: { id: "fallback-reg-general" },
        fields: {
            title: "Zasady Ogólne",
            type: "General",
            rules: [
                "CAŁKOWITY ZAKAZ ZABIERANIA RYB (NO KILL).",
                "Wędkowanie: Sobota-Niedziela (Pon-Pt możliwe po uzgodnieniu).",
                "Osoby spoza Kozłowa: wymagany wcześniejszy kontakt telefoniczny.",
                "Limit: Max 2 wędki na osobę (lub 1 spinning).",
                "Zasady zachowania i etyki wędkarskiej zgodne z regulaminem PZW."
            ],
            order: 1
        }
    },
    {
        sys: { id: "fallback-reg-safety" },
        fields: {
            title: "Bezpieczeństwo i Porządek",
            type: "Safety",
            rules: [
                "Przebywanie na łowisku po zmroku ZABRONIONE.",
                "Zakaz kąpieli.",
                "Zakaz rozpalania ognisk (poza wyznaczonymi miejscami)."
            ],
            order: 2
        }
    }
];

async function getRegulations(preview: boolean) {
    try {
        const client = createContentfulClient({ preview });
        const response = await client.getEntries<RegulationEntrySkeleton>({
            content_type: "regulationEntry",
            order: ["fields.order"],
        });
        return response.items;
    } catch (err) {
        console.error("[Contentful] Failed to getRegulations, using fallback:", err);
        return fallbackRegulations;
    }
}


export default async function RulesPage() {
    const { isEnabled } = await draftMode();
    const regulations = await getRegulations(isEnabled);
    const infoBlocks = await getInfoBlocks(isEnabled);
    const phoneNumber = infoBlocks.find(b => b.fields.id === "phone")?.fields.value as string | undefined;

    // Helper to find sections by 'type' field
    const generalRules = regulations.find(r => r.fields.type === "General" || r.fields.title?.toLowerCase().includes("ogólne"));
    const safetyRules = regulations.find(r => r.fields.type === "Safety" || r.fields.title?.toLowerCase().includes("bezpieczeństwo"));

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-5xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Regulamin Łowiska
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        Przed przyjazdem na łowisko prosimy o dokładne zapoznanie się z poniższymi zasadami. Dbamy o bezpieczeństwo wędkarzy oraz dobrą kondycję naszych ryb.
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <RulesClient 
                        generalRules={generalRules ? { fields: generalRules.fields } : undefined}
                        safetyRules={safetyRules ? { fields: safetyRules.fields } : undefined}
                        phoneNumber={phoneNumber}
                    />
                </SectionReveal>
            </div>
        </SubpageWrapper>
    );
}
