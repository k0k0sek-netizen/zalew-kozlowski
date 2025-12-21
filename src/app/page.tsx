import { HeroVideo } from "@/components/features/HeroVideo";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Clock, Fish, MapPin, CalendarDays, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WeatherBentoCard } from "@/components/features/WeatherBentoCard";
import { TrustBadge } from "@/components/features/TrustBadge";
import { Metadata } from "next";
import { contentfulClient, InfoBlockSkeleton } from "@/lib/contentful";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Zalew Kozłowski | Prywatne Łowisko i Wypoczynek",
  description: "Odkryj spokój nad Zalewem Kozłowskim. Prywatne łowisko No Kill, piękne karpie, amury i drapieżniki. Idealne miejsce na wędkowanie i wypoczynek blisko Dębicy.",
};

async function getInfoBlocks() {
  const response = await contentfulClient.getEntries<InfoBlockSkeleton>({
    content_type: "infoBlock",
  });
  return response.items;
}

export default async function Home() {
  const infoBlocks = await getInfoBlocks();

  // Helper to find block content
  const getBlock = (search: string) => {
    return infoBlocks.find(b =>
      b.fields.id === search ||
      b.fields.title.toLowerCase().includes(search.toLowerCase())
    );
  };

  const hoursBlock = getBlock('hours') || getBlock('godziny');
  const noKillBlock = getBlock('no-kill') || getBlock('no kill');

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] w-full items-center justify-center overflow-hidden">
        <HeroVideo
          videoSrc="/hero.mp4"
          mobileVideoSrc="/hero-mobile.mp4"
          posterSrc="/hero-poster.jpg"
        />

        <SectionReveal className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] md:animate-shine md:text-7xl lg:text-8xl drop-shadow-lg">
            Zalew Kozłowski
          </h1>
          <p className="max-w-2xl text-lg font-medium text-white md:text-xl drop-shadow-xl shadow-black">
            Witaj na stronie informacyjnej prywatnego łowiska Zalew Kozłowski!
            Nasz piękny zbiornik, położony w malowniczej okolicy tuż obok Dębicy,
            to wyjątkowe miejsce wypoczynku i spotkań z wędką, dom dla karpi, amurów i szczupaków.
          </p>

          <div className="mt-6 flex justify-center">
            <TrustBadge />
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/regulamin"
              className="rounded-full bg-sunset-orange px-8 py-3 text-lg font-semibold text-pine-green-dark transition-transform hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              Zobacz Regulamin
            </Link>
            <Link
              href="/cennik"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              Sprawdź Cennik
            </Link>
          </div>
        </SectionReveal>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <div className="h-10 w-6 rounded-full border-2 border-white/50 p-1">
            <div className="h-2 w-full rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      {/* Info Section (Bento Grid) */}
      <section className="bg-sand-beige px-4 py-24 dark:bg-pine-green-dark">
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
              className="md:col-span-2"
              Icon={Clock}
              description={hoursBlock?.fields.value || "Czynne od świtu do zmierzchu. Wędkowanie nocne możliwe po wcześniejszym uzgodnieniu telefonicznym."}
              href="/regulamin"
              cta="Sprawdź"
              background={
                <Image
                  src="/bento/zachod.webp"
                  alt="Zachód słońca"
                  fill
                  className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              }
            />
            <BentoCard
              name={noKillBlock?.fields.title || "No Kill"}
              className="md:col-span-1"
              Icon={Fish}
              description={noKillBlock?.fields.value || "Obowiązuje całkowity zakaz zabierania ryb. Każda złowiona sztuka wraca do wody."}
              href="/regulamin"
              cta="Zasady"
              background={
                <Image
                  src="/bento/ryba2.webp"
                  alt="Ryba pod wodą"
                  fill
                  className="absolute inset-0 h-full w-full object-cover opacity-50 grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              }
            />
            <BentoCard
              name="Dojazd"
              className="md:col-span-1"
              Icon={MapPin}
              description="Łatwy dojazd z Dębicy (ok. 10 min). Parking dostępny tuż przy łowisku."
              href="/kontakt"
              cta="Mapa"
              background={
                <Image
                  src="/bento/mapa.webp"
                  alt="Mapa Dojazdu"
                  fill
                  className="absolute inset-0 h-full w-full object-cover opacity-80 md:opacity-60 md:grayscale transition-all duration-500 group-hover:scale-110 group-hover:grayscale-0"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              }
            />
            <WeatherBentoCard className="md:col-span-2" />
          </BentoGrid>
        </SectionReveal>
      </section>

      {/* Characteristics Section */}
      <section className="bg-white px-4 py-24 dark:bg-black/20">
        <SectionReveal className="mx-auto max-w-7xl grid gap-12 md:grid-cols-2 items-center" delay={0.2}>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] md:animate-shine md:text-4xl">
              Charakterystyka Zalewu
            </h2>
            <div className="prose prose-lg text-earth-brown dark:text-neutral-300">
              <p>
                Zalew Kozłowski to popularne łowisko prywatne o powierzchni ok. 1 hektara.
                Średnia głębokość wynosi 1 - 1.5 metra, co zapewnia optymalne warunki dla ryb spokojnego żeru.
              </p>
              <p>
                W zalewie regularnie łowione są piękne okazy. Dominują przede wszystkim:
                <strong className="text-pine-green dark:text-sunset-orange"> Karp, Amur, Szczupak</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>Wygodny dostęp do linii brzegowej</li>
                <li>Naturalne, trawiaste stanowiska wędkarskie</li>
                <li>Monitoring i ochrona obiektu</li>
              </ul>
            </div>
            <Link href="/o-lowisku" className="inline-flex items-center gap-2 text-sunset-orange font-bold hover:underline">
              Więcej o łowisku <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
            {/* Image Placeholder */}
            <Image
              src="/krajobraz.jpg"
              alt="Krajobraz Zalewu Kozłowskiego"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-bold text-lg">Spokój i Natura</p>
              <p className="text-sm opacity-80">Idealne miejsce na weekend</p>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
