import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kontakt | Zalew Kozłowski",
    description: "Skontaktuj się z nami, sprawdź dojazd i zarezerwuj miejsce na łowisku. Telefon, adres i mapa.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-7xl px-4">
                <SectionReveal>
                    <h1 className="mb-12 text-center text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Kontakt & Dojazd
                    </h1>

                    <div className="grid gap-12 lg:grid-cols-2">
                        <div className="space-y-8">
                            <SpotlightCard className="p-8 shadow-sm">
                                <div className="relative z-10">
                                    <h2 className="mb-6 text-2xl font-bold text-pine-green dark:text-sunset-orange">Dane Kontaktowe</h2>
                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                            <MapPin className="h-6 w-6 text-sunset-orange" />
                                            <div>
                                                <p className="font-bold text-pine-green-dark dark:text-white">Adres</p>
                                                <p className="text-earth-brown dark:text-neutral-300">Kozłów 4A, 39-200 Kozłów</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Phone className="h-6 w-6 text-sunset-orange" />
                                            <div>
                                                <p className="font-bold text-pine-green-dark dark:text-white">Telefon</p>
                                                <p className="text-lg text-pine-green-dark font-mono dark:text-white">601 389 365</p>
                                                <p className="text-sm text-neutral-500">Rezerwacje: 8:00 - 20:00</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Mail className="h-6 w-6 text-sunset-orange" />
                                            <div>
                                                <p className="font-bold text-pine-green-dark dark:text-white">E-mail</p>
                                                <p className="text-earth-brown dark:text-neutral-300">lowiskokozlow@gmail.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <Clock className="h-6 w-6 text-sunset-orange" />
                                            <div>
                                                <p className="font-bold text-pine-green-dark dark:text-white">Godziny otwarcia</p>
                                                <p className="text-earth-brown dark:text-neutral-300">Świt - Zmierzch</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>

                            <SpotlightCard className="bg-pine-green-dark p-8 text-white shadow-lg border-2 border-sunset-orange/50 hover:border-sunset-orange transition-colors">
                                <div className="relative z-10">
                                    <h2 className="mb-4 text-2xl font-bold">Zarezerwuj miejsce</h2>
                                    <p className="mb-6 opacity-80">
                                        Planujesz dłuższą zasiadkę? Zadzwoń i zarezerwuj swoje ulubione stanowisko.
                                    </p>
                                    <a href="tel:601389365" className="inline-block w-full rounded-full bg-sunset-orange py-3 text-center font-bold text-white transition-colors hover:bg-orange-700">
                                        Zadzwoń teraz
                                    </a>
                                </div>
                            </SpotlightCard>
                        </div>

                        {/* Map Placeholder - Using Google Maps Embed */}
                        <div className="h-[500px] w-full overflow-hidden rounded-2xl shadow-xl grayscale-50 hover:grayscale-0 transition-all duration-500">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20546.77259688636!2d21.4362375!3d50.0944237!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473d0b2158b5c6c9%3A0x1868e6a4962b222c!2sZalew%20Koz%C5%82owski!5e0!3m2!1spl!2spl!4v1700000000000!5m2!1spl!2spl"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
