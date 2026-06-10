import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { createContentfulClient, PriceItemSkeleton, getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { PricingClient } from "@/components/features/PricingClient";

export const metadata: Metadata = {
    title: "Cennik | Zalew Kozłowski",
    description: "Sprawdź ceny zezwoleń wędkarskich, zasady płatności i dostępne opcje na Zalewie Kozłowskim. Brak ukrytych opłat.",
    openGraph: {
        title: "Cennik — Zalew Kozłowski",
        description: "Sprawdź ceny zezwoleń wędkarskich i dostępne opcje. Brak ukrytych opłat.",
        url: "/cennik",
    },
};

export const revalidate = 3600;

async function getPrices(preview: boolean) {
    const client = createContentfulClient({ preview });
    const response = await client.getEntries<PriceItemSkeleton>({
        content_type: "priceItem",
        order: ["fields.order"],
    });
    return response.items;
}

export default async function PricingPage() {
    const { isEnabled } = await draftMode();
    const [prices, infoBlocks] = await Promise.all([
        getPrices(isEnabled),
        getInfoBlocks(isEnabled).catch(() => []),
    ]);

    const phone = infoBlocks.find((b: any) => b.fields.id === "phone")?.fields.value || "601 389 365";
    const mainPrice = prices.find((p: any) => p.fields.category === 'Główne');
    const price1Rod = mainPrice?.fields.price1Rod ?? 15;
    const price2Rods = mainPrice?.fields.price2Rods ?? 20;
    const priceSpinning = mainPrice?.fields.priceSpinning ?? 15;

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Cennik Zezwoleń
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        Wędkowanie na Zalewie Kozłowskim wymaga wykupienia licencji. <strong>Płatność wyłącznie gotówką na miejscu</strong> u gospodarza.
                    </p>
                </SectionReveal>

                <PricingClient 
                    initialPrices={prices as any} 
                    phone={phone}
                    price1Rod={price1Rod}
                    price2Rods={price2Rods}
                    priceSpinning={priceSpinning}
                />
            </div>
        </SubpageWrapper>
    );
}
