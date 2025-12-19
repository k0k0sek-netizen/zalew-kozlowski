import { createClient, EntryFieldTypes } from "contentful";

// Factory function to create a client (Standard or Preview)
export const createContentfulClient = ({ preview }: { preview?: boolean } = {}) => {
    const accessToken = preview
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        : process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

    const host = preview ? "preview.contentful.com" : "cdn.contentful.com";

    if (!accessToken) {
        throw new Error(
            `Missing access token for ${preview ? "Preview" : "Delivery"} API. Check .env.local`
        );
    }

    return createClient({
        space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
        accessToken,
        host,
    });
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

export type PriceItemSkeleton = {
    contentTypeId: "priceItem";
    fields: {
        title: EntryFieldTypes.Text;
        price: EntryFieldTypes.Text;
        description?: EntryFieldTypes.Text;
        details: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        category: EntryFieldTypes.Text;
        order?: EntryFieldTypes.Integer;
    };
};

export type RegulationEntrySkeleton = {
    contentTypeId: "regulationEntry";
    fields: {
        title: EntryFieldTypes.Text;
        type: EntryFieldTypes.Text; // "General" or "Safety"
        rules: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
        order?: EntryFieldTypes.Integer;
    };
};

export type InfoBlockSkeleton = {
    contentTypeId: "infoBlock";
    fields: {
        id: EntryFieldTypes.Text; // e.g., 'hours', 'no-kill'
        title: EntryFieldTypes.Text;
        value: EntryFieldTypes.Text;
        subtitle?: EntryFieldTypes.Text;
    };
};

export type FishSpeciesSkeleton = {
    contentTypeId: "fishSpecies";
    fields: {
        name: EntryFieldTypes.Text;
        description: EntryFieldTypes.Text;
        image: EntryFieldTypes.AssetLink;
        stats: EntryFieldTypes.Object; // JSON object: { strength, difficulty, activity }
        tags: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    };
};
