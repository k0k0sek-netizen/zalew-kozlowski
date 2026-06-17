import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { createContentfulClient, RegulationEntrySkeleton, getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { RulesClient } from "@/components/features/RulesClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "en" ? "Rules | Kozłowski Reservoir" : "Regulamin | Zalew Kozłowski",
        description: locale === "en"
            ? "No Kill fishing rules, safety, and etiquette at the fishery. Read the rules before your arrival."
            : "Zasady wędkowania No Kill, bezpieczeństwo i etykieta na łowisku. Przeczytaj regulamin przed przyjazdem.",
        openGraph: {
            title: locale === "en" ? "Fishery Rules — Kozłowski Reservoir" : "Regulamin Łowiska — Zalew Kozłowski",
            description: locale === "en"
                ? "No Kill fishing rules, safety, and etiquette. Read before your arrival."
                : "Zasady wędkowania No Kill, bezpieczeństwo i etykieta. Przeczytaj przed przyjazdem.",
            url: "/regulamin",
        },
    };
}

export const revalidate = 3600;

const getFallbackRegulations = (locale: string) => [
    {
        sys: { id: "fallback-reg-general" },
        fields: {
            title: locale === "en" ? "General Rules" : "Zasady Ogólne",
            type: "General",
            rules: locale === "en" ? [
                "STRICT CATCH AND RELEASE POLICY (NO KILL).",
                "Fishing: Saturday-Sunday (Mon-Fri possible after arrangement).",
                "Guests from outside Kozłów: prior phone contact required.",
                "Limit: Max 2 rods per person (or 1 spinning rod).",
                "Behavior and ethics in accordance with standard angling regulations."
            ] : [
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
            title: locale === "en" ? "Safety and Order" : "Bezpieczeństwo i Porządek",
            type: "Safety",
            rules: locale === "en" ? [
                "Staying on the fishery after dark is FORBIDDEN.",
                "No swimming / bathing.",
                "No campfires (except in designated areas)."
            ] : [
                "Przebywanie na łowisku po zmroku ZABRONIONE.",
                "Zakaz kąpieli.",
                "Zakaz rozpalania ognisk (poza wyznaczonymi miejscami)."
            ],
            order: 2
        }
    }
];

async function getRegulations(preview: boolean, locale: string) {
    try {
        const client = createContentfulClient({ preview });
        const response = await client.getEntries<RegulationEntrySkeleton>({
            content_type: "regulationEntry",
            order: ["fields.order"],
            locale: locale === "en" ? "en-US" : "pl",
        });
        return response.items;
    } catch (err) {
        console.error("[Contentful] Failed to getRegulations, using fallback:", err);
        return getFallbackRegulations(locale);
    }
}

export default async function RulesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const { isEnabled } = await draftMode();
    const [regulations, infoBlocks, t] = await Promise.all([
        getRegulations(isEnabled, locale),
        getInfoBlocks(isEnabled, locale).catch(() => []),
        getTranslations({ locale, namespace: "rules" })
    ]);

    const phoneNumber = infoBlocks.find(b => b.fields.id === "phone")?.fields.value as string | undefined;

    const localizedRegulations = regulations.map((reg: any) => {
        if (locale === "en") {
            return {
                ...reg,
                fields: {
                    ...reg.fields,
                    title: reg.fields.titleEn || reg.fields.title,
                    rules: reg.fields.rulesEn || reg.fields.rules,
                }
            };
        }
        return reg;
    });

    // Helper to find sections by 'type' field
    const generalRules = localizedRegulations.find(r => r.fields.type === "General" || r.fields.title?.toLowerCase().includes("ogólne") || r.fields.title?.toLowerCase().includes("general"));
    const safetyRules = localizedRegulations.find(r => r.fields.type === "Safety" || r.fields.title?.toLowerCase().includes("bezpieczeństwo") || r.fields.title?.toLowerCase().includes("safety"));

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-5xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold heading-accent-gradient bg-size-[200%_100%] animate-shine md:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        {t("subtitle")}
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
