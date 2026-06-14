import { SectionReveal } from "@/components/ui/section-reveal";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Polityka Prywatności | Zalew Kozłowski",
    description: "Zasady przetwarzania danych osobowych oraz ochrony prywatności użytkowników serwisu Zalew Kozłowski.",
    openGraph: {
        title: "Polityka Prywatności — Zalew Kozłowski",
        description: "Zasady przetwarzania danych osobowych i plików cookies.",
        url: "/polityka-prywatnosci",
    },
};

export const revalidate = 3600;

export default async function PrivacyPolicyPage() {
    const { isEnabled } = await draftMode();
    const infoBlocks = await getInfoBlocks(isEnabled);
    const phone = (infoBlocks.find(b => b.fields.id === "phone")?.fields.value as string) || "601 389 365";
    const email = (infoBlocks.find(b => b.fields.id === "email")?.fields.value as string) || "lowiskokozlow@gmail.com";
    const address = (infoBlocks.find(b => b.fields.id === "address")?.fields.value as string) || "Kozłów 4A, 39-200 Dębica";

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Polityka Prywatności
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        Zasady przetwarzania danych osobowych oraz ochrony prywatności użytkowników serwisu Zalew Kozłowski.
                    </p>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                    <SpotlightCard className="p-8 md:p-12 rounded-2xl">
                        <div className="prose prose-lg dark:prose-invert max-w-none text-earth-brown dark:text-neutral-300 relative z-10">
                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-0 mb-4">1. Postanowienia Ogólne</h3>
                            <p className="mb-6 leading-relaxed">
                                Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z serwisu internetowego <strong>Zalew Kozłowski</strong>.
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">2. Administrator Danych</h3>
                            <p className="mb-6 leading-relaxed">
                                Administratorem danych osobowych jest <strong>Zalew Kozłowski - Łowisko Prywatne</strong>, z siedzibą w: {address}.
                                Kontakt z administratorem możliwy jest pod numerem telefonu: {phone} lub adresem e-mail: {email}.
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">3. Cele Przetwarzania Danych</h3>
                            <p className="mb-4 leading-relaxed">
                                Dane osobowe Użytkowników są przetwarzane w celu:
                            </p>
                            <ul className="list-disc pl-6 mb-6 space-y-2">
                                <li>Umożliwienia kontaktu z obsługą łowiska (formularz kontaktowy, telefon, e-mail).</li>
                                <li>Realizacji usług świadczonych drogą elektroniczną (informacje o pogodzie, regulamin).</li>
                                <li>Celów analitycznych i statystycznych (Google Analytics) – w celu ulepszania struktury i zawartości Strony.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">4. Pliki Cookies</h3>
                            <p className="mb-4 leading-relaxed">
                                Serwis korzysta z plików cookies. Są to niewielkie pliki tekstowe wysyłane przez serwer www i przechowywane przez oprogramowanie komputera przeglądarki. Kiedy przeglądarka ponownie połączy się ze stroną, witryna rozpoznaje rodzaj urządzenia, z którego łączy się użytkownik.
                            </p>
                            <p className="mb-6 leading-relaxed">
                                Użytkownik ma prawo zadecydować w zakresie dostępu plików cookies do swojego komputera poprzez ich uprzedni wybór w oknie przeglądarki lub poprzez baner zgody na naszej stronie.
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">5. Odbiorcy Danych</h3>
                            <p className="mb-6 leading-relaxed">
                                Odbiorcami danych mogą być podmioty zajmujące się obsługą informatyczną administratora (hosting, dostawcy usług analitycznych jak Google).
                            </p>

                            <h3 className="text-xl font-bold text-pine-green dark:text-white mt-8 mb-4">6. Prawa Użytkownika</h3>
                            <p className="mb-6 leading-relaxed">
                                Użytkownikowi przysługuje prawo dostępu do treści swoich danych oraz ich poprawiania, sprostowania, usunięcia, ograniczenia przetwarzania, a także prawo do wniesienia skargi do organu nadzorczego (UODO).
                            </p>

                            <p className="mt-12 text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-200 dark:border-white/10 pt-6">
                                Data ostatniej aktualizacji: 05.06.2026 r.
                            </p>
                        </div>
                    </SpotlightCard>
                </SectionReveal>
            </div>
        </SubpageWrapper>
    );
}

