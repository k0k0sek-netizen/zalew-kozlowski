import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { contentfulClient, ArticleSkeleton } from "@/lib/contentful";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const slug = searchParams.get("slug");
    const path = searchParams.get("path");

    // 1. Check for secret matching REPO_SECRET or similar logic
    // For Contentful, usually we check if the secret matches what we configured in Contentful Preview URL
    if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
        return new Response("Invalid token", { status: 401 });
    }

    (await draftMode()).enable();

    // 2. Redirect logic
    // If 'path' is provided, it takes precedence for direct redirection.
    // Otherwise, 'slug' is used for article pages, or root if neither is present.
    if (path) {
        redirect(path);
    }

    if (slug) {
        redirect(`/aktualnosci/${slug}`);
    }

    redirect("/");
}
