"use server";

import { createClient } from "contentful-management";
import { z } from "zod";

// Zod schema for input validation
const UploadSchema = z.object({
    file: z.instanceof(File, { message: "Plik jest wymagany" })
        .refine((file) => file.size > 0, "Plik nie może być pusty")
        .refine((file) => file.type.startsWith("image/"), "Dozwolone są tylko pliki graficzne"),
    title: z.string().min(3, "Tytuł musi mieć min. 3 znaki").max(100, "Tytuł zbyt długi"),
    author: z.string().optional().default("Anonim"),
});

export async function uploadGalleryPhoto(formData: FormData) {
    // 1. Validate Input (Runtime Type Safety)
    const result = UploadSchema.safeParse({
        file: formData.get("file"),
        title: formData.get("title"),
        author: formData.get("author"),
    });

    if (!result.success) {
        const errorMessage = result.error.issues.map(e => e.message).join(", ");
        return { success: false, error: errorMessage };
    }

    const { file, title, author } = result.data;

    // 2. Validate Server Configuration
    if (!process.env.CONTENTFUL_MANAGEMENT_TOKEN) {
        return { success: false, error: "Konfiguracja serwera: brak tokenu zarządzania" };
    }

    try {
        const client = createClient({
            accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN,
        });

        const space = await client.getSpace(process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID!);
        const environment = await space.getEnvironment("master");

        const locales = await environment.getLocales();
        const defaultLocale = locales.items.find((locale) => locale.default)?.code || "en-US";

        // 3. Upload File
        const arrayBuffer = await file.arrayBuffer();
        const upload = await environment.createUpload({
            file: arrayBuffer,
        });

        // 4. Create Asset
        const asset = await environment.createAsset({
            fields: {
                title: { [defaultLocale]: title },
                file: {
                    [defaultLocale]: {
                        fileName: file.name,
                        contentType: file.type,
                        uploadFrom: {
                            sys: {
                                type: "Link",
                                linkType: "Upload",
                                id: upload.sys.id,
                            },
                        },
                    },
                },
            },
        });

        // 5. Process & Publish Asset
        const processedAsset = await asset.processForAllLocales();
        await processedAsset.publish();

        // 6. Create Entry
        const entry = await environment.createEntry("galleryPhoto", {
            fields: {
                title: { [defaultLocale]: title },
                photo: {
                    [defaultLocale]: {
                        sys: {
                            type: "Link",
                            linkType: "Asset",
                            id: processedAsset.sys.id,
                        },
                    },
                },
                author: { [defaultLocale]: author },
                date: { [defaultLocale]: new Date().toISOString() }
            },
        });

        // 7. Send Notification via Formspree (Simple POST)
        if (process.env.FORMSPREE_FORM_ID) {
            try {
                await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        subject: `🐟 Nowe zdjęcie: ${title}`,
                        message: `Ktoś wgrał nowe zdjęcie do galerii.\nTytuł: ${title}\nAutor: ${author}\n\nWejdź do Contentfula aby zatwierdzić.`,
                        title: title,
                        author: author,
                        _replyto: "no-reply@zalew-kozlowski.pl"
                    })
                });
            } catch (formError) {
                console.error("Failed to send Formspree notification:", formError);
                // Don't fail the upload just because notification failed
            }
        }

        return { success: true, id: entry.sys.id };

    } catch (error: any) {
        console.error("Contentful Upload Error:", error);
        return {
            success: false,
            error: `Błąd Contentful: ${error.message || JSON.stringify(error)}`
        };
    }
}
