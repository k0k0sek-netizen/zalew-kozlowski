import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { createContentfulClient, PriceItemSkeleton, getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { PricingClient } from "@/components/features/PricingClient";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "en" ? "Pricing | Kozłowski Reservoir" : "Cennik | Zalew Kozłowski",
        description: locale === "en"
            ? "Check the prices of fishing permits, payment rules and available options at the Kozłowski Reservoir. No hidden fees."
            : "Sprawdź ceny zezwoleń wędkarskich, zasady płatności i dostępne opcje na Zalewie Kozłowskim. Brak ukrytych opłat.",
        openGraph: {
            title: locale === "en" ? "Pricing — Kozłowski Reservoir" : "Cennik — Zalew Kozłowski",
            description: locale === "en"
                ? "Check permit prices and available options. No hidden fees."
                : "Sprawdź ceny zezwoleń wędkarskich i dostępne opcje. Brak ukrytych opłat.",
            url: "/cennik",
        },
    };
}

export const revalidate = 3600;

const getFallbackPrices = (locale: string) => [
    {
        sys: { id: "fallback-price-main" },
        fields: {
            title: locale === "en" ? "Fishing Permit" : "Zezwolenie Wędkarskie",
            price: locale === "en" ? "15 PLN / 20 PLN" : "15 zł / 20 zł",
            description: locale === "en" ? "Fee for one rod" : "Opłata za jedną wędkę",
            details: locale === "en" ? [
                "Max 2 rods (20 PLN)",
                "OR 1 spinning rod",
                "Cash only",
                "Kozłów residents: 0 PLN"
            ] : [
                "Max 2 wędki (20 zł)",
                "LUB 1 wędka spinningowa",
                "Tylko gotówka",
                "Mieszkańcy Kozłowa: 0 zł"
            ],
            category: "Główne",
            order: 1,
            price1Rod: 15,
            price2Rods: 20,
            priceSpinning: 15
        }
    },
    {
        sys: { id: "fallback-price-info" },
        fields: {
            title: locale === "en" ? "Fishery Availability" : "Dostępność Łowiska",
            price: locale === "en" ? "Open" : "Czynne",
            details: locale === "en" ? [
                "Weekend: Saturday - Sunday (Dawn - Dusk)",
                "Mon - Fri: Possible only by prior phone arrangement.",
                "Guests: Prior contact required."
            ] : [
                "Weekend: Sobota - Niedziela (Świt - Zmierzch)",
                "Pon - Pt: Możliwe wyłącznie po uzgodnieniu telefonicznym.",
                "Goście: Wymagany wcześniejszy kontakt."
            ],
            category: "Info",
            order: 2
        }
    }
];

async function getPrices(preview: boolean, locale: string) {
    try {
        const client = createContentfulClient({ preview });
        const response = await client.getEntries<PriceItemSkeleton>({
            content_type: "priceItem",
            order: ["fields.order"],
            locale: locale === "en" ? "en-US" : "pl"
        });
        return response.items;
    } catch (err) {
        console.error("[Contentful] Failed to getPrices, using fallback:", err);
        return getFallbackPrices(locale);
    }
}


export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const { isEnabled } = await draftMode();
    const [prices, infoBlocks, t] = await Promise.all([
        getPrices(isEnabled, locale),
        getInfoBlocks(isEnabled, locale).catch(() => []),
        getTranslations("pricing")
    ]);

    const phone = infoBlocks.find((b: any) => b.fields.id === "phone")?.fields.value || "601 389 365";

    const localizedPrices = prices.map((price: any) => {
        if (locale === "en") {
            return {
                ...price,
                fields: {
                    ...price.fields,
                    title: price.fields.titleEn || price.fields.title,
                    description: price.fields.descriptionEn || price.fields.description,
                    details: price.fields.detailsEn || price.fields.details,
                }
            };
        }
        return price;
    });

    const mainPrice = localizedPrices.find((p: any) => p.fields.category === 'Główne');
    const price1Rod = mainPrice?.fields.price1Rod ?? 15;
    const price2Rods = mainPrice?.fields.price2Rods ?? 20;
    const priceSpinning = mainPrice?.fields.priceSpinning ?? 15;

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold heading-accent-gradient bg-size-[200%_100%] animate-shine md:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        {t("desc")}
                    </p>
                </SectionReveal>

                <PricingClient 
                    initialPrices={localizedPrices as any} 
                    phone={phone}
                    price1Rod={price1Rod}
                    price2Rods={price2Rods}
                    priceSpinning={priceSpinning}
                />
            </div>
        </SubpageWrapper>
    );
}

