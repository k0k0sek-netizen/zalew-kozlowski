import { MetadataRoute } from "next";
import { contentfulClient, ArticleSkeleton } from "@/lib/contentful";

const BASE_URL = "https://zalew-kozlowski.pl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/o-lowisku`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/cennik`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/regulamin`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/galeria`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/aktualnosci`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/kontakt`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ];

    // 2. Dynamic Routes (Articles from Contentful)
    let articleRoutes: MetadataRoute.Sitemap = [];

    try {
        const response = await contentfulClient.getEntries<ArticleSkeleton>({
            content_type: "article",
            // Limit to last 1000 for sitemap performance if needed, or fetch all with pagination loop in future
            limit: 100,
        });

        articleRoutes = response.items.map((item) => ({
            url: `${BASE_URL}/aktualnosci/${item.fields.slug}`,
            lastModified: new Date(item.sys.updatedAt),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));
    } catch (error) {
        console.error("Failed to fetch articles for sitemap:", error);
    }

    return [...staticRoutes, ...articleRoutes];
}
