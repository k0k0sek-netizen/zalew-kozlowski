"use client";

import Image, { ImageProps } from "next/image";
import contentfulLoader from "@/lib/contentful-loader";

export const ContentfulImage = (props: ImageProps) => {
    return <Image loader={contentfulLoader} {...props} />;
};
