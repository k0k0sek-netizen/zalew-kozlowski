import { NextResponse } from "next/server";
import { createContentfulClient, ArticleSkeleton } from "@/lib/contentful";

export async function GET() {
    const previewToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
    const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;

    // Status Report
    const status = {
        env: {
            hasSpaceId: !!spaceId,
            hasPreviewToken: !!previewToken,
            previewTokenLength: previewToken?.length || 0,
        },
        connection: "pending",
        error: null as any,
    };

    if (!previewToken) {
        status.connection = "failed";
        status.error = "Missing CONTENTFUL_PREVIEW_ACCESS_TOKEN";
        return NextResponse.json(status);
    }

    try {
        const client = createContentfulClient({ preview: true });
        const entries = await client.getEntries<ArticleSkeleton>({
            content_type: "article",
            limit: 1,
        });
        status.connection = "success";
        // @ts-ignore
        status.sampleEntry = entries.items[0]?.fields?.title || "No entries found";
    } catch (err: any) {
        status.connection = "failed";
        status.error = err.message;
        console.error("Test Connection Error:", err);
    }

    return NextResponse.json(status);
}
