import { createClient, EntryFieldTypes } from "contentful";

// Factory function to create a client (Standard or Preview)
export const createContentfulClient = ({ preview }: { preview?: boolean } = {}): ReturnType<typeof createClient> => {
    const accessToken = preview
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

    const host = preview ? "preview.contentful.com" : "cdn.contentful.com";

    if (!accessToken) {
        console.warn(
            `[Contentful] Warning: Missing access token for ${preview ? "Preview" : "Delivery"} API. Check .env.local`
        );
        // Return a dummy client that throws when query methods are called
        return {
            getEntries: async () => {
                throw new Error("Contentful client not initialized: missing access token");
            },
            getEntry: async () => {
                throw new Error("Contentful client not initialized: missing access token");
            }
        } as any as ReturnType<typeof createClient>;
    }

    const rawClient = createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
        accessToken,
        host,
    });

    // Wrap getEntries and getEntry to handle unknown locale errors and retry with default locale
    const client = {
        ...rawClient,
        getEntries: async (query: any) => {
            try {
                return await rawClient.getEntries(query);
            } catch (err: any) {
                if (err && err.message && err.message.includes("Unknown locale")) {
                    const { locale, ...restQuery } = query;
                    return await rawClient.getEntries(restQuery);
                }
                throw err;
            }
        },
        getEntry: async (id: string, query?: any) => {
            try {
                return await rawClient.getEntry(id, query);
            } catch (err: any) {
                if (err && err.message && err.message.includes("Unknown locale")) {
                    const { locale, ...restQuery } = query || {};
                    return await rawClient.getEntry(id, restQuery);
                }
                throw err;
            }
        }
    } as any as ReturnType<typeof createClient>;

    return client;
};

// Default client for backward compatibility (Public API)
export const contentfulClient = createContentfulClient({ preview: false });

export type GalleryPhotoSkeleton = {
    contentTypeId: "galleryPhoto";
    fields: {
        title: EntryFieldTypes.Text;
        photo: EntryFieldTypes.AssetLink;
        author: EntryFieldTypes.Text;
        date: EntryFieldTypes.Date;
    };
};

export type ArticleSkeleton = {
    contentTypeId: "article";
    fields: {
        title: EntryFieldTypes.Text;
        slug: EntryFieldTypes.Text;
        excerpt: EntryFieldTypes.Text;
        content: EntryFieldTypes.RichText;
        coverImage: EntryFieldTypes.AssetLink;
        date: EntryFieldTypes.Date;
        category: EntryFieldTypes.Text;
    };
};

export interface PriceItemSkeleton {
    contentTypeId: "priceItem";
    fields: {
        title: EntryFieldTypes.Symbol;
        titleEn?: EntryFieldTypes.Symbol;
        description: EntryFieldTypes.Text;
        descriptionEn?: EntryFieldTypes.Symbol;
        price: EntryFieldTypes.Symbol;
        category: EntryFieldTypes.Symbol;
        details: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        detailsEn?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        order: EntryFieldTypes.Integer;
        price1Rod?: EntryFieldTypes.Integer;
        price2Rods?: EntryFieldTypes.Integer;
        priceSpinning?: EntryFieldTypes.Integer;
    };
}

export type RegulationEntrySkeleton = {
    contentTypeId: "regulationEntry";
    fields: {
        title: EntryFieldTypes.Text;
        titleEn?: EntryFieldTypes.Symbol;
        type: EntryFieldTypes.Text; // "General" or "Safety"
        rules: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        rulesEn?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        order?: EntryFieldTypes.Integer;
    };
};

export type InfoBlockSkeleton = {
    contentTypeId: "infoBlock";
    fields: {
        id: EntryFieldTypes.Text; // e.g., 'hours', 'no-kill'
        title: EntryFieldTypes.Text;
        titleEn?: EntryFieldTypes.Symbol;
        value: EntryFieldTypes.Text;
        valueEn?: EntryFieldTypes.Text;
        subtitle?: EntryFieldTypes.Text;
        subtitleEn?: EntryFieldTypes.Symbol;
    };
};

export type FishSpeciesSkeleton = {
    contentTypeId: "fishSpecies";
    fields: {
        name: EntryFieldTypes.Text;
        nameEn?: EntryFieldTypes.Symbol;
        description: EntryFieldTypes.Text;
        descriptionEn?: EntryFieldTypes.Text;
        image: EntryFieldTypes.AssetLink;
        stats: EntryFieldTypes.Object; // JSON object: { strength, difficulty, activity }
        tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        tagsEn?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    };
};

export async function getInfoBlocks(preview = false, locale = "pl") {
    try {
        const client = createContentfulClient({ preview });
        const response = await client.getEntries<InfoBlockSkeleton>({
            content_type: "infoBlock",
            locale: locale === "en" ? "en-US" : "pl",
        });
        return response.items;
    } catch (err) {
        console.error("[Contentful] Failed to getInfoBlocks:", err);
        return [];
    }
}
