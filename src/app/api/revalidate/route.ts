import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * Contentful Webhook — revalidation endpoint.
 *
 * Accepts the secret via:
 *   1. Query param: ?secret=<value>
 *   2. Custom header: x-contentful-webhook-secret
 *
 * Usage in Contentful:
 *   URL:  https://your-domain.pl/api/revalidate?secret=<CONTENTFUL_REVALIDATE_SECRET>
 *   Method: POST
 */
export async function POST(request: NextRequest) {
    const expectedSecret = process.env.CONTENTFUL_REVALIDATE_SECRET;

    // Accept secret from query param OR custom header
    const secret =
        request.nextUrl.searchParams.get("secret") ||
        request.headers.get("x-contentful-webhook-secret");

    if (!expectedSecret || secret !== expectedSecret) {
        console.warn("[Revalidate] ❌ Invalid or missing secret");
        return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    try {
        // Try to extract content type from Contentful webhook payload
        let contentType = "unknown";
        try {
            const body = await request.json();
            contentType =
                body?.sys?.contentType?.sys?.id || body?.sys?.type || "unknown";
        } catch {
            // Body might be empty or not JSON — that's fine
        }

        // Revalidate the entire website (layout scope covers all pages)
        revalidatePath("/", "layout");

        console.log(
            `[Revalidate] ✅ Site revalidated | content-type: ${contentType} | ${new Date().toISOString()}`
        );

        return NextResponse.json({
            revalidated: true,
            contentType,
            now: Date.now(),
        });
    } catch (err) {
        console.error("[Revalidate] ❌ Error:", err);
        return NextResponse.json(
            { message: "Error revalidating" },
            { status: 500 }
        );
    }
}
