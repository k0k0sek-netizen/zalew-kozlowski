import { SpotlightCard } from "@/components/ui/spotlight-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { CheckCircle, XCircle, Cctv } from "lucide-react";
import { Metadata } from "next";
import { contentfulClient, RegulationEntrySkeleton } from "@/lib/contentful";

export const metadata: Metadata = {
    title: "Regulamin | Zalew Kozłowski",
    description: "Zasady wędkowania No Kill, bezpieczeństwo i etykieta na łowisku. Przeczytaj regulamin przed przyjazdem.",
};

export const revalidate = 3600;

async function getRegulations() {
    const response = await contentfulClient.getEntries<RegulationEntrySkeleton>({
        content_type: "regulationEntry",
        order: ["fields.order"],
    });
    return response.items;
}

export default async function RulesPage() {
    const regulations = await getRegulations();

    // Helper to find sections by 'type' field which we saw in verification
    // Fallback to title matching if type is missing/legacy
    const generalRules = regulations.find(r => r.fields.type === "General" || r.fields.title?.toLowerCase().includes("ogólne"));
    const safetyRules = regulations.find(r => r.fields.type === "Safety" || r.fields.title?.toLowerCase().includes("bezpieczeństwo"));

    return (
        <div className="min-h-screen bg-sand-beige py-24 dark:bg-pine-green-dark">
            <div className="mx-auto max-w-4xl px-4">
                <SectionReveal>
                    <h1 className="mb-8 text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(110deg,#1a4d3a,45%,#4ade80,55%,#1a4d3a)] dark:bg-[linear-gradient(110deg,#9ca3af,45%,#ffffff,55%,#9ca3af)] bg-size-[200%_100%] animate-shine md:text-5xl">
                        Regulamin Łowiska
                    </h1>

                    <div className="space-y-8">
                        {generalRules && (
                            <SpotlightCard className="rounded-2xl p-8 shadow-sm border-2 border-transparent hover:border-pine-green/20 dark:hover:border-sunset-orange/20 transition-colors">
                                <div className="relative z-10">
                                    <h2 className="mb-4 text-2xl font-semibold text-pine-green dark:text-sunset-orange">
                                        {generalRules.fields.title}
                                    </h2>

                                    <ul className="space-y-4">
                                        {generalRules.fields.rules?.map((rule, idx) => {
                                            const isNoKill = rule.toUpperCase().includes("NO KILL");
                                            return (
                                                <li key={idx} className={`flex items-start gap-3 ${isNoKill ? 'text-lg font-bold text-sunset-orange' : 'text-pine-green-dark dark:text-neutral-200'}`}>
                                                    {isNoKill ? (
                                                        <XCircle className="mt-1 h-6 w-6 shrink-0" />
                                                    ) : (
                                                        <CheckCircle className="mt-1 h-5 w-5 text-pine-green shrink-0" />
                                                    )}
                                                    <span>{rule}</span>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </SpotlightCard>
                        )}

                        {safetyRules && (
                            <SpotlightCard className="rounded-2xl p-8 bg-white/50 dark:bg-white/5 border-2 border-red-200 dark:border-red-900/30 hover:border-red-400 dark:hover:border-red-500/50 transition-colors">
                                <div className="relative z-10">
                                    <h2 className="mb-4 text-2xl font-semibold text-red-600 dark:text-red-400">
                                        {safetyRules.fields.title}
                                    </h2>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <ul className="space-y-2 text-pine-green-dark dark:text-neutral-200">
                                            {safetyRules.fields.rules?.map((rule, idx) => {
                                                const isForbidden = rule.toUpperCase().includes("ZABRONIONE");
                                                return (
                                                    <li key={idx} className={`flex items-center gap-2 ${isForbidden ? 'font-bold text-red-600 dark:text-red-400' : ''}`}>
                                                        <XCircle className="h-4 w-4 shrink-0" />
                                                        {rule}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="flex flex-col items-center justify-center rounded-lg bg-pine-green-dark p-6 text-white relative overflow-hidden">
                                            <div className="relative z-10 flex flex-col items-center gap-2">
                                                <Cctv className="h-16 w-16 text-sunset-orange/90" />
                                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mt-2">
                                                    Monitoring 24/7
                                                </span>
                                            </div>
                                            {/* Subtle recording dot animation */}
                                            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </SpotlightCard>
                        )}

                        <div className="text-center pt-8">
                            <p className="text-sm text-neutral-500">Więcej informacji pod numerem telefonu:</p>
                            <p className="text-3xl font-bold text-pine-green dark:text-white mt-2">601 389 365</p>
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </div>
    );
}
