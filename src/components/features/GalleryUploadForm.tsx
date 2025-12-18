"use client";

import { useState } from "react";
import { Upload, Loader2, CheckCircle, XCircle } from "lucide-react";
import { uploadGalleryPhoto } from "@/app/actions/upload-gallery-photo";
import { cn } from "@/lib/utils";

export const GalleryUploadForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [fileName, setFileName] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("idle");

        const formData = new FormData(e.currentTarget);

        // Basic validation
        const file = formData.get("file") as File;
        if (file && file.size > 5 * 1024 * 1024) { // 5MB limit check client side
            alert("Plik jest za duży (max 5MB)");
            setIsLoading(false);
            return;
        }

        const result = await uploadGalleryPhoto(formData);

        if (result.success) {
            setStatus("success");
            // Reset form
            (e.target as HTMLFormElement).reset();
            setFileName("");
        } else {
            setStatus("error");
            console.error(result.error);
        }

        setIsLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    if (status === "success") {
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
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-sm font-semibold text-sunset-orange hover:underline"
                >
                    Wyślij kolejne
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg rounded-xl border border-pine-green/10 bg-white/50 p-6 shadow-xl backdrop-blur-sm dark:border-white/5 dark:bg-black/20">
            <h3 className="mb-6 text-center text-xl font-bold text-pine-green-dark dark:text-white">
                Pochwal się swoim okazem! 🐟
            </h3>

            <div className="space-y-4">
                {/* File Input */}
                <div className="relative group">
                    <input
                        type="file"
                        name="file"
                        id="file-upload"
                        accept="image/*"
                        required
                        onChange={handleFileChange}
                        className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                    />
                    <div className={cn(
                        "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 text-center transition-colors peer-hover:border-sunset-orange peer-focus:border-sunset-orange dark:border-white/20",
                        fileName ? "border-pine-green bg-pine-green/5 dark:border-emerald-500/50" : ""
                    )}>
                        <Upload className={cn("mb-2 h-8 w-8 text-gray-400 dark:text-gray-500", fileName && "text-pine-green dark:text-emerald-500")} />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            {fileName || "Kliknij lub upuść zdjęcie tutaj"}
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
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-sunset-orange focus:ring-sunset-orange dark:border-white/10 dark:bg-black/40 dark:text-white"
                        />
                    </div>
                </div>

                {/* Status Message */}
                {status === "error" && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                        <XCircle className="h-4 w-4" />
                        Coś poszło nie tak. Spróbuj ponownie.
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-pine-green px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-pine-green-dark hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed dark:bg-emerald-700 dark:hover:bg-emerald-600"
                >
                    {isLoading ? (
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
