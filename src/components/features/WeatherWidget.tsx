"use client";

import { CloudSun, Wind, Moon, Sun, CloudRain, Cloud, Fish } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeatherData } from "@/app/actions/weather";
import { getTailwindThemeForScore } from "@/lib/bite-index-theme";

interface WeatherWidgetProps {
    className?: string;
    initialWeather: WeatherData;
}

export const WeatherWidget = ({ className, initialWeather }: WeatherWidgetProps) => {
    const weather = initialWeather;

    if (!weather) return null;

    // Helper to pick main icon and its color
    const getIconTheme = () => {
        if (weather.rain > 0) return { Icon: CloudRain, color: "text-blue-500 dark:text-blue-400" };
        if (weather.cloudCover > 80) return { Icon: Cloud, color: "text-gray-500 dark:text-gray-400" };
        if (weather.cloudCover < 20) return { Icon: Sun, color: "text-amber-500" };
        return { Icon: CloudSun, color: "text-orange-500" };
    };

    const { Icon: StatusIcon, color: iconColor } = getIconTheme();

    // Helper for Bite Index (Indeks Brań) dot color
    const biteTheme = getTailwindThemeForScore(weather.score);

    return (
        <div className={cn(
            "group flex items-center gap-3 rounded-full px-4 py-2 text-[13px] font-bold backdrop-blur-md border shadow-sm transition-all duration-500 cursor-default hover:shadow-md",
            className
        )}>
            
            {/* Weather */}
            <div className="flex items-center gap-1.5" title={`Zachmurzenie: ${weather.cloudCover}%`}>
                <StatusIcon className={cn("h-4 w-4 transition-transform duration-500 group-hover:scale-110", iconColor)} />
                <span className="tabular-nums">{weather.temperature}°C</span>
            </div>

            <div className="h-3 w-px bg-current opacity-20 transition-opacity" />

            {/* Wind */}
            <div className="flex items-center gap-1.5" title={`Wiatr: ${weather.windSpeed} km/h`}>
                <Wind className="h-4 w-4 text-neutral-500 dark:text-neutral-400 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                <span className="tabular-nums">{weather.windSpeed} km/h</span>
            </div>

            <div className="h-3 w-px bg-current opacity-20 transition-opacity group-hover:opacity-40" />

            {/* Bite Index Indicator - Expanding (Dynamic Island style) */}
            <div className="flex items-center gap-1">
                <div className="relative flex h-2 w-2 shrink-0" title="Indeks Brań">
                    <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", biteTheme.bg)}></span>
                    <span className={cn("relative inline-flex h-2 w-2 rounded-full shadow-sm", biteTheme.bg)}></span>
                </div>
                
                {/* Text that expands horizontally on hover */}
                <div className="max-w-0 group-hover:max-w-[150px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
                    <span className={cn("pl-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 flex items-center gap-1.5", biteTheme.text)}>
                        <Fish className="h-3.5 w-3.5 opacity-80" /> Brania: {weather.label}
                    </span>
                </div>
            </div>
        </div>
    );
};
