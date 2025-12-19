import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { contentfulClient, ArticleSkeleton } from "@/lib/contentful";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const slug = searchParams.get("slug");

    // 1. Check for secret matching REPO_SECRET or similar logic
    // For Contentful, usually we check if the secret matches what we configured in Contentful Preview URL
    if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
        return new Response("Invalid token", { status: 401 });
    }

    // 2. Resolve the slug (optional, verifies existence)
    // If slug is provided, we can fetch to verify it exists, but usually we just redirect.
    // However, if we want to redirect to a specific page:

    (await draftMode()).enable();

    // 3. Redirect to the path
    // If slug is provided, assume it's an article. If not, maybe homepage.
    // Contentful Preview URL usually is: https://site.com/api/draft?secret=XXX&slug={entry.fields.slug}

    if (!slug) {
        redirect("/");
    }

    // Redirect to the article or page
    redirect(`/aktualnosci/${slug}`);
}
