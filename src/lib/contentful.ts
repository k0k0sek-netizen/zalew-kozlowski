import { createClient, EntryFieldTypes } from "contentful";

export const contentfulClient = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "",
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || "",
});

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
