import { SectionReveal } from "@/components/ui/section-reveal";
import { ArrowLeft, Calendar, Fish } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { contentfulClient, createContentfulClient, ArticleSkeleton } from "@/lib/contentful";
import { draftMode } from "next/headers";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS } from '@contentful/rich-text-types';
import { Asset } from "contentful";
import { Metadata } from "next";
import { SubpageWrapper } from "@/components/layout/SubpageWrapper";
import { ContentfulImage } from "@/components/ui/ContentfulImage";
import { SpotlightCard } from "@/components/ui/spotlight-card";

export async function generateStaticParams() {
    try {
        const client = createContentfulClient({ preview: false });
        const response = await client.getEntries<ArticleSkeleton>({
            content_type: "article",
            select: ["fields.slug" as any],
        });

        return response.items
            .filter(item => item.fields.slug)
            .map((item) => ({
                slug: item.fields.slug,
            }));
    } catch (err) {
        console.error("[Contentful] generateStaticParams failed:", err);
        return [];
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    try {
        const { isEnabled } = await draftMode(); // Check draft mode in metadata
        const client = createContentfulClient({ preview: isEnabled });

        const entries = await client.getEntries<ArticleSkeleton>({
            content_type: "article",
            "fields.slug": slug,
            limit: 1,
        });
        const post = entries.items[0];
        if (!post) return { title: "Nie znaleziono artykułu (404)" };

        const title = `${post.fields.title} | Zalew Kozłowski`;
        const description = post.fields.excerpt || "";
        const coverImage = post.fields.coverImage as Asset | undefined;
        const imageUrl = coverImage?.fields?.file?.url
            ? `https:${coverImage.fields.file.url}?w=1200&h=630&fit=fill&fm=jpg&q=80`
            : undefined;

        return {
            title,
            description,
            openGraph: {
                title: post.fields.title as string,
                description,
                url: `/aktualnosci/${slug}`,
                type: "article",
                ...(post.fields.date && { publishedTime: new Date(post.fields.date as string).toISOString() }),
                ...(imageUrl && {
                    images: [{
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: post.fields.title as string,
                    }],
                }),
            },
        };
    } catch (err) {
        console.error("[Contentful] generateMetadata failed:", err);
        return { title: "Aktualności | Zalew Kozłowski" };
    }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { isEnabled } = await draftMode();
    const client = createContentfulClient({ preview: isEnabled });

    let post = null;
    try {
        const entries = await client.getEntries<ArticleSkeleton>({
            content_type: "article",
            "fields.slug": slug,
            limit: 1,
        });
        post = entries.items[0];
    } catch (err) {
        console.error("[Contentful] ArticlePage failed to fetch post:", err);
    }

    if (!post) notFound();

    const { title, date, content, coverImage, category } = post.fields;
    const assetFile = (coverImage as Asset)?.fields?.file;
    const imageUrl = assetFile?.url ? `https:${assetFile.url}` : null;

    // Rich Text Options
    const renderOptions = {
        renderMark: {
            [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold text-pine-green dark:text-white">{text}</strong>,
        },
        renderNode: {
            [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => <p className="mb-6 leading-relaxed text-earth-brown dark:text-neutral-300">{children}</p>,
            [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => <h2 className="mb-4 mt-8 text-2xl font-bold text-pine-green dark:text-white">{children}</h2>,
            [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => <h3 className="mb-3 mt-6 text-xl font-bold text-pine-green dark:text-white">{children}</h3>,
            [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => <ul className="mb-6 list-disc pl-6 text-earth-brown dark:text-neutral-300">{children}</ul>,
            [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => <ol className="mb-6 list-decimal pl-6 text-earth-brown dark:text-neutral-300">{children}</ol>,
            [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
                <blockquote
                    className="border-l-4 pl-4 italic text-pine-green dark:text-neutral-200 my-6 bg-neutral-50 dark:bg-white/5 p-4 rounded-r-lg"
                    style={{ borderColor: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                >
                    {children}
                </blockquote>
            ),
        }
    };

    return (
        <SubpageWrapper as="article" hideTopFade={true} className="pt-0 pb-36 px-0">
            {/* Hero Image */}
            <div className={`relative w-full overflow-hidden ${imageUrl ? 'h-[60vh] min-h-[500px]' : 'h-[40vh] min-h-[300px]'}`}>
                {imageUrl && (
                    <div className="absolute inset-0">
                        <ContentfulImage
                            src={imageUrl}
                            alt={title}
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-pine-green-dark via-pine-green-dark/50 to-transparent" />
                    </div>
                )}
                {!imageUrl && (
                    <div className="absolute inset-0 bg-pine-green-dark" />
                )}

                <div className="absolute inset-0 flex items-end">
                    <div className="mx-auto max-w-4xl w-full px-4 pb-16">
                        <SectionReveal>
                            <Link href="/aktualnosci" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white transition-colors">
                                <ArrowLeft className="h-4 w-4" />
                                Wróć do aktualności
                            </Link>

                            <div className="mb-4 flex items-center gap-4 text-sm font-bold">
                                <span
                                    className="uppercase tracking-wider"
                                    style={{ color: "rgb(var(--active-glow-color, 249, 115, 22))" }}
                                >
                                    {category || "Aktualności"}
                                </span>
                                <span className="h-1 w-1 rounded-full bg-white/50" />
                                <span className="flex items-center gap-2 text-white/80">
                                    <Calendar className="h-4 w-4" />
                                    {new Date(date).toLocaleDateString("pl-PL")}
                                </span>
                            </div>

                            <h1 className="mb-6 text-4xl font-black leading-tight text-white md:text-6xl drop-shadow-xl">
                                {title}
                            </h1>
                        </SectionReveal>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="mx-auto max-w-3xl px-4 py-16">
                <SectionReveal delay={0.2}>
                    <SpotlightCard className="p-8 md:p-12 rounded-2xl">
                        <div className="prose prose-lg prose-neutral dark:prose-invert mx-auto leading-loose relative z-10">
                            {documentToReactComponents(content, renderOptions)}

                            <div className="mt-16 border-t border-neutral-200 dark:border-white/10 pt-10">
                                <Link href="/" className="group flex items-center gap-3.5 w-fit">
                                    <div className="relative h-16 w-16 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
                                        <Image
                                            src="/logo-icon-v6.png"
                                            alt="Zalew Kozłowski Logo"
                                            fill
                                            className="object-contain scale-[1.45] transition-all duration-300"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div className="flex flex-col select-none text-pine-green dark:text-white transition-colors duration-300">
                                        <span className="font-display font-bold text-[13px] leading-tight tracking-wide group-hover:text-sunset-orange dark:group-hover:text-sunset-orange transition-colors duration-300">
                                            Zalew
                                        </span>
                                        <span className="font-display font-extrabold text-[16px] leading-tight tracking-tight text-sunset-orange -mt-0.5">
                                            Kozłowski
                                        </span>
                                        <span className="text-[0.7rem] uppercase tracking-wider opacity-85 font-bold mt-1.5 leading-none group-hover:text-sunset-orange dark:group-hover:text-sunset-orange transition-colors duration-300">
                                            Gospodarz Łowiska
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </SpotlightCard>
                </SectionReveal>
            </div>
        </SubpageWrapper>
    );
}
