import { SectionReveal } from "@/components/ui/section-reveal";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "en" ? "Privacy Policy | Kozłowski Reservoir" : "Polityka Prywatności | Zalew Kozłowski",
        description: locale === "en"
            ? "Rules for processing personal data and protecting the privacy of users of the Kozłowski Reservoir."
            : "Zasady przetwarzania danych osobowych oraz ochrony prywatności użytkowników serwisu Zalew Kozłowski.",
        openGraph: {
            title: locale === "en" ? "Privacy Policy — Kozłowski Reservoir" : "Polityka Prywatności — Zalew Kozłowski",
            description: locale === "en"
                ? "Rules for processing personal data and cookies."
                : "Zasady przetwarzania danych osobowych i plików cookies.",
            url: "/polityka-prywatnosci",
        },
    };
}

export const revalidate = 3600;

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const { isEnabled } = await draftMode();
    const [infoBlocks, t] = await Promise.all([
        getInfoBlocks(isEnabled, locale).catch(() => []),
        getTranslations({ locale, namespace: "privacy" })
    ]);

    const phone = (infoBlocks.find(b => b.fields.id === "phone")?.fields.value as string) || "601 389 365";
    const email = (infoBlocks.find(b => b.fields.id === "email")?.fields.value as string) || "lowiskokozlow@gmail.com";
    const address = (infoBlocks.find(b => b.fields.id === "address")?.fields.value as string) || "Kozłów 4A, 39-200 Dębica";

    const strongSite = locale === "en" ? "Kozłowski Reservoir" : "Zalew Kozłowski";
    const strongCompany = locale === "en" ? "Kozłowski Reservoir - Private Fishery" : "Zalew Kozłowski - Łowisko Prywatne";

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold heading-accent-gradient bg-size-[200%_100%] animate-shine md:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        {t("subtitle")}
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <SpotlightCard className="p-8 md:p-12 rounded-2xl">
                        <div className="prose prose-lg dark:prose-invert max-w-none text-earth-brown dark:text-neutral-300 relative z-10">
                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-0 mb-4">
                                {t("sec1_title")}
                            </h3>
                            <p className="mb-6 leading-relaxed">
                                {t("sec1_desc", { strong_site: strongSite })}
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">
                                {t("sec2_title")}
                            </h3>
                            <p className="mb-6 leading-relaxed">
                                {t("sec2_desc", { 
                                    strong_company: strongCompany, 
                                    address, 
                                    phone, 
                                    email 
                                })}
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">
                                {t("sec3_title")}
                            </h3>
                            <p className="mb-4 leading-relaxed">
                                {t("sec3_desc")}
                            </p>
                            <ul className="list-disc pl-6 mb-6 space-y-2">
                                <li>{t("sec3_li1")}</li>
                                <li>{t("sec3_li2")}</li>
                                <li>{t("sec3_li3")}</li>
                            </ul>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">
                                {t("sec4_title")}
                            </h3>
                            <p className="mb-4 leading-relaxed">
                                {t("sec4_desc1")}
                            </p>
                            <p className="mb-6 leading-relaxed">
                                {t("sec4_desc2")}
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">
                                {t("sec5_title")}
                            </h3>
                            <p className="mb-6 leading-relaxed">
                                {t("sec5_desc")}
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">
                                {t("sec6_title")}
                            </h3>
                            <p className="mb-6 leading-relaxed">
                                {t("sec6_desc")}
                            </p>

                            <p className="mt-12 text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-white/10 pt-6">
                                {t("last_update")}
                            </p>
                        </div>
                    </SpotlightCard>
                </SectionReveal>
            </div>
        </SubpageWrapper>
    );
}
