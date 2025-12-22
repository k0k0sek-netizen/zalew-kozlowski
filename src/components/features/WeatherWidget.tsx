"use client";

import { CloudSun, Wind, Loader2, Moon, Sun, CloudRain, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWeather } from "@/hooks/useWeather";

export const WeatherWidget = ({ className }: { className?: string }) => {
    const { weather, loading } = useWeather();

    if (!weather && !loading) return null;

    // Helper to pick main icon
    const StatusIcon = (() => {
        if (!weather) return CloudSun;
        if (weather.rain > 0) return CloudRain;
        if (weather.cloudCover > 80) return Cloud;
        if (weather.cloudCover < 20) return Sun;
        return CloudSun;
    })();

    return (
        <div className={cn(
            "flex items-center gap-4 rounded-full bg-white/50 px-4 py-1.5 text-xs font-medium text-pine-green backdrop-blur-sm dark:bg-white/10 dark:text-white/90 border border-pine-green/10 dark:border-white/10 min-w-[200px] justify-center transition-all duration-300",
            className
        )}>
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin opacity-50" />
            ) : weather ? (
                <>
                    <div className="flex items-center gap-1.5" title={`Zachmurzenie: ${weather.cloudCover}%`}>
                        <StatusIcon className="h-4 w-4 text-sunset-orange" />
                        <span>{weather.temperature}°C</span>
                    </div>

                    <div className="h-3 w-px bg-current opacity-20" />

                    <div className="flex items-center gap-1.5" title={`Wiatr: ${weather.windSpeed} km/h`}>
                        <Wind className="h-3.5 w-3.5" />
                        <span>{weather.windSpeed} km/h</span>
                    </div>
                </>
            ) : null}
        </div>
    );
};
