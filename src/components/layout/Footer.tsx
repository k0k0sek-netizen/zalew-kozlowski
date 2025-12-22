import Link from "next/link";
import Image from "next/image";
import { SectionReveal } from "@/components/ui/section-reveal";

export const Footer = () => {
    return (
        <footer className="bg-pine-green-dark border-t border-white/10 pt-16 pb-8 text-stone-200">
            <SectionReveal>
                <div className="mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 md:grid-cols-4 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <Link href="/" className="flex items-center gap-2 mb-4 group">
                                <div className="relative h-10 w-auto aspect-video transition-transform group-hover:scale-110">
                                    <Image
                                        src="/logo-brand.png"
                                        alt=""
                                        fill
                                        className="object-contain"
                                        sizes="100px"
                                        aria-hidden="true"
                                    />
                                </div>
                                <span className="text-lg font-bold tracking-wide text-white group-hover:text-sunset-orange transition-colors">
                                    Zalew Kozłowski
                                </span>
                            </Link>
                            <p className="text-sm opacity-70 leading-relaxed">
                                Twoje miejsce na wędkarską przygodę i wypoczynek blisko natury.
                                Zapraszamy wszystkich pasjonatów wędkarstwa.
                            </p>
                        </div>

                        {/* Links */}
                        <div>
                            <h3 className="font-bold text-white mb-4">Na Skróty</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/o-lowisku" className="hover:text-sunset-orange transition-colors">O Łowisku</Link></li>
                                <li><Link href="/regulamin" className="hover:text-sunset-orange transition-colors">Regulamin</Link></li>
                                <li><Link href="/cennik" className="hover:text-sunset-orange transition-colors">Cennik</Link></li>
                                <li><Link href="/galeria" className="hover:text-sunset-orange transition-colors">Galeria</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="font-bold text-white mb-4">Kontakt</h3>
                            <ul className="space-y-2 text-sm opacity-70">
                                <li>Kozłów 4A</li>
                                <li>39-200 Dębica</li>
                                <li><a href="tel:601389365" className="hover:text-sunset-orange transition-colors">tel. 601 389 365</a></li>
                                <li><a href="mailto:lowiskokozlow@gmail.com" className="hover:text-sunset-orange transition-colors">lowiskokozlow@gmail.com</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="font-bold text-white mb-4">Informacje</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/polityka-prywatnosci" className="hover:text-sunset-orange transition-colors">Polityka Prywatności</Link></li>
                                <li><Link href="/regulamin" className="hover:text-sunset-orange transition-colors">Zasady Pobytu</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-60">
                        <p>© {new Date().getFullYear()} Zalew Kozłowski. Wszelkie prawa zastrzeżone.</p>

                        {/* Author Credit - 2026 Trend: Subtle, premium integration */}
                        <div className="flex items-center gap-1">
                            <span>Designed & Developed by</span>
                            <a
                                href="https://wektorkodu.pl"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-white hover:text-sunset-orange transition-colors"
                            >
                                WektorKodu.pl
                            </a>
                        </div>
                    </div>
                </div>
            </SectionReveal>
        </footer>
    );
};
