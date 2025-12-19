import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Calendar, Fish, Trophy, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { contentfulClient, createContentfulClient, ArticleSkeleton } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { Asset } from "contentful";

export const metadata: Metadata = {
    title: "Aktualności | Zalew Kozłowski",
    description: "Bądź na bieżąco z życiem łowiska. Informacje o zarybieniach, zawodach i wydarzeniach nad Zalewem Kozłowskim.",
};


export default async function NewsPage() {
    const { isEnabled } = await draftMode();
    const client = createContentfulClient({ preview: isEnabled });

    const entries = await client.getEntries<ArticleSkeleton>({
        content_type: "article",
        order: ["-fields.date"],
    });

    const getIcon = (category: string = "") => {
        const lower = category.toLowerCase();
        if (lower.includes("zarybi")) return Fish;
        if (lower.includes("zawod")) return Trophy;
        if (lower.includes("spotkanie")) return Users;
        return Calendar;
    };

    const posts = entries.items.map((entry) => {
        const coverImage = entry.fields.coverImage as Asset | undefined;
        const imageUrl = coverImage?.fields?.file?.url
            ? `https:${coverImage.fields.file.url}`
            : "/bento/zachod.webp"; // Fallback

        return {
            id: entry.sys.id,
            date: new Date(entry.fields.date).toLocaleDateString("pl-PL"),
            title: entry.fields.title,
            excerpt: entry.fields.excerpt,
            category: entry.fields.category || "Aktualności",
            icon: getIcon(entry.fields.category),
            imageSrc: imageUrl,
            color: "text-amber-500 bg-amber-500/10", // You could map this too if needed
            slug: entry.fields.slug,
        };
    });

    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-6xl px-4">
                <SectionReveal className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold text-pine-green-dark dark:text-white md:text-5xl">
                        Aktualności
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-earth-brown dark:text-neutral-300">
                        Bądź na bieżąco z życiem naszego łowiska. Zarybienia, zawody i ważne komunikaty.
                    </p>
                </SectionReveal>

                {posts.length === 0 ? (
                    <div className="text-center text-xl text-earth-brown dark:text-neutral-400 py-12">
                        Brak aktualności. Zajrzyj tu wkrótce!
                    </div>
                ) : (
                    <SectionReveal className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" delay={0.2}>
                        {posts.map((post) => {
                            const Icon = post.icon;
                            return (
                                <SpotlightCard
                                    key={post.id}
                                    className="flex flex-col overflow-hidden border-none shadow-lg transition-all hover:-translate-y-2 hover:shadow-2xl h-full"
                                >
                                    {/* Image Area */}
                                    <div className="relative h-48 w-full overflow-hidden bg-neutral-200">
                                        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-110"
                                            style={{ backgroundImage: `url('${post.imageSrc}')` }}
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur-md ${post.color}`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex flex-1 flex-col p-6 relative z-10 bg-white dark:bg-pine-green-dark/50">
                                        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-neutral-400">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {post.date}
                                        </div>
                                        <h2 className="mb-3 text-xl font-bold leading-tight text-pine-green dark:text-white">
                                            {post.title}
                                        </h2>
                                        <p className="mb-6 flex-1 text-sm text-neutral-600 dark:text-neutral-300">
                                            {post.excerpt}
                                        </p>
                                        <div className="group inline-flex items-center gap-2 text-sm font-bold text-sunset-orange transition-colors hover:text-orange-600">
                                            Czytaj więcej
                                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                    <Link href={`/aktualnosci/${post.slug}`} className="absolute inset-0 z-20" aria-label={`Czytaj: ${post.title}`} />
                                </SpotlightCard>
                            );
                        })}
                    </SectionReveal>
                )}
            </div>
        </div>
    );
}
