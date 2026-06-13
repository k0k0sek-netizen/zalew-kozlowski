interface ContentfulLoaderProps {
    src: string;
    width: number;
    quality?: number;
}

export default function contentfulLoader({ src, width, quality }: ContentfulLoaderProps): string {
    const normalizedSrc = src.startsWith("//") ? `https:${src}` : src;

    // Local image optimization via Next.js built-in image optimizer
    if (normalizedSrc.startsWith("/") && !normalizedSrc.startsWith("//")) {
        return `/_next/image?url=${encodeURIComponent(normalizedSrc)}&w=${width}&q=${quality || 75}`;
    }

    // Unsplash optimization
    if (normalizedSrc.includes("images.unsplash.com")) {
        try {
            const url = new URL(normalizedSrc);
            url.searchParams.set("w", width.toString());
            url.searchParams.set("q", (quality || 75).toString());
            if (!url.searchParams.has("auto") && !url.searchParams.has("fm")) {
                url.searchParams.set("auto", "format");
            }
            return url.toString();
        } catch (e) {
            console.warn("Failed to parse Unsplash image URL in loader:", e);
            return normalizedSrc;
        }
    }

    // Fallback if the image is not from Contentful CDN
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
