"use server";

import { createClient } from "contentful-management";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing_key");

// Zod schema for input validation
const UploadSchema = z.object({
    file: z.instanceof(File, { message: "Plik jest wymagany" })
        .refine((file) => file.size > 0, "Plik nie może być pusty")
        .refine((file) => file.size <= 5 * 1024 * 1024, "Plik jest za duży (maksymalnie 5MB)")
        .refine(
            (file) => ["image/jpeg", "image/png", "image/webp", "image/avif"].includes(file.type),
            "Dozwolone są wyłącznie pliki w formacie JPEG, PNG, WEBP oraz AVIF"
        ),
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

        // 7. Send Notification via Resend
        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: "Zalew Kozłowski CMS <onboarding@resend.dev>",
                    to: ["lowiskokozlow@gmail.com"],
                    subject: `🐟 Nowe zdjęcie czeka na zatwierdzenie: ${title}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                            <div style="background-color: #f97316; padding: 20px; text-align: center;">
                                <h2 style="color: white; margin: 0;">Powiadomienie z Zalewu Kozłowskiego</h2>
                            </div>
                            <div style="padding: 20px;">
                                <p style="font-size: 16px; color: #333;">Ktoś właśnie wysłał nowe zdjęcie do galerii przez stronę internetową!</p>
                                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                                <ul style="color: #555; font-size: 14px; line-height: 1.6;">
                                    <li><strong>Tytuł zdjęcia:</strong> ${title}</li>
                                    <li><strong>Autor (podpis):</strong> ${author}</li>
                                    <li><strong>ID wpisu w CMS:</strong> ${entry.sys.id}</li>
                                </ul>
                                <p style="font-size: 14px; color: #555; margin-top: 20px;">
                                    Zaloguj się do panelu Contentful. Zdjęcie ma status "Draft". Zobacz je i kliknij <strong>Publish</strong>, aby pojawiło się na stronie głównej.
                                </p>
                            </div>
                        </div>
                    `
                });
            } catch (emailError) {
                console.error("Failed to send Resend notification:", emailError);
                // Don't fail the upload just because notification failed
            }
        }

        revalidatePath("/galeria");
        return { success: true, id: entry.sys.id };

    } catch (error: any) {
        console.error("Contentful Upload Error:", error);
        return {
            success: false,
            error: `Błąd Contentful: ${error.message || JSON.stringify(error)}`
        };
    }
}
