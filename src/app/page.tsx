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


export const metadata: Metadata = {
  title: "Zalew Kozłowski | Prywatne Łowisko i Wypoczynek",
  description: "Odkryj spokój nad Zalewem Kozłowskim. Prywatne łowisko No Kill, piękne karpie, amury i drapieżniki. Idealne miejsce na wędkowanie i wypoczynek blisko Dębicy.",
};

export default async function Home() {
  const { isEnabled } = await draftMode();
  const [infoBlocks, weatherData] = await Promise.all([
    getInfoBlocks(isEnabled),
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

  const characteristicsDesc = getBlock('characteristics-description')?.fields.value || "Zalew Kozłowski to popularne łowisko prywatne o powierzchni ok. 1 hektara. Średnia głębokość wynosi 1 - 1.5 metra, co zapewnia optymalne warunki dla ryb spokojnego żeru.\nW zalewie regularnie łowione są piękne okazy. Dominują przede wszystkim: Karp, Amur, Szczupak.";
  
  const shorelineTitle = getBlock('characteristics-shoreline')?.fields.title || "Linia brzegowa";
  const shorelineValue = getBlock('characteristics-shoreline')?.fields.value || "Szeroki i swobodny dostęp do wody na całej długości.";
  
  const spotsTitle = getBlock('characteristics-spots')?.fields.title || "Stanowiska";
  const spotsValue = getBlock('characteristics-spots')?.fields.value || "Naturalne, trawiaste i zadbane miejsca.";
  
  const securityTitle = getBlock('characteristics-security')?.fields.title || "Ochrona i monitoring";
  const securityValue = getBlock('characteristics-security')?.fields.value || "Bezpieczeństwo i spokój podczas wypoczynku.";

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
              Zalew Kozłowski
            </h1>
          </div>
          <p className="max-w-2xl text-lg font-medium text-white md:text-xl drop-shadow-xl shadow-black">
            Witaj na stronie informacyjnej prywatnego łowiska Zalew Kozłowski!
            Nasz piękny zbiornik, położony w malowniczej okolicy tuż obok Dębicy,
            to wyjątkowe miejsce wypoczynku i spotkań z wędką, dom dla karpi, amurów i szczupaków.
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
                Zobacz Regulamin
              </Link>
            </Magnetic>
            <Magnetic strength={0.15}>
              <Link
                href="/cennik"
                className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95 duration-300 btn-hero-glass-glow"
              >
                Sprawdź Cennik
              </Link>
            </Magnetic>
          </div>
        </SectionReveal>

        {/* Scroll Indicator */}
        <a
          href="#info-section"
          aria-label="Przewiń do sekcji informacyjnej"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors scroll-indicator-fade cursor-pointer z-20"
        >
          <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1 flex justify-center">
            <div className="h-3 w-1.5 rounded-full bg-white/50 animate-scroll-dot" />
          </div>
        </a>

        {/* Bottom Fade-out transition to smooth exit from wideo to content bg */}
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
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] md:animate-shine md:text-5xl">
                Najważniejsze Informacje
              </h2>
              <p className="mt-4 text-earth-brown dark:text-neutral-400">
                Wszystko, co musisz wiedzieć zanim zarzucisz wędkę.
              </p>
            </div>

            <BentoGrid>
              <BentoCard
                name={hoursBlock?.fields.title || "Godziny Otwarcia"}
                className="md:col-span-2 bg-transparent!"
                Icon={Clock}
                description={hoursBlock?.fields.value || "Czynne od świtu do zmierzchu. Wędkowanie nocne możliwe po wcześniejszym uzgodnieniu telefonicznym."}
                href="/regulamin"
                cta="Sprawdź"
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
                name={noKillBlock?.fields.title || "No Kill"}
                className="md:col-span-1 bg-transparent!"
                Icon={Fish}
                description={noKillBlock?.fields.value || "Obowiązuje całkowity zakaz zabierania ryb. Każda złowiona sztuka wraca do wody."}
                href="/regulamin"
                cta="Zasady"
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
                name="Dojazd"
                className="md:col-span-1 bg-transparent!"
                Icon={MapPin}
                description="Łatwy dojazd z Dębicy (ok. 10 min). Parking dostępny tuż przy łowisku."
                href="/kontakt"
                cta="Mapa"
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
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] md:animate-shine md:text-4xl">
                  Charakterystyka Zalewu
                </h2>
                <div className="text-earth-brown dark:text-neutral-300 space-y-4">
                  {characteristicsDesc.split('\n').map((paragraph, index) => {
                    if (paragraph.includes("Karp, Amur, Szczupak")) {
                      const parts = paragraph.split("Karp, Amur, Szczupak");
                      return (
                        <p key={index} className="text-lg leading-relaxed">
                          {parts[0]}
                          <strong className="text-pine-green dark:text-sunset-orange font-bold">Karp, Amur, Szczupak</strong>
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
                    <div className="group/feat flex flex-col p-4 rounded-xl border border-pine-green/10 dark:border-white/5 bg-white/20 dark:bg-white/5 transition-all duration-300 hover:border-sunset-orange/30 hover:-translate-y-1">
                      <div className="rounded-lg bg-pine-green/10 dark:bg-white/10 p-2 w-fit text-pine-green dark:text-sunset-orange transition-all duration-300 group-hover/feat:bg-sunset-orange/10 group-hover/feat:scale-110 group-hover/feat:rotate-6">
                        <Waves className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-pine-green-dark dark:text-white mt-3 mb-1">
                        {shorelineTitle}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                        {shorelineValue}
                      </p>
                    </div>

                    <div className="group/feat flex flex-col p-4 rounded-xl border border-pine-green/10 dark:border-white/5 bg-white/20 dark:bg-white/5 transition-all duration-300 hover:border-sunset-orange/30 hover:-translate-y-1">
                      <div className="rounded-lg bg-pine-green/10 dark:bg-white/10 p-2 w-fit text-pine-green dark:text-sunset-orange transition-all duration-300 group-hover/feat:bg-sunset-orange/10 group-hover/feat:scale-110 group-hover/feat:rotate-6">
                        <Trees className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-pine-green-dark dark:text-white mt-3 mb-1">
                        {spotsTitle}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-normal">
                        {spotsValue}
                      </p>
                    </div>

                    <div className="group/feat flex flex-col p-4 rounded-xl border border-pine-green/10 dark:border-white/5 bg-white/20 dark:bg-white/5 transition-all duration-300 hover:border-sunset-orange/30 hover:-translate-y-1">
                      <div className="rounded-lg bg-pine-green/10 dark:bg-white/10 p-2 w-fit text-pine-green dark:text-sunset-orange transition-all duration-300 group-hover/feat:bg-sunset-orange/10 group-hover/feat:scale-110 group-hover/feat:rotate-6">
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

              {/* Animated CTA Underline Link */}
              <div className="pt-6 mt-6 border-t border-earth-brown/10 dark:border-white/10">
                <TransitionLink
                  href="/o-lowisku"
                  className="group/link inline-flex items-center gap-2 text-sunset-orange font-bold text-lg relative pb-1"
                >
                  Więcej o łowisku
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-sunset-orange transform scale-x-0 origin-left transition-transform duration-300 group-hover/link:scale-x-100" />
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
              <div className="absolute bottom-6 left-6 right-6 z-20 p-5 rounded-xl border border-white/10 bg-white/10 dark:bg-black/20 backdrop-blur-md text-white transition-all duration-300 group-hover/image-card:border-sunset-orange/30 group-hover/image-card:-translate-y-1">
                <p className="font-bold text-2xl tracking-tight shadow-black/20 drop-shadow-md">
                  Spokój i Natura
                </p>
                <p className="text-sm text-white/80 font-medium mt-1">
                  Idealne miejsce na weekend
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
