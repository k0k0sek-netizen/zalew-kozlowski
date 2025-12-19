import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Metadata } from "next";
import { contentfulClient, PriceItemSkeleton } from "@/lib/contentful";

export const metadata: Metadata = {
    title: "Cennik | Zalew Kozłowski",
    description: "Sprawdź ceny zezwoleń wędkarskich, zasady płatności i dostępne opcje na Zalewie Kozłowskim. Brak ukrytych opłat.",
};

export const revalidate = 3600;

async function getPrices() {
    const response = await contentfulClient.getEntries<PriceItemSkeleton>({
        content_type: "priceItem",
        order: ["fields.order"],
    });
    return response.items;
}

export default async function PricingPage() {
    const prices = await getPrices();

    // Helper to identify specific cards for styling
    // We can use the 'category' field or title to distinguish them
    const mainPrice = prices.find(p => p.fields.category === 'Główne');
    const infoPrice = prices.find(p => p.fields.category === 'Info');

    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal>
                    <h1 className="mb-8 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Cennik Zezwoleń
                    </h1>
                    <p className="mb-8 text-lg text-earth-brown dark:text-neutral-300">
                        Wędkowanie na Zalewie Kozłowskim wymaga wykupienia licencji. <strong>Płatność wyłącznie gotówką na miejscu</strong> u gospodarza.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Card 1: Standard Pricing */}
                        {mainPrice && (
                            <SpotlightCard className="flex flex-col p-8 border-2 border-transparent hover:border-sunset-orange transition-colors">
                                <div className="relative z-10 flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-pine-green-dark dark:text-white">{mainPrice.fields.title}</h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{mainPrice.fields.description}</p>
                                    <div className="my-4 text-5xl font-bold text-sunset-orange">{mainPrice.fields.price}</div>
                                    <ul className="mb-8 flex-1 space-y-3 text-sm">
                                        {mainPrice.fields.details?.map((detail, idx) => {
                                            // Special styling logic
                                            const isResidents = detail.includes("Mieszkańcy Kozłowa");
                                            const isCash = detail.includes("Tylko gotówka");

                                            return (
                                                <li key={idx} className={`flex items-center gap-2 ${isResidents ? 'pt-2 text-pine-green font-bold dark:text-green-400' : ''}`}>
                                                    <span className={`h-1.5 w-1.5 rounded-full ${isResidents ? 'bg-current' : 'bg-sunset-orange'}`}></span>
                                                    {isCash ? <strong>{detail}</strong> : detail}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </SpotlightCard>
                        )}

                        {/* Card 2: Important Info */}
                        {infoPrice && (
                            <SpotlightCard className="flex flex-col bg-pine-green-dark p-8 text-white border-2 border-sunset-orange/50 hover:border-sunset-orange relative overflow-hidden transition-colors">
                                <div className="absolute right-0 top-0 bg-sunset-orange px-3 py-1 text-xs font-bold text-white rounded-bl-lg z-20">WAŻNE</div>
                                <div className="relative z-10 flex flex-col h-full">
                                    <h3 className="text-xl font-bold mb-4">{infoPrice.fields.title}</h3>
                                    <ul className="space-y-4 text-sm flex-1">
                                        {infoPrice.fields.details?.map((detail, idx) => {
                                            // Split by colon to bold the label if present (e.g. "Weekend: ...")
                                            const parts = detail.split(':');
                                            const hasLabel = parts.length > 1;

                                            // Contentful strips HTML, so we reconstruct the Bold logic
                                            // "Pon - Pt: Możliwe wyłącznie po uzgodnieniu telefonicznym."
                                            const label = hasLabel ? parts[0] + ":" : "";
                                            const content = hasLabel ? parts.slice(1).join(':').trim() : detail;

                                            // Special case for bolding specific inner text if needed, 
                                            // or we just follow the general "Label: Value" pattern.
                                            // Hardcoded was: <div>Możliwe <strong>wyłącznie po uzgodnieniu telefonicznym</strong>.</div>
                                            // For now, simple text rendering is safer unless we parse rich text or know exact strings.
                                            // Let's rely on the text being understandable.

                                            return (
                                                <li key={idx} className="flex gap-3">
                                                    {hasLabel && <div className="font-bold text-sunset-orange min-w-[80px]">{label}</div>}
                                                    <div>{content}</div>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                    <div className="mt-6 pt-6 border-t border-white/10">
                                        <div className="text-xs text-neutral-400 mb-1">Kontakt telefoniczny:</div>
                                        <div className="text-2xl font-bold text-sunset-orange">601 389 365</div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        )}
                    </div>

                    <div className="mt-12 rounded-xl bg-neutral-100 p-6 dark:bg-white/5 border-l-4 border-sunset-orange">
                        <h3 className="mb-2 font-bold text-pine-green-dark dark:text-white">Brak ukrytych opłat</h3>
                        <p className="text-earth-brown dark:text-neutral-300">
                            Nie oferujemy karnetów, pakietów sezonowych ani rezerwacji stanowisk. Proste zasady: przyjeżdżasz, uzgadniasz, łowisz.
                        </p>
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
