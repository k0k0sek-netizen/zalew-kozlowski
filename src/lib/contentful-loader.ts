interface ContentfulLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

export default function contentfulLoader({ src, width, quality }: ContentfulLoaderProps): string {
    const normalizedSrc = src.startsWith("//") ? `https:${src}` : src;

    // Fallback if the image is not from Contentful CDN (e.g. Unsplash placeholders)
    if (!normalizedSrc.includes("ctfassets.net")) {
        return normalizedSrc;
    }

    try {
        const url = new URL(normalizedSrc);
        url.searchParams.set("w", width.toString());
        url.searchParams.set("q", (quality || 75).toString());
        url.searchParams.set("fm", "avif");
        return url.toString();
    } catch (e) {
        console.warn("Failed to parse Contentful image URL in loader:", e);
        return normalizedSrc;
    }
}
