import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { TrackablePhoneLink, TrackableEmailLink, FooterLogoLink } from "@/components/layout/FooterLinks";
import { getWeatherAction } from "@/app/actions/weather";
import { getInfoBlocks } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { getTranslations, getLocale } from "next-intl/server";

export const Footer = async () => {
    const { isEnabled } = await draftMode();
    const locale = await getLocale();
    const [weather, infoBlocks, t, tNav, tWeather, tCommon] = await Promise.all([
        getWeatherAction().catch(() => null),
        getInfoBlocks(isEnabled, locale).catch(() => []),
        getTranslations("footer"),
        getTranslations("navbar"),
        getTranslations("weather"),
        getTranslations("common")
    ]);

    const phone = infoBlocks.find((b: any) => b.fields.id === "phone")?.fields.value || "601 389 365";
    const email = infoBlocks.find((b: any) => b.fields.id === "email")?.fields.value || "lowiskokozlow@gmail.com";
    const address = infoBlocks.find((b: any) => b.fields.id === "address")?.fields.value || "Kozłów 4A, 39-200 Dębica";
    const mapUrl = infoBlocks.find((b: any) => b.fields.id === "map-url")?.fields.value || "https://www.google.com/maps/search/?api=1&query=Zalew+Koz%C5%82owski+Koz%C5%82%C3%B3w";


    return (
        <footer className="relative overflow-hidden bg-clay-gray dark:bg-pine-green-dark pt-16 pb-8 text-pine-green-dark dark:text-stone-200 border-t border-pine-green/10 dark:border-white/5 transition-colors duration-300">
            {/* Background Textures */}
            <div className="absolute inset-0 bg-dot-pattern opacity-[0.05] dark:opacity-[0.03] pointer-events-none" />
            <div className="absolute inset-0 bg-noise opacity-[0.02] dark:opacity-[0.03] pointer-events-none" />
            
            {/* Dynamic Active Glow in Bottom Right Corner */}
            <div 
                className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-15 dark:opacity-20 pointer-events-none blur-[100px] transition-all duration-1000"
                style={{
                    background: `radial-gradient(circle, rgba(var(--active-glow-color, 249, 115, 22), 0.45) 0%, transparent 70%)`
                }}
            />

            <SectionReveal>
                <div className="relative z-10 mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 md:grid-cols-4 mb-12">
                        {/* Brand Column */}
                        <div className="md:col-span-1 space-y-4">
                            <FooterLogoLink className="flex items-center gap-3 group w-fit">
                                <div className="relative h-16 w-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                    <Image
                                        src="/logo-icon-v6.png"
                                        alt="Zalew Kozłowski Logo"
                                        fill
                                        className="object-contain scale-[1.45]"
                                        sizes="64px"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="flex flex-col select-none text-pine-green-dark dark:text-white transition-colors duration-300">
                                    <span className="font-display font-bold text-[13px] leading-tight tracking-wide group-hover:text-accent transition-colors duration-300">
                                        {tCommon("logo_text_1")}
                                    </span>
                                    <span className="font-display font-extrabold text-[16px] leading-tight tracking-tight text-accent -mt-0.5">
                                        {tCommon("logo_text_2")}
                                    </span>
                                </div>
                            </FooterLogoLink>
                            <p className="text-sm opacity-70 leading-relaxed pt-2">
                                {t("description")}
                            </p>
                            
                            <div className="flex items-center gap-3 pt-2">
                                <a 
                                    href="https://www.facebook.com/profile.php?id=100057065099351" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center h-10 w-10 rounded-full border border-pine-green/20 dark:border-white/10 text-pine-green-dark dark:text-stone-300 hover-border-accent hover-text-accent hover-bg-accent-light transition-all duration-300 hover:-translate-y-1"
                                    aria-label={t("facebook_aria")}
                                >
                                    <Facebook className="h-4 w-4" />
                                </a>
                                <a 
                                    href="https://www.instagram.com/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center h-10 w-10 rounded-full border border-pine-green/20 dark:border-white/10 text-pine-green-dark dark:text-stone-300 hover-border-accent hover-text-accent hover-bg-accent-light transition-all duration-300 hover:-translate-y-1"
                                    aria-label={t("instagram_aria")}
                                >
                                    <Instagram className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
 
                        {/* Navigation Links Column */}
                        <div>
                            <h3 className="font-bold text-pine-green-dark dark:text-white mb-4 tracking-wide text-sm uppercase opacity-90">{t("quick_links")}</h3>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { href: "/o-lowisku", label: tNav("about") },
                                    { href: "/cennik", label: tNav("pricing") },
                                    { href: "/galeria", label: tNav("gallery") },
                                    { href: "/aktualnosci", label: tNav("news") }
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="group flex items-center gap-2 text-pine-green-dark/80 dark:text-stone-300/80 hover-text-accent transition-all duration-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-accent transform scale-0 origin-left transition-transform duration-300 group-hover:scale-100" />
                                            <span className="transition-transform duration-300 group-hover:translate-x-0.5">{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
 
                        {/* Legal / Info Links Column */}
                        <div>
                            <h3 className="font-bold text-pine-green-dark dark:text-white mb-4 tracking-wide text-sm uppercase opacity-90">{t("info_links")}</h3>
                            <ul className="space-y-3 text-sm">
                                {[
                                    { href: "/regulamin", label: tNav("rules_long") },
                                    { href: "/regulamin#zasady-pobytu", label: tNav("stay_rules") },
                                    { href: "/polityka-prywatnosci", label: tNav("privacy") }
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="group flex items-center gap-2 text-pine-green-dark/80 dark:text-stone-300/80 hover-text-accent transition-all duration-300">
                                            <span className="h-1.5 w-1.5 rounded-full bg-accent transform scale-0 origin-left transition-transform duration-300 group-hover:scale-100" />
                                            <span className="transition-transform duration-300 group-hover:translate-x-0.5">{link.label}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
 
                        {/* Contact & Status Column */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-pine-green-dark dark:text-white tracking-wide text-sm uppercase opacity-90">{t("contact_title")}</h3>
                            <ul className="space-y-2.5 text-sm">
                                <li className="opacity-90">
                                    <a
                                        href={mapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-start gap-2.5 text-pine-green-dark/80 dark:text-stone-300/80 hover-text-accent transition-all duration-300 w-fit"
                                    >
                                        <MapPin className="h-4.5 w-4.5 text-accent shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-115 group-hover:-translate-y-1" />
                                        <span>{address}</span>
                                    </a>
                                </li>
                                <li>
                                    <TrackablePhoneLink phone={phone} className="group flex items-center gap-2.5 text-pine-green-dark/80 dark:text-stone-300/80 hover-text-accent transition-all duration-300 w-fit">
                                        <Phone className="h-4.5 w-4.5 text-accent shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-12" />
                                        <span className="font-semibold">{phone}</span>
                                    </TrackablePhoneLink>
                                </li>
                                <li>
                                    <TrackableEmailLink email={email} className="group flex items-center gap-2.5 text-pine-green-dark/80 dark:text-stone-300/80 hover-text-accent transition-all duration-300 w-fit">
                                        <Mail className="h-4.5 w-4.5 text-accent shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]" />
                                        <span>{email}</span>
                                    </TrackableEmailLink>
                                </li>
                            </ul>
 
                            {/* Dynamic Fishing Index status widget */}
                            {weather && (
                                <div className="p-3.5 rounded-xl border border-pine-green/10 dark:border-white/5 bg-white/20 dark:bg-black/15 backdrop-blur-xs transition-colors duration-300">
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: `rgb(var(--active-glow-color, 249, 115, 22))` }} />
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: `rgb(var(--active-glow-color, 249, 115, 22))` }} />
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-pine-green/60 dark:text-stone-400/60">{t("fishing_index")}</span>
                                    </div>
                                    <p className="text-xs font-extrabold mt-1 text-pine-green-dark dark:text-white">
                                        {tWeather(`labels.${weather.label}`)}
                                    </p>
                                    <p className="text-[10px] opacity-75 mt-0.5">
                                        {tWeather("temp")}: {weather.temperature}°C • {tWeather("pressure")}: {weather.pressure} {tWeather("hpa")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
 
                    {/* Bottom Bar */}
                    <div className="border-t border-pine-green/10 dark:border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs opacity-60">
                        <p>© {new Date().getFullYear()} Zalew Kozłowski. {t("rights_reserved")}</p>
 
                        <div className="flex items-center gap-1">
                            <span>{tCommon("designed_by")}</span>
                            <a
                                href="https://wektorkodu.pl"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-pine-green-dark dark:text-white hover-text-accent transition-colors"
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
