import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Calendar, Fish, Trophy, Users, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Metadata } from "next";
import { createContentfulClient, ArticleSkeleton } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { Asset } from "contentful";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { ContentfulImage } from "@/components/ui/ContentfulImage";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === "en" ? "News | Kozłowski Reservoir" : "Aktualności | Zalew Kozłowski",
        description: locale === "en"
            ? "Stay up to date with the life of the fishery. Information about stocking, competitions, and events at the Kozłowski Reservoir."
            : "Bądź na bieżąco z życiem łowiska. Informacje o zarybieniach, zawodach i wydarzeniach nad Zalewem Kozłowskim.",
        openGraph: {
            title: locale === "en" ? "News — Kozłowski Reservoir" : "Aktualności — Zalew Kozłowski",
            description: locale === "en"
                ? "Information about stocking, competitions, and events at the reservoir."
                : "Informacje o zarybieniach, zawodach i wydarzeniach nad zalewem.",
            url: "/aktualnosci",
        },
    };
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const { isEnabled } = await draftMode();
    const client = createContentfulClient({ preview: isEnabled });
    const t = await getTranslations({ locale, namespace: "news" });

    let entries = { items: [] as any[] };
    try {
        entries = await client.getEntries<ArticleSkeleton>({
            content_type: "article",
            order: ["-fields.date"],
            locale: locale === "en" ? "en-US" : "pl",
        });
    } catch (err) {
        console.error("[Contentful] Failed to get entries for NewsPage:", err);
    }

    const getIcon = (category: string = "") => {
        const lower = category.toLowerCase();
        if (lower.includes("zarybi") || lower.includes("stock")) return Fish;
        if (lower.includes("zawod") || lower.includes("compet") || lower.includes("tourn")) return Trophy;
        if (lower.includes("spotkanie") || lower.includes("meet") || lower.includes("gather")) return Users;
        return Calendar;
    };

    const posts = entries.items.map((entry) => {
        const coverImage = entry.fields.coverImage as Asset | undefined;
        const imageUrl = coverImage?.fields?.file?.url
            ? `https:${coverImage.fields.file.url}`
            : "/bento/zachod.webp"; // Fallback

        return {
            id: entry.sys.id,
            date: new Date(entry.fields.date).toLocaleDateString(locale === "en" ? "en-US" : "pl-PL"),
            title: entry.fields.title,
            excerpt: entry.fields.excerpt,
            category: entry.fields.category || (locale === "en" ? "News" : "Aktualności"),
            icon: getIcon(entry.fields.category),
            imageSrc: imageUrl,
            color: "text-amber-700 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/20",
            slug: entry.fields.slug,
        };
    });

    return (
        <SubpageWrapper>
            <div className="mx-auto max-w-6xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold heading-accent-gradient bg-size-[200%_100%] animate-shine md:text-5xl">
                        {t("title")}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        {t("subtitle")}
                    </p>
                </SectionReveal>

                {posts.length === 0 ? (
                    <div className="text-center text-xl text-earth-brown dark:text-neutral-400 py-12">
                        {t("empty_news")}
                    </div>
                ) : (
                    <SectionReveal className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" delay={0.2}>
                        {posts.map((post) => {
                            const Icon = post.icon;
                            return (
                                <SpotlightCard
                                    key={post.id}
                                    className="h-full overflow-hidden transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className="flex flex-col h-full relative z-10">
                                        {/* Image Area */}
                                        <div className="relative h-48 w-full overflow-hidden bg-neutral-200 shrink-0">
                                            <ContentfulImage
                                                src={post.imageSrc}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 hover:scale-110"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${post.color}`}>
                                                    <Icon className="h-3.5 w-3.5" />
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Area */}
                                        <div className="flex flex-col grow p-6 bg-transparent">
                                            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-neutral-400">
                                                <Calendar className="h-3.5 w-3.5" />
                                                {post.date}
                                            </div>
                                            <h2 className="mb-3 text-xl font-bold leading-tight text-pine-green dark:text-white">
                                                {post.title}
                                            </h2>
                                            <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                            <div 
                                                className="mt-auto group inline-flex items-center gap-2 text-sm font-bold transition-colors duration-300 hover:opacity-80"
                                                style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                            >
                                                {t("read_more")}
                                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                            </div>
                                        </div>
                                    </div>
                                    <Link href={`/aktualnosci/${post.slug}`} className="absolute inset-0 z-20" aria-label={t("read_more_aria", { title: post.title })} />
                                </SpotlightCard>
                            );
                        })}
                    </SectionReveal>
                )}
            </div>
        </SubpageWrapper>
    );
}
