"use server";

export interface WeatherData {
    temperature: number;
    windSpeed: number;
    pressure: number;
    cloudCover: number;
    rain: number;
    humidity: number;
    score: number; // 0-100
    label: string;
    isDay: boolean;
    sunrise: string;
    sunset: string;
    moonPhase: string;
}

import { unstable_cache } from "next/cache";

// Fallback cache in memory in case the service is down and cache is cold
let lastSuccessfulWeather: WeatherData | null = null;

// Simple Moon Phase Calculator (0-8 scale)
const getMoonPhase = (date: Date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    const day = date.getDate();

    if (month < 3) {
        year--;
        month += 12;
    }

    ++month;

    const c = 365.25 * year;
    const e = 30.6 * month;
    let jd = c + e + day - 694039.09; // jd is total days elapsed
    jd /= 29.5305882; // divide by the moon cycle
    let b = parseInt(jd.toString()); // int(jd) -> b
    jd -= b; // subtract integer part
    b = Math.round(jd * 8); // scale fraction from 0-8

    if (b >= 8) b = 0; // 0 and 8 are the same

    return b;
};

// Raw fetching function to be cached
async function fetchWeatherData(): Promise<WeatherData> {
    const now = new Date();
    const lat = 50.0944;
    const lon = 21.4362;
    const moonPhaseVal = getMoonPhase(now);
    const MOON_PHASES = [
        "Nów",
        "Przybywający Półksiężyc",
        "Pierwsza Kwadra",
        "Przybywający Garbaty",
        "Pełnia",
        "Ubywający Garbaty",
        "Ostatnia Kwadra",
        "Ubywający Półksiężyc"
    ];
    const moonLabel = MOON_PHASES[moonPhaseVal] || "Nów";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

    try {
        // Fetch current + daily weather from Open-Meteo with UNIX timestamps
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,is_day,cloud_cover,rain,showers&daily=sunrise,sunset&timezone=auto&timeformat=unixtime`,
            {
                signal: controller.signal,
                next: { revalidate: 900 },
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Open-Meteo API returned status ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const current = data.current;
        const daily = data.daily;

        // --- FISHING SCORE ALGORITHM (0-100) ---
        let score = 50; // Base score (Neutral)

        // 1. Pressure
        const pressure = current.surface_pressure;
        if (pressure > 1015) score += 15;
        else if (pressure > 1005) score += 5;
        else if (pressure < 1000) score -= 10;
        else if (pressure < 990) score -= 20;

        // 2. Wind (Biologically optimized for carp/amur feeding patterns)
        const wind = current.wind_speed_10m;
        if (wind >= 6 && wind <= 20) score += 20; // Moderate wind (ideal oxygenation & thermal mixing)
        else if (wind > 20 && wind <= 30) score += 10; // Umiarkowany wiatr
        else if (wind < 6) score -= 5; // Flauta (water stands, fish are highly suspicious/inactive)
        else if (wind > 30 && wind <= 45) score -= 20; // Silny wiatr
        else if (wind > 45) score -= 40; // Wichura / Sztorm

        // 3. Cloud Cover
        const clouds = current.cloud_cover;
        if (clouds > 80) score += 10;
        else if (clouds < 20) score -= 5;

        // 4. Rain
        const rain = current.rain + current.showers;
        if (rain > 0 && rain < 2) score += 10;
        if (rain >= 5) score -= 20;

        // 5. Time of Day (Solunar - timezone neutral unix calculations)
        const sunriseTime = new Date(daily.sunrise[0] * 1000);
        const sunsetTime = new Date(daily.sunset[0] * 1000);
        const isDawn = Math.abs(now.getTime() - sunriseTime.getTime()) < 3600000;
        const isDusk = Math.abs(now.getTime() - sunsetTime.getTime()) < 3600000;

        if (isDawn || isDusk) score += 15;

        // 6. Moon Phase Modifiers
        if (moonPhaseVal === 4) {
            score += 15; // Full Moon (peak feeding)
        } else if (moonPhaseVal === 0) {
            score += 15; // New Moon (peak feeding)
        } else if (moonPhaseVal === 3 || moonPhaseVal === 5) {
            score += 8;  // Gibbous phases
        } else if (moonPhaseVal === 1 || moonPhaseVal === 7) {
            score += 5;  // Crescent phases
        }

        // 7. Season Modifier
        const month = now.getMonth(); // 0-11
        if (month === 11 || month === 0 || month === 1) score -= 20; // Winter
        else if (month >= 2 && month <= 4) score += 10; // Spring
        else if (month >= 5 && month <= 7) score += 5; // Summer
        else if (month >= 8 && month <= 10) score += 15; // Autumn

        // Clamp score
        score = Math.max(1, Math.min(100, score));

        // Determine Label
        let label = "Średnia Aktywność";
        if (score >= 80) label = "🔥 REWELACYJNE BRANIA";
        else if (score >= 60) label = "Dobre Warunki";
        else if (score <= 35) label = "Słaba Aktywność";

        const result: WeatherData = {
            temperature: Math.round(current.temperature_2m),
            pressure: Math.round(current.surface_pressure),
            windSpeed: Math.round(current.wind_speed_10m),
            cloudCover: clouds,
            rain,
            humidity: current.relative_humidity_2m,
            score,
            label,
            isDay: current.is_day === 1,
            sunrise: sunriseTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
            sunset: sunsetTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
            moonPhase: moonLabel
        };

        // Cache the successful result in memory as dynamic fallback
        lastSuccessfulWeather = result;

        return result;
    } catch (err) {
        console.warn("Weather server fetch failed. Error:", err instanceof Error ? err.message : String(err));
        
        // If fetch fails but we have a successful cache in memory, return it as a backup
        if (lastSuccessfulWeather) {
            console.warn("Serving last successful weather data as fallback.");
            return lastSuccessfulWeather;
        }

        // Last resort fallback (mock data)
        return {
            temperature: 18,
            pressure: 1012,
            windSpeed: 8,
            cloudCover: 40,
            rain: 0,
            humidity: 65,
            score: 72,
            label: "Dobre Warunki",
            isDay: true,
            sunrise: "04:35",
            sunset: "21:15",
            moonPhase: moonLabel
        };
    } finally {
        clearTimeout(timeoutId);
    }
}

// Next.js dynamic edge-ready caching wrapper
export const getWeatherAction = unstable_cache(
    async () => fetchWeatherData(),
    ["weather-forecast-data"],
    {
        revalidate: 900, // Cache for 15 minutes
        tags: ["weather"]
    }
);
