import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Metadata } from "next";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { ContactClient } from "@/components/features/ContactClient";
import { getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "en" ? "Contact | Kozłowski Reservoir" : "Kontakt | Zalew Kozłowski",
        description: locale === "en"
            ? "Get in touch with us, check directions, and book your spot. Phone, address, and map."
            : "Skontaktuj się z nami, sprawdź dojazd i zarezerwuj miejsce na łowisku. Telefon, adres i mapa.",
        openGraph: {
            title: locale === "en" ? "Contact — Kozłowski Reservoir" : "Kontakt — Zalew Kozłowski",
            description: locale === "en"
                ? "Get in touch with the fishery host. Phone, address, and directions map."
                : "Skontaktuj się z gospodarzem łowiska. Telefon, adres i mapa dojazdu.",
            url: "/kontakt",
        },
    };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const { isEnabled } = await draftMode();
    const [infoBlocks, t] = await Promise.all([
        getInfoBlocks(isEnabled, locale).catch(() => []),
        getTranslations({ locale, namespace: "contact" })
    ]);

    const phone = infoBlocks.find((b: any) => b.fields.id === "phone")?.fields.value || "601 389 365";
    const email = infoBlocks.find((b: any) => b.fields.id === "email")?.fields.value || "lowiskokozlow@gmail.com";
    const address = infoBlocks.find((b: any) => b.fields.id === "address")?.fields.value || "Kozłów 4A, 39-200 Dębica";
    const mapEmbed = infoBlocks.find((b: any) => b.fields.id === "map-embed")?.fields.value || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20546.77259688636!2d21.4362375!3d50.0944237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473d0b2158b5c6c9%3A0x1868e6a4962b222c!2sZalew%20Koz%C5%82owski!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl";

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-7xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold heading-accent-gradient bg-size-[200%_100%] animate-shine md:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        {t("subtitle")}
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <div className="grid gap-8 lg:grid-cols-2 items-stretch">
                        <SpotlightCard className="p-8 shadow-sm flex flex-col justify-between">
                            <div className="relative z-10">
                                <h2 
                                    className="mb-6 text-2xl font-bold text-pine-green transition-colors duration-300"
                                    style={{ ["--glow-text" as any]: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                >
                                    <span className="dark:text-[var(--glow-text)]">{t("info_title")}</span>
                                </h2>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <MapPin 
                                            className="h-6 w-6 shrink-0 transition-colors duration-300" 
                                            style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                        />
                                        <div>
                                            <p className="font-bold text-pine-green-dark dark:text-white">{t("address_label")}</p>
                                            <p className="text-earth-brown dark:text-neutral-300">{address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Phone 
                                            className="h-6 w-6 shrink-0 transition-colors duration-300" 
                                            style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                        />
                                        <div>
                                            <p className="font-bold text-pine-green-dark dark:text-white">{t("phone_label")}</p>
                                            <p className="text-lg text-pine-green-dark font-mono dark:text-white">{phone}</p>
                                            <p className="text-sm text-neutral-500">{t("phone_hours")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Mail 
                                            className="h-6 w-6 shrink-0 transition-colors duration-300" 
                                            style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                        />
                                        <div>
                                            <p className="font-bold text-pine-green-dark dark:text-white">{t("email_label")}</p>
                                            <p className="text-earth-brown dark:text-neutral-300">{email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <Clock 
                                            className="h-6 w-6 shrink-0 transition-colors duration-300" 
                                            style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                        />
                                        <div>
                                            <p className="font-bold text-pine-green-dark dark:text-white">{t("hours_label")}</p>
                                            <p className="text-earth-brown dark:text-neutral-300">{t("hours_desc")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SpotlightCard>

                        <ContactClient phone={phone} email={email} />
                    </div>

                    {/* Interactive Google Map with Active Glow Border */}
                    <div 
                        className="mt-8 h-[400px] md:h-[450px] w-full overflow-hidden rounded-2xl border-2 border-earth-brown/10 dark:border-white/10 shadow-xl transition-all duration-500 hover:scale-[1.005] hover:grayscale-0 grayscale-30 hover:border-[var(--hover-border)] hover:shadow-[var(--hover-shadow)]"
                        style={{
                            ["--hover-border" as any]: "rgba(var(--active-glow-color, 249, 115, 22), 0.5)",
                            ["--hover-shadow" as any]: "0 20px 30px rgba(var(--active-glow-color, 249, 115, 22), 0.15)"
                        } as React.CSSProperties}
                    >
                        <iframe
                            src={mapEmbed}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </SectionReveal>
            </div>
        </SubpageWrapper>
    );
}
