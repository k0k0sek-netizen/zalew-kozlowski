"use client";

import { useState, useActionState } from "react";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { uploadGalleryPhoto } from "@/app/actions/upload-gallery-photo";
import { cn } from "@/lib/utils";
import { GalleryImage } from "./GalleryGrid";

interface GalleryUploadFormProps {
    onOptimisticAdd: (image: GalleryImage) => void;
}

export const GalleryUploadForm = ({ onOptimisticAdd }: GalleryUploadFormProps) => {
    const [isSuccess, setIsSuccess] = useState(false);
    const [fileName, setFileName] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [clientError, setClientError] = useState<string | null>(null);

    const [state, formAction, isPending] = useActionState(
        async (prevState: any, formData: FormData) => {
            const file = formData.get("file") as File;
            const title = formData.get("title") as string;
            const author = (formData.get("author") as string) || "Anonim";

            setClientError(null);

            // Double check file validation on submit
            if (!file || file.size === 0) {
                return { success: false, error: "Wybierz plik graficzny przed wysłaniem" };
            }

            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
            if (!allowedTypes.includes(file.type)) {
                return { success: false, error: "Dozwolone są wyłącznie pliki w formacie JPEG, PNG, WEBP oraz AVIF" };
            }

            if (file.size > 5 * 1024 * 1024) {
                return { success: false, error: "Plik jest za duży (max 5MB)" };
            }

            // Trigger optimistic UI update immediately
            try {
                const tempUrl = URL.createObjectURL(file);
                onOptimisticAdd({
                    src: tempUrl,
                    title,
                    author,
                    date: new Date().toISOString(),
                    isOptimistic: true
                });
            } catch (e) {
                console.error("Failed to create Object URL for optimistic update:", e);
            }

            const result = await uploadGalleryPhoto(formData);

            if (result.success) {
                setIsSuccess(true);
                setFileName("");
            }
            return result;
        },
        { success: false, error: undefined } as { success: boolean; error?: string; id?: string }
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Client-side validation: image type
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
            if (!allowedTypes.includes(file.type)) {
                setClientError("Dozwolone są wyłącznie pliki w formacie JPEG, PNG, WEBP oraz AVIF.");
                e.target.value = ""; // Reset
                setFileName("");
                return;
            }

            // Client-side validation: file size
            if (file.size > 5 * 1024 * 1024) {
                setClientError("Plik jest za duży. Maksymalny rozmiar to 5MB.");
                e.target.value = ""; // Reset
                setFileName("");
                return;
            }

            setFileName(file.name);
        }
    };

    // Drag and Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (!isPending) {
            setIsDragging(true);
        }
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        setClientError(null);

        if (isPending) return;

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];

            // Client-side validation: image type
            const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
            if (!allowedTypes.includes(file.type)) {
                setClientError("Dozwolone są wyłącznie pliki w formacie JPEG, PNG, WEBP oraz AVIF.");
                return;
            }

            // Client-side validation: file size
            if (file.size > 5 * 1024 * 1024) {
                setClientError("Plik jest za duży. Maksymalny rozmiar to 5MB.");
                return;
            }

            // Bind file to hidden HTML file input
            const fileInput = document.getElementById("file-upload") as HTMLInputElement;
            if (fileInput) {
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                setFileName(file.name);
            }
        }
    };

    const activeError = clientError || (state && !state.success ? state.error : null);

    if (isSuccess) {
        return (
            <div className="rounded-xl border border-pine-green/20 bg-pine-green/5 p-8 text-center animate-in fade-in zoom-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-pine-green dark:text-white">Dzięki za zdjęcie!</h3>
                <p className="text-earth-brown dark:text-gray-300">
                    Trafiło do naszej poczekalni. Pojawi się w galerii po zatwierdzeniu przez administratora.
                </p>
                <button
                    onClick={() => setIsSuccess(false)}
                    className="mt-6 text-sm font-semibold text-sunset-orange hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-sunset-orange rounded"
                >
                    Wyślij kolejne
                </button>
            </div>
        );
    }

    return (
        <form action={formAction} className="mx-auto max-w-lg rounded-xl border border-pine-green/10 bg-white/50 p-6 shadow-xl backdrop-blur-sm dark:border-white/5 dark:bg-black/20">
            <h3 className="mb-6 text-center text-xl font-bold text-pine-green-dark dark:text-white">
                Pochwal się swoim okazem! 🐟
            </h3>

            <div className="space-y-4">
                {/* File Input and visual Dropzone wrapper */}
                <div className="relative group">
                    <label htmlFor="file-upload" className="sr-only">Wybierz zdjęcie z dysku (maksymalnie 5MB)</label>
                    <input
                        type="file"
                        name="file"
                        id="file-upload"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        required
                        disabled={isPending}
                        onChange={handleFileChange}
                        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 focus-visible:outline-hidden"
                        aria-invalid={activeError ? "true" : "false"}
                        aria-describedby={activeError ? "upload-error" : undefined}
                    />
                    <div 
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={cn(
                            "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center transition-all duration-300 peer-hover:border-sunset-orange peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-sunset-orange dark:border-white/20 relative",
                            fileName ? "border-pine-green bg-pine-green/5 dark:border-emerald-500/50" : "",
                            isDragging ? "border-sunset-orange bg-sunset-orange/5 scale-[0.99] animate-pulse" : ""
                        )}
                        style={isDragging ? { 
                            borderColor: "rgb(var(--active-glow-color, 249, 115, 22))",
                            boxShadow: "0 0 15px rgba(var(--active-glow-color, 249, 115, 22), 0.2)"
                        } : undefined}
                    >
                        <Upload className={cn("mb-2 h-8 w-8 text-gray-400 dark:text-gray-500 transition-colors", (fileName || isDragging) && "text-pine-green dark:text-emerald-500")} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {fileName ? fileName : isDragging ? "Upuść zdjęcie tutaj!" : "Kliknij lub upuść zdjęcie tutaj"}
                        </span>
                        <span className="mt-1 text-xs text-gray-400">Max 5MB</span>
                    </div>
                </div>

                {/* Grid for Inputs */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor="title" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Co złowiłeś? (Tytuł)
                        </label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            placeholder="np. Karp 15kg"
                            required
                            disabled={isPending}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-sunset-orange focus:ring-sunset-orange dark:border-white/10 dark:bg-black/40 dark:text-white"
                        />
                    </div>
                    <div>
                        <label htmlFor="author" className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Twoje Imię/Ksywka
                        </label>
                        <input
                            type="text"
                            name="author"
                            id="author"
                            placeholder="np. Janek"
                            disabled={isPending}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-sunset-orange focus:ring-sunset-orange dark:border-white/10 dark:bg-black/40 dark:text-white"
                        />
                    </div>
                </div>

                {/* Status Message (client/server errors) */}
                {activeError && (
                    <div 
                        id="upload-error"
                        role="alert"
                        className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400 animate-in fade-in slide-in-from-top-1"
                    >
                        <XCircle className="h-4 w-4 shrink-0" />
                        {activeError}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-pine-green px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-pine-green-dark hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed dark:bg-emerald-700 dark:hover:bg-emerald-600 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sunset-orange"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Wysyłanie...
                        </>
                    ) : (
                        "Wyślij do Galerii"
                    )}
                </button>
            </div>
        </form>
    );
};

