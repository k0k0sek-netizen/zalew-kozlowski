import { draftMode } from "next/headers";
import Link from "next/link";

export default async function DraftModeBanner() {
    const { isEnabled } = await draftMode();

    if (!isEnabled) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-100 flex items-center gap-4 rounded-lg bg-orange-600 px-4 py-3 text-white shadow-xl shadow-black/20 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col">
                <span className="text-sm font-bold">Tryb Podglądu (Draft)</span>
                <span className="text-xs opacity-80">Widzisz nieopublikowane zmiany</span>
            </div>
            <Link
                href="/api/disable-draft"
                prefetch={false}
                className="rounded bg-white/20 px-3 py-1.5 text-xs font-bold hover:bg-white/30 transition-colors"
            >
                Wyłącz
            </Link>
        </div>
    );
}
