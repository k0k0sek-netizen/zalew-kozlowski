"use server";

export interface WeatherData {
    temperature: number;
    windSpeed: number;
    pressure: number;
    cloudCover: number;
    rain: number;
    humidity: number;
    score: number; // General score
    label: string;  // General label
    isDay: boolean;
    sunrise: string;
    sunset: string;
    moonPhase: string;
    carpScore: number;
    carpLabel: string;
    predatorScore: number;
    predatorLabel: string;
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

async function fetchWeatherData(): Promise<WeatherData> {
    const lat = 50.0511; // Kozłów coords
    const lon = 21.4111;
    const now = new Date();
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
        // Fetch current + hourly + daily weather from Open-Meteo with UNIX timestamps & 1 past day
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,is_day,cloud_cover,rain,showers&hourly=pressure_msl&daily=sunrise,sunset&timezone=auto&timeformat=unixtime&past_days=1`,
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
        const hourly = data.hourly;

        const currentPressure = current.pressure_msl;
        const currentTime = current.time;

        // Calculate 3-hour pressure trend (deltaPressure)
        let deltaPressure = 0;
        if (hourly && hourly.time && hourly.pressure_msl) {
            let nearestIdx = 0;
            let minDiff = Infinity;
            for (let i = 0; i < hourly.time.length; i++) {
                const diff = Math.abs(hourly.time[i] - currentTime);
                if (diff < minDiff) {
                    minDiff = diff;
                    nearestIdx = i;
                }
            }
            const pastIdx = nearestIdx - 3;
            if (pastIdx >= 0) {
                deltaPressure = currentPressure - hourly.pressure_msl[pastIdx];
            }
        }

        const temp = current.temperature_2m;
        const wind = current.wind_speed_10m;
        const clouds = current.cloud_cover;
        const rain = current.rain + current.showers;
        const humidity = current.relative_humidity_2m;

        // Dawn and Dusk Calculations
        const sunriseTime = new Date(daily.sunrise[0] * 1000);
        const sunsetTime = new Date(daily.sunset[0] * 1000);
        const isDawn = Math.abs(now.getTime() - sunriseTime.getTime()) < 3600000;
        const isDusk = Math.abs(now.getTime() - sunsetTime.getTime()) < 3600000;
        const solunarBonus = (isDawn || isDusk) ? 15 : 0;

        // Moon Phase Bonus
        let moonBonus = 0;
        if (moonPhaseVal === 4 || moonPhaseVal === 0) {
            moonBonus = 15; // Full/New Moon
        } else if (moonPhaseVal === 3 || moonPhaseVal === 5) {
            moonBonus = 8;  // Gibbous
        } else if (moonPhaseVal === 1 || moonPhaseVal === 7) {
            moonBonus = 5;  // Crescent
        }

        // Season Calculations
        const month = now.getMonth(); // 0-11
        let carpSeasonBonus = 0;
        let predatorSeasonBonus = 0;

        if (month === 11 || month === 0 || month === 1) { // Winter
            carpSeasonBonus = -25;
            predatorSeasonBonus = 5;
        } else if (month >= 2 && month <= 4) { // Spring
            carpSeasonBonus = 10;
            predatorSeasonBonus = 15;
        } else if (month >= 5 && month <= 7) { // Summer
            carpSeasonBonus = 15;
            predatorSeasonBonus = -15;
        } else if (month >= 8 && month <= 10) { // Autumn
            carpSeasonBonus = 5;
            predatorSeasonBonus = 20;
        }

        // --- 1. CARP / AMUR INDEX ALGORITHM ---
        let carpScore = 50; // Base

        // Temperature optimum: 18°C - 24°C
        if (temp >= 18 && temp <= 24) carpScore += 20;
        else if ((temp >= 14 && temp < 18) || (temp > 24 && temp <= 28)) carpScore += 10;
        else if (temp >= 8 && temp < 14) carpScore -= 10;
        else if (temp < 8) carpScore -= 25;
        else if (temp > 28) carpScore -= 20;

        // Wind speed: optimum 6 - 18 km/h
        if (wind >= 6 && wind <= 18) carpScore += 20;
        else if (wind > 18 && wind <= 28) carpScore += 10;
        else if (wind < 6) carpScore -= 10; // Calm/flat water is bad
        else if (wind > 28) carpScore -= 20;

        // Pressure absolute and trend
        if (deltaPressure >= -2 && deltaPressure <= -0.5) carpScore += 15; // Slowly falling (ideal)
        else if (Math.abs(deltaPressure) < 0.5) carpScore += 5; // Stable
        else if (deltaPressure > 0.5 && deltaPressure <= 2) carpScore -= 5; // Rising
        else if (deltaPressure < -2) carpScore -= 15; // Rapid drop (stormy)
        else if (deltaPressure > 2) carpScore -= 15; // Rapid rise

        if (currentPressure > 1020) carpScore -= 10; // Very high pressure
        else if (currentPressure < 995) carpScore -= 15; // Very low pressure

        // Humidity
        if (humidity > 80) carpScore += 10;

        // Clouds & rain
        if (clouds > 60) carpScore += 8;
        if (rain > 0 && rain < 2) carpScore += 10;
        else if (rain >= 5) carpScore -= 20;

        carpScore += solunarBonus + moonBonus + carpSeasonBonus;
        carpScore = Math.max(1, Math.min(100, carpScore));

        // --- 2. PREDATOR (PIKE) INDEX ALGORITHM ---
        let predatorScore = 50;

        // Temperature optimum: 11°C - 17°C
        if (temp >= 11 && temp <= 17) predatorScore += 20;
        else if ((temp >= 7 && temp < 11) || (temp > 17 && temp <= 21)) predatorScore += 10;
        else if (temp >= 21 && temp <= 25) predatorScore -= 10;
        else if (temp > 25) predatorScore -= 25;
        else if (temp < 7) predatorScore -= 15;

        // Wind: medium-strong ("pike chop" wave action)
        if (wind >= 12 && wind <= 25) predatorScore += 20;
        else if (wind > 25 && wind <= 35) predatorScore += 10;
        else if (wind < 8) predatorScore -= 10;
        else if (wind > 35) predatorScore -= 20;

        // Pressure absolute and trend
        if (deltaPressure < -0.5) predatorScore += 15; // Falling pressure triggers feeding
        else if (Math.abs(deltaPressure) <= 0.5) predatorScore += 5;
        else if (deltaPressure > 0.5) predatorScore -= 10;

        if (currentPressure < 1000) predatorScore += 10; // Low pressure overcast
        else if (currentPressure > 1020) predatorScore -= 15; // Clear sky high pressure

        // Clouds & rain: Pike love cloudy days (ambush hunting)
        if (clouds > 70) predatorScore += 20;
        else if (clouds < 30) predatorScore -= 10;

        if (rain > 0 && rain < 3) predatorScore += 10;
        else if (rain >= 5) predatorScore -= 15;

        predatorScore += solunarBonus + (moonBonus * 0.8) + predatorSeasonBonus;
        predatorScore = Math.max(1, Math.min(100, predatorScore));

        // --- 3. GENERAL SCORE ---
        const score = Math.round((carpScore + predatorScore) / 2);

        // Helper to map scores to Polish label strings matching translations
        const getLabel = (s: number) => {
            if (s >= 80) return "🔥 REWELACYJNE BRANIA";
            if (s >= 60) return "Dobre Warunki";
            if (s <= 35) return "Słaba Aktywność";
            return "Średnia Aktywność";
        };

        const result: WeatherData = {
            temperature: Math.round(temp),
            pressure: Math.round(currentPressure),
            windSpeed: Math.round(wind),
            cloudCover: clouds,
            rain,
            humidity,
            score,
            label: getLabel(score),
            isDay: current.is_day === 1,
            sunrise: sunriseTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
            sunset: sunsetTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
            moonPhase: moonLabel,
            carpScore,
            carpLabel: getLabel(carpScore),
            predatorScore,
            predatorLabel: getLabel(predatorScore)
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
            moonPhase: moonLabel,
            carpScore: 75,
            carpLabel: "Dobre Warunki",
            predatorScore: 68,
            predatorLabel: "Dobre Warunki"
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
