import { HeroVideo } from "@/components/features/HeroVideo";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Clock, Fish, MapPin, CalendarDays, ArrowRight, Waves, Trees, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WeatherBentoCard } from "@/components/features/WeatherBentoCard";
import { getWeatherAction } from "@/app/actions/weather";
import { TrustBadge } from "@/components/features/TrustBadge";
import { Metadata } from "next";
import { getInfoBlocks, InfoBlockSkeleton } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { SpotlightSectionWrapper } from "@/components/ui/spotlight-section-wrapper";
import { Magnetic } from "@/components/ui/magnetic";
import { TiltCard } from "@/components/ui/TiltCard";
import { TransitionLink } from "@/components/ui/TransitionLink";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { getGlowColorForScore } from "@/lib/bite-index-theme";

export const revalidate = 3600;


import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "en" ? "Kozłowski Reservoir | Private Fishery & Relaxation" : "Zalew Kozłowski | Prywatne Łowisko i Wypoczynek",
    description: locale === "en"
      ? "Discover peace at Kozłowski Reservoir. Private No Kill fishery, beautiful carp, grass carp, and predators. Ideal place for fishing and relaxation near Dębica."
      : "Odkryj spokój nad Zalewem Kozłowskim. Prywatne łowisko No Kill, piękne karpie, amury i drapieżniki. Idealne miejsce na wędkowanie i wypoczynek blisko Dębicy.",
  };
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tHero = await getTranslations("hero");
  const tBento = await getTranslations("bento");
  const tChar = await getTranslations("characteristics");

  const { isEnabled } = await draftMode();
  const [infoBlocks, weatherData] = await Promise.all([
    getInfoBlocks(isEnabled, locale),
    getWeatherAction(),
  ]);

  const activeGlowColor = weatherData ? getGlowColorForScore(weatherData.score) : "249, 115, 22";

  // Helper to find block content
  const getBlock = (search: string) => {
    return infoBlocks.find(b =>
      b.fields.id === search ||
      b.fields.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  const hoursBlock = getBlock('hours') || getBlock('godziny');
  const noKillBlock = getBlock('no-kill') || getBlock('no kill');

  // Fallbacks with language check
  const enCharDescFallback = "Kozłowski Reservoir is a popular private fishery covering approx. 1 hectare. The average depth is 1 - 1.5 meters, providing optimal conditions for coarse fish.\nBeautiful specimens are regularly caught here. Dominating species: Carp, Grass Carp, Pike.";
  const plCharDescFallback = "Zalew Kozłowski to popularne łowisko prywatne o powierzchni ok. 1 hektara. Średnia głębokość wynosi 1 - 1.5 metra, co zapewnia optymalne warunki dla ryb spokojnego żeru.\nW zalewie regularnie łowione są piękne okazy. Dominują przede wszystkim: Karp, Amur, Szczupak.";

  const characteristicsDesc = locale === "en"
    ? (getBlock('characteristics-description')?.fields.valueEn || enCharDescFallback)
    : (getBlock('characteristics-description')?.fields.value || plCharDescFallback);
  
  const shorelineTitle = locale === "en"
    ? (getBlock('characteristics-shoreline')?.fields.titleEn || tChar("shoreline_title"))
    : (getBlock('characteristics-shoreline')?.fields.title || tChar("shoreline_title"));
  const shorelineValue = locale === "en"
    ? (getBlock('characteristics-shoreline')?.fields.valueEn || tChar("shoreline_desc"))
    : (getBlock('characteristics-shoreline')?.fields.value || tChar("shoreline_desc"));
  
  const spotsTitle = locale === "en"
    ? (getBlock('characteristics-spots')?.fields.titleEn || tChar("spots_title"))
    : (getBlock('characteristics-spots')?.fields.title || tChar("spots_title"));
  const spotsValue = locale === "en"
    ? (getBlock('characteristics-spots')?.fields.valueEn || tChar("spots_desc"))
    : (getBlock('characteristics-spots')?.fields.value || tChar("spots_desc"));
  
  const securityTitle = locale === "en"
    ? (getBlock('characteristics-security')?.fields.titleEn || tChar("security_title"))
    : (getBlock('characteristics-security')?.fields.title || tChar("security_title"));
  const securityValue = locale === "en"
    ? (getBlock('characteristics-security')?.fields.valueEn || tChar("security_desc"))
    : (getBlock('characteristics-security')?.fields.value || tChar("security_desc"));

  const mapUrl = getBlock('map-url')?.fields.value || "https://www.google.com/maps/search/?api=1&query=Zalew+Koz%C5%82owski+Koz%C5%82%C3%B3w";


  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full items-center justify-center overflow-hidden hero-section">
        <HeroVideo
          videoSrc="/hero-hq.mp4"
          mobileVideoSrc="/hero-mobile-hq.mp4"
          posterSrc="/hero-poster.jpg"
        />
        <div className="absolute inset-0 bg-black/20 dark:bg-black/45 z-[1] pointer-events-none" />

        <SectionReveal className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center hero-content-scroll">
          <div className="overflow-hidden py-2">
            <h1 className="mb-4 text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] md:animate-shine md:text-7xl lg:text-8xl drop-shadow-lg animate-title-reveal">
              {tHero("title")}
            </h1>
          </div>
          <p className="max-w-2xl text-lg font-medium text-white md:text-xl drop-shadow-xl shadow-black">
            {tHero("subtitle")}
          </p>

          <div className="mt-6 flex justify-center z-10">
            <Magnetic strength={0.1}>
              <TrustBadge mapUrl={mapUrl} />
            </Magnetic>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row z-10">
            <Magnetic strength={0.15}>
              <Link
                href="/regulamin"
                className="inline-flex items-center justify-center rounded-full px-8 py-3 text-lg font-semibold text-white transition-all hover:scale-105 active:scale-95 shadow-lg duration-300 btn-hero-shine border"
                style={{
                  backgroundImage: "linear-gradient(135deg, rgba(var(--active-glow-color, 249, 115, 22), 0.85) 0%, rgb(var(--active-glow-color, 249, 115, 22)) 100%)",
                  boxShadow: "0 10px 25px -5px rgba(var(--active-glow-color, 249, 115, 22), 0.45)",
                  borderColor: "rgba(var(--active-glow-color, 249, 115, 22), 0.25)"
                }}
              >
                {tHero("cta_rules")}
              </Link>
            </Magnetic>
            <Magnetic strength={0.15}>
              <Link
                href="/cennik"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95 duration-300 btn-hero-glass-glow"
              >
                {tHero("cta_pricing")}
              </Link>
            </Magnetic>
          </div>
        </SectionReveal>

        {/* Scroll Indicator */}
        <a
          href="#info-section"
          aria-label={tHero("scroll_aria")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors scroll-indicator-fade cursor-pointer z-20"
        >
          <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1 flex justify-center">
            <div className="h-3 w-1.5 rounded-full bg-white/50 animate-scroll-dot" />
          </div>
        </a>

        {/* Bottom Fade-out transition to smooth exit from video to content bg */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sand-beige dark:from-[#071610] to-transparent z-[2] pointer-events-none" />
      </section>

      {/* Wrapper for Sections 2 & 3 to share a single continuous background */}
      <SpotlightSectionWrapper className="bg-sand-beige dark:bg-[#071610] bg-aurora-dots">
        {/* Top Fade-in transition to mask the start of dots and aurora */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sand-beige dark:from-[#071610] to-transparent z-[2] pointer-events-none" />

        {/* Info Section (Bento Grid) */}
        <section id="info-section" className="relative px-4 py-24">
          <SectionReveal className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold heading-accent-gradient bg-size-[200%_100%] md:animate-shine md:text-5xl">
                {tBento("title")}
              </h2>
              <p className="mt-4 text-earth-brown dark:text-neutral-400">
                {tBento("subtitle")}
              </p>
            </div>

            <BentoGrid>
              <BentoCard
                name={
                  locale === "en"
                    ? (hoursBlock?.fields.titleEn || tBento("hours_title"))
                    : (hoursBlock?.fields.title || tBento("hours_title"))
                }
                className="md:col-span-2 bg-transparent!"
                Icon={Clock}
                description={
                  locale === "en"
                    ? (hoursBlock?.fields.valueEn || tBento("hours_desc"))
                    : (hoursBlock?.fields.value || tBento("hours_desc"))
                }
                href="/regulamin"
                cta={tBento("hours_cta")}
                glowColor={activeGlowColor}
                background={
                  <>
                    <Image
                      src="/bento/zachod.webp"
                      alt="Zachód słońca"
                      fill
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 66vw, 854px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent dark:from-black/85 dark:via-black/40 dark:to-black/15 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-transparent dark:group-hover:from-black/90 dark:group-hover:via-black/50 dark:group-hover:to-black/20 transition-all duration-500" />
                  </>
                }
              />
              <BentoCard
                name={
                  locale === "en"
                    ? (noKillBlock?.fields.titleEn || tBento("nokill_title"))
                    : (noKillBlock?.fields.title || tBento("nokill_title"))
                }
                className="md:col-span-1 bg-transparent!"
                Icon={Fish}
                description={
                  locale === "en"
                    ? (noKillBlock?.fields.valueEn || tBento("nokill_desc"))
                    : (noKillBlock?.fields.value || tBento("nokill_desc"))
                }
                href="/regulamin"
                cta={tBento("nokill_cta")}
                glowColor={activeGlowColor}
                background={
                  <>
                    <Image
                      src="/bento/ryba2.webp"
                      alt="Ryba pod wodą"
                      fill
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 427px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent dark:from-black/85 dark:via-black/40 dark:to-black/15 group-hover:from-black/60 group-hover:via-black/20 group-hover:to-transparent dark:group-hover:from-black/90 dark:group-hover:via-black/50 dark:group-hover:to-black/20 transition-all duration-500" />
                  </>
                }
              />
              <BentoCard
                name={tBento("directions_title")}
                className="md:col-span-1 bg-transparent!"
                Icon={MapPin}
                description={tBento("directions_desc")}
                href="/kontakt"
                cta={tBento("directions_cta")}
                glowColor={activeGlowColor}
                background={
                  <>
                    <Image
                      src="/bento/mapa.webp"
                      alt="Mapa Dojazdu"
                      fill
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 427px"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent dark:from-black/90 dark:via-black/45 dark:to-black/20 group-hover:from-black/65 group-hover:via-black/20 group-hover:to-transparent dark:group-hover:from-black/95 dark:group-hover:via-black/55 dark:group-hover:to-black/25 transition-all duration-500" />
                  </>
                }
              />
              <WeatherBentoCard weather={weatherData} className="md:col-span-2 bg-transparent!" />
            </BentoGrid>
          </SectionReveal>
        </section>

        {/* Characteristics Section */}
        <section className="relative px-4 pt-24 pb-36">
          <SectionReveal className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 items-stretch" delay={0.2}>
            <SpotlightCard className="p-8 md:p-10 rounded-2xl flex flex-col justify-between h-full">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold heading-accent-gradient bg-size-[200%_100%] md:animate-shine md:text-4xl">
                  {tChar("title")}
                </h2>
                <div className="text-earth-brown dark:text-neutral-300 space-y-4">
                  {characteristicsDesc.split('\n').map((paragraph, index) => {
                    const strongText = tChar("strong_text");
                    if (paragraph.includes(strongText)) {
                      const parts = paragraph.split(strongText);
                      return (
                        <p key={index} className="text-lg leading-relaxed">
                          {parts[0]}
                          <strong className="text-accent font-bold">{strongText}</strong>
                          {parts[1]}
                        </p>
                      );
                    }
                    return (
                      <p key={index} className="text-lg leading-relaxed">
                        {paragraph}
                      </p>
                    );
                  })}

                  {/* Glassmorphic Features Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="group/feat flex flex-col p-4 rounded-xl border bg-white/20 dark:bg-white/5 feature-card hover:-translate-y-1">
                      <div className="rounded-lg p-2 w-fit icon-container-accent">
                        <Waves className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-pine-green-dark dark:text-white mt-3 mb-1">
                        {shorelineTitle}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                        {shorelineValue}
                      </p>
                    </div>

                    <div className="group/feat flex flex-col p-4 rounded-xl border bg-white/20 dark:bg-white/5 feature-card hover:-translate-y-1">
                      <div className="rounded-lg p-2 w-fit icon-container-accent">
                        <Trees className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-pine-green-dark dark:text-white mt-3 mb-1">
                        {spotsTitle}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                        {spotsValue}
                      </p>
                    </div>

                    <div className="group/feat flex flex-col p-4 rounded-xl border bg-white/20 dark:bg-white/5 feature-card hover:-translate-y-1">
                      <div className="rounded-lg p-2 w-fit icon-container-accent">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-pine-green-dark dark:text-white mt-3 mb-1">
                        {securityTitle}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                        {securityValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-earth-brown/10 dark:border-white/10">
                <TransitionLink
                  href="/o-lowisku"
                  className="group/link inline-flex items-center gap-2 link-accent font-bold text-lg relative pb-1"
                >
                  {tChar("cta_more")}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                  <span className="absolute bottom-0 left-0 w-full h-[2px] link-underline-accent transform scale-x-0 origin-left transition-transform duration-300 group-hover/link:scale-x-100" />
                </TransitionLink>
              </div>
            </SpotlightCard>

            <TiltCard
              noBg
              className="relative h-full min-h-[26rem] w-full group/image-card"
              glowColor={activeGlowColor}
            >
              <div className="bento-parallax-bg">
                <Image
                  src="/krajobraz.jpg"
                  alt="Krajobraz Zalewu Kozłowskiego"
                  fill
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 transform-gpu will-change-transform"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
                  quality={70}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-transparent z-[1]" />
              </div>

              {/* Content text overlay (Floating Glassmorphic Card) */}
              <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-xl border bg-white/10 dark:bg-black/20 backdrop-blur-md text-white transition-all duration-300 image-card-overlay group-hover/image-card:-translate-y-1">
                <p className="font-bold text-2xl tracking-tight shadow-black/20 drop-shadow-md">
                  {tChar("card_title")}
                </p>
                <p className="text-sm text-white/80 font-medium mt-1">
                  {tChar("card_subtitle")}
                </p>
              </div>
            </TiltCard>
          </SectionReveal>
        </section>

        {/* Bottom Fade-out transition to smooth entry to footer */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-clay-gray dark:from-pine-green-dark to-transparent z-[2] pointer-events-none" />
      </SpotlightSectionWrapper>
    </>
  );
}
