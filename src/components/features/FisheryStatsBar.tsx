"use client";

import { useTranslations } from "next-intl";
import { 
    Map, 
    Waves, 
    Heart, 
    Tent, 
    ShieldCheck 
} from "lucide-react";
import { motion } from "framer-motion";

export const FisheryStatsBar = () => {
    const t = useTranslations("about");

    const stats = [
        {
            key: "area",
            label: t("stats_area"),
            value: t("stats_area_value"),
            icon: Map,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        },
        {
            key: "depth",
            label: t("stats_depth"),
            value: t("stats_depth_value"),
            icon: Waves,
            color: "text-blue-400 bg-blue-500/10 border-blue-500/20"
        },
        {
            key: "rules",
            label: t("stats_rules"),
            value: t("stats_rules_value"),
            icon: Heart,
            color: "text-rose-400 bg-rose-500/10 border-rose-500/20"
        },
        {
            key: "spots",
            label: t("stats_spots"),
            value: t("stats_spots_value"),
            icon: Tent,
            color: "text-amber-400 bg-amber-500/10 border-amber-500/20"
        },
        {
            key: "security",
            label: t("stats_security"),
            value: t("stats_security_value"),
            icon: ShieldCheck,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/20"
        }
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: index * 0.08,
                            ease: [0.16, 1, 0.3, 1] 
                        }}
                        whileHover={{ y: -3, scale: 1.02 }}
                        className="relative overflow-hidden rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-md p-4 flex flex-col justify-between min-h-[110px] shadow-xs group cursor-default transition-all duration-300"
                    >
                        {/* Soft Glow Hover Effect */}
                        <div className="absolute inset-0 bg-radial from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        
                        <div className="flex items-start justify-between">
                            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                                {stat.label}
                            </span>
                            <div className={`rounded-lg p-1.5 border shrink-0 ${stat.color}`}>
                                <Icon className="h-4 w-4" />
                            </div>
                        </div>

                        <div className="mt-3">
                            <span className="text-xs sm:text-sm font-black tracking-tight text-pine-green-dark dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-[linear-gradient(110deg,#ffffff,45%,#4ade80,55%,#ffffff)] dark:group-hover:bg-[linear-gradient(110deg,#ffffff,45%,#4ade80,55%,#ffffff)] bg-size-[200%_100%] group-hover:animate-shine transition-all duration-300">
                                {stat.value}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};
