import { SectionReveal } from "@/components/ui/section-reveal";

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-sand-beige min-h-screen py-24 px-4 dark:bg-pine-green-dark">
            <SectionReveal className="mx-auto max-w-4xl bg-white dark:bg-black/20 p-8 md:p-12 rounded-2xl shadow-xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-8 text-pine-green dark:text-white border-b border-earth-brown/10 pb-6">
                    Polityka Prywatności
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none text-earth-brown dark:text-neutral-300">
                    <h3>1. Postanowienia Ogólne</h3>
                    <p>
                        Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych przekazanych przez Użytkowników w związku z korzystaniem z serwisu internetowego <strong>Zalew Kozłowski</strong>.
                    </p>

                    <h3>2. Administrator Danych</h3>
                    <p>
                        Administratorem danych osobowych jest <strong>Zalew Kozłowski - Łowisko Prywatne</strong>, z siedzibą w: Kozłów 4A, 39-200 Dębica.
                        Kontakt z administratorem możliwy jest pod numerem telefonu: 601 389 365 lub adresem e-mail: lowiskokozlow@gmail.com.
                    </p>

                    <h3>3. Cele Przetwarzania Danych</h3>
                    <p>
                        Dane osobowe Użytkowników są przetwarzane w celu:
                    </p>
                    <ul>
                        <li>Umożliwienia kontaktu z obsługą łowiska (formularz kontaktowy, telefon, e-mail).</li>
                        <li>Realizacji usług świadczonych drogą elektroniczną (informacje o pogodzie, regulamin).</li>
                        <li>Celów analitycznych i statystycznych (Google Analytics) – w celu ulepszania struktury i zawartości Strony.</li>
                    </ul>

                    <h3>4. Pliki Cookies</h3>
                    <p>
                        Serwis korzysta z plików cookies. Są to niewielkie pliki tekstowe wysyłane przez serwer www i przechowywane przez oprogramowanie komputera przeglądarki. Kiedy przeglądarka ponownie połączy się ze stroną, witryna rozpoznaje rodzaj urządzenia, z którego łączy się użytkownik.
                    </p>
                    <p>
                        Użytkownik ma prawo zadecydować w zakresie dostępu plików cookies do swojego komputera poprzez ich uprzedni wybór w oknie przeglądarki lub poprzez baner zgody na naszej stronie.
                    </p>

                    <h3>5. Odbiorcy Danych</h3>
                    <p>
                        Odbiorcami danych mogą być podmioty zajmujące się obsługą informatyczną administratora (hosting, dostawcy usług analitycznych jak Google).
                    </p>

                    <h3>6. Prawa Użytkownika</h3>
                    <p>
                        Użytkownikowi przysługuje prawo dostępu do treści swoich danych oraz ich poprawiania, sprostowania, usunięcia, ograniczenia przetwarzania, a także prawo do wniesienia skargi do organu nadzorczego (UODO).
                    </p>

                    <p className="mt-8 text-sm opacity-60">
                        Data ostatniej aktualizacji: {new Date().toLocaleDateString('pl-PL')}
                    </p>
                </div>
            </SectionReveal>
        </div>
    );
}
