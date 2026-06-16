"use server";

export interface HourlyForecastItem {
    time: number;
    hourLabel: string;
    score: number;
    carpScore: number;
    predatorScore: number;
}

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
    hourlyForecast: HourlyForecastItem[];
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
        // Fetch hourly for all parameters so we can calculate forecast hourly
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,is_day,cloud_cover,rain,showers&hourly=temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,cloud_cover,rain,showers&daily=sunrise,sunset&timezone=auto&timeformat=unixtime&past_days=1`,
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

        const sunriseTime = new Date(daily.sunrise[0] * 1000);
        const sunsetTime = new Date(daily.sunset[0] * 1000);

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

        // Helper to calculate carp score
        const calculateCarpScore = (temp: number, wind: number, currentPressure: number, deltaPressure: number, humidity: number, clouds: number, rain: number, solunarBonus: number) => {
            let score = 50; // Base

            // Temperature optimum: 18°C - 24°C
            if (temp >= 18 && temp <= 24) score += 20;
            else if ((temp >= 14 && temp < 18) || (temp > 24 && temp <= 28)) score += 10;
            else if (temp >= 8 && temp < 14) score -= 10;
            else if (temp < 8) score -= 25;
            else if (temp > 28) score -= 20;

            // Wind speed: optimum 6 - 18 km/h
            if (wind >= 6 && wind <= 18) score += 20;
            else if (wind > 18 && wind <= 28) score += 10;
            else if (wind < 6) score -= 10; // Calm/flat water is bad
            else if (wind > 28) score -= 20;

            // Pressure trend
            if (deltaPressure >= -2 && deltaPressure <= -0.5) score += 15; // Slowly falling (ideal)
            else if (Math.abs(deltaPressure) < 0.5) score += 5; // Stable
            else if (deltaPressure > 0.5 && deltaPressure <= 2) score -= 5; // Rising
            else if (deltaPressure < -2) score -= 15; // Rapid drop (stormy)
            else if (deltaPressure > 2) score -= 15; // Rapid rise

            if (currentPressure > 1020) score -= 10; // Very high pressure
            else if (currentPressure < 995) score -= 15; // Very low pressure

            // Humidity
            if (humidity > 80) score += 10;

            // Clouds & rain
            if (clouds > 60) score += 8;
            if (rain > 0 && rain < 2) score += 10;
            else if (rain >= 5) score -= 20;

            score += solunarBonus + moonBonus + carpSeasonBonus;
            return Math.max(1, Math.min(100, score));
        };

        // Helper to calculate predator score
        const calculatePredatorScore = (temp: number, wind: number, currentPressure: number, deltaPressure: number, clouds: number, rain: number, solunarBonus: number) => {
            let score = 50;

            // Temperature optimum: 11°C - 17°C
            if (temp >= 11 && temp <= 17) score += 20;
            else if ((temp >= 7 && temp < 11) || (temp > 17 && temp <= 21)) score += 10;
            else if (temp >= 21 && temp <= 25) score -= 10;
            else if (temp > 25) score -= 25;
            else if (temp < 7) score -= 15;

            // Wind: medium-strong ("pike chop" wave action)
            if (wind >= 12 && wind <= 25) score += 20;
            else if (wind > 25 && wind <= 35) score += 10;
            else if (wind < 8) score -= 10;
            else if (wind > 35) score -= 20;

            // Pressure trend
            if (deltaPressure < -0.5) score += 15; // Falling pressure triggers feeding
            else if (Math.abs(deltaPressure) <= 0.5) score += 5;
            else if (deltaPressure > 0.5) score -= 10;

            if (currentPressure < 1000) score += 10; // Low pressure overcast
            else if (currentPressure > 1020) score -= 15; // Clear sky high pressure

            // Clouds & rain: Pike love cloudy days (ambush hunting)
            if (clouds > 70) score += 20;
            else if (clouds < 30) score -= 10;

            if (rain > 0 && rain < 3) score += 10;
            else if (rain >= 5) score -= 15;

            score += solunarBonus + (moonBonus * 0.8) + predatorSeasonBonus;
            return Math.max(1, Math.min(100, score));
        };

        // Find nearest index to current time in hourly arrays
        let currentIdx = 0;
        if (hourly && hourly.time) {
            let minDiff = Infinity;
            for (let i = 0; i < hourly.time.length; i++) {
                const diff = Math.abs(hourly.time[i] - currentTime);
                if (diff < minDiff) {
                    minDiff = diff;
                    currentIdx = i;
                }
            }
        }

        // Calculate current 3-hour pressure trend
        let currentDeltaPressure = 0;
        if (currentIdx >= 3) {
            currentDeltaPressure = currentPressure - hourly.pressure_msl[currentIdx - 3];
        }

        const temp = current.temperature_2m;
        const wind = current.wind_speed_10m;
        const clouds = current.cloud_cover;
        const rain = current.rain + current.showers;
        const humidity = current.relative_humidity_2m;

        // Current solunar bonus
        const isDawn = Math.abs(now.getTime() - sunriseTime.getTime()) < 3600000;
        const isDusk = Math.abs(now.getTime() - sunsetTime.getTime()) < 3600000;
        const solunarBonus = (isDawn || isDusk) ? 15 : 0;

        const carpScore = calculateCarpScore(temp, wind, currentPressure, currentDeltaPressure, humidity, clouds, rain, solunarBonus);
        const predatorScore = calculatePredatorScore(temp, wind, currentPressure, currentDeltaPressure, clouds, rain, solunarBonus);
        const score = Math.round((carpScore + predatorScore) / 2);

        // Generate 24h Hourly Forecast starting from current index
        const hourlyForecast: HourlyForecastItem[] = [];
        const forecastLength = Math.min(24, hourly.time.length - currentIdx);

        for (let j = 0; j < forecastLength; j++) {
            const idx = currentIdx + j;
            const hTimeVal = hourly.time[idx];
            const hTime = new Date(hTimeVal * 1000);
            
            const hTemp = hourly.temperature_2m[idx];
            const hWind = hourly.wind_speed_10m[idx];
            const hPressure = hourly.pressure_msl[idx];
            const hHumidity = hourly.relative_humidity_2m[idx];
            const hClouds = hourly.cloud_cover[idx];
            const hRain = hourly.rain[idx] + hourly.showers[idx];

            // Calculate pressure trend for this hour (difference from 3 hours ago)
            const prevIdx = idx - 3;
            const hPrevPressure = prevIdx >= 0 ? hourly.pressure_msl[prevIdx] : hPressure;
            const hDeltaPressure = hPressure - hPrevPressure;

            // Hourly solunar bonus
            const hIsDawn = Math.abs(hTime.getTime() - sunriseTime.getTime()) < 3600000;
            const hIsDusk = Math.abs(hTime.getTime() - sunsetTime.getTime()) < 3600000;
            const hSolunarBonus = (hIsDawn || hIsDusk) ? 15 : 0;

            const hCarp = calculateCarpScore(hTemp, hWind, hPressure, hDeltaPressure, hHumidity, hClouds, hRain, hSolunarBonus);
            const hPredator = calculatePredatorScore(hTemp, hWind, hPressure, hDeltaPressure, hClouds, hRain, hSolunarBonus);
            const hScore = Math.round((hCarp + hPredator) / 2);

            hourlyForecast.push({
                time: hTimeVal,
                hourLabel: hTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
                score: hScore,
                carpScore: hCarp,
                predatorScore: hPredator
            });
        }

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
            predatorLabel: getLabel(predatorScore),
            hourlyForecast
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

        // Last resort fallback (mock data with mock hourly forecast)
        const mockHourlyForecast: HourlyForecastItem[] = [];
        const baseTimeVal = Math.floor(Date.now() / 1000);
        for (let j = 0; j < 24; j++) {
            const hTimeVal = baseTimeVal + (j * 3600);
            const hTime = new Date(hTimeVal * 1000);
            // Simulated sine wave for mock scores
            const cycle = Math.sin((j / 24) * Math.PI * 2);
            const mockScore = Math.round(60 + (cycle * 20));
            mockHourlyForecast.push({
                time: hTimeVal,
                hourLabel: hTime.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Warsaw" }),
                score: mockScore,
                carpScore: Math.round(mockScore + (cycle * 5)),
                predatorScore: Math.round(mockScore - (cycle * 5))
            });
        }

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
            predatorLabel: "Dobre Warunki",
            hourlyForecast: mockHourlyForecast
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
