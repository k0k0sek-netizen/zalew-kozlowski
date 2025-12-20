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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { isEnabled } = await draftMode(); // Check draft mode in metadata
    const client = createContentfulClient({ preview: isEnabled });

    const entries = await client.getEntries<ArticleSkeleton>({
        content_type: "article",
        "fields.slug": slug,
        limit: 1,
    });
    const post = entries.items[0];
    if (!post) return { title: "Nie znaleziono artykułu (404)" };
    return {
        title: `${post.fields.title} | Zalew Kozłowski`,
        description: post.fields.excerpt,
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { isEnabled } = await draftMode();
    const client = createContentfulClient({ preview: isEnabled });

    // Fetch
    const entries = await client.getEntries<ArticleSkeleton>({
        content_type: "article",
        "fields.slug": slug,
        limit: 1,
    });

    const post = entries.items[0];

    // DEBUG MODE: Show error instead of 404 if in draft mode
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
                <blockquote className="border-l-4 border-sunset-orange pl-4 italic text-pine-green dark:text-neutral-200 my-6 bg-neutral-50 dark:bg-white/5 p-4 rounded-r-lg">
                    {children}
                </blockquote>
            ),
        }
    };

    return (
        <article className="min-h-screen bg-sand-beige dark:bg-pine-green-dark">
            {/* Hero Image */}
            <div className={`relative w-full overflow-hidden ${imageUrl ? 'h-[60vh] min-h-[500px]' : 'h-[40vh] min-h-[300px]'}`}>
                {imageUrl && (
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${imageUrl}')` }}
                    >
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

                            <div className="mb-4 flex items-center gap-4 text-sm font-bold text-sunset-orange">
                                <span className="uppercase tracking-wider">{category || "Aktualności"}</span>
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
            <div className="mx-auto max-w-2xl px-4 py-16">
                <SectionReveal delay={0.2}>
                    <div className="prose prose-lg prose-neutral dark:prose-invert mx-auto leading-loose">
                        {documentToReactComponents(content, renderOptions)}

                        <div className="mt-16 flex items-center gap-5 border-t border-neutral-200 dark:border-white/10 pt-10">
                            <div className="h-16 w-16 rounded-full bg-white p-1 flex items-center justify-center shadow-xl shadow-black/5 transform hover:scale-110 transition-transform overflow-hidden relative">
                                <Image
                                    src="/logo-brand.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain p-2"
                                />
                            </div>
                            <div>
                                <p className="font-bold text-xl leading-tight text-pine-green dark:text-white">Gospodarz Łowiska</p>
                                <p className="text-base text-neutral-500 dark:text-neutral-400">Zalew Kozłowski</p>
                            </div>
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </article>
    );
}
