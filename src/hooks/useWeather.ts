import { useState, useEffect } from "react";

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

// Simple Moon Phase Calculator (0-8 scale)
const getMoonPhase = (date: Date) => {
    const year = date.getFullYear();
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
    let b = parseInt(jd.toString()); // int(jd) -> b, take integer part of jd
    jd -= b; // subtract integer part to leave fractional part of original jd
    b = Math.round(jd * 8); // scale fraction from 0-8

    if (b >= 8) b = 0; // 0 and 8 are the same so turn 8 into 0

    return b;
};

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const lat = 50.0944;
                const lon = 21.4362;

                // Fetch Current + Daily (Sunrise/Sunset)
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,is_day,cloud_cover,rain,showers&daily=sunrise,sunset&timezone=auto`
                );

                if (!response.ok) throw new Error('Weather fetch failed');

                const data = await response.json();
                const current = data.current;
                const daily = data.daily;

                // --- ULTIMATE FISHING SCORE ALGORITHM (0-100) ---
                let score = 50; // Base score (Neutral)

                // 1. Pressure
                const pressure = current.surface_pressure;
                if (pressure > 1015) score += 15;
                else if (pressure > 1005) score += 5;
                else if (pressure < 1000) score -= 10;
                else if (pressure < 990) score -= 20;

                // 2. Wind
                const wind = current.wind_speed_10m;
                if (wind < 10) score += 20;
                else if (wind < 20) score += 5;
                else if (wind > 30) score -= 20;
                else if (wind > 45) score -= 40;

                // 3. Cloud Cover
                const clouds = current.cloud_cover;
                if (clouds > 80) score += 10;
                else if (clouds < 20) score -= 5;

                // 4. Rain
                const rain = current.rain + current.showers;
                if (rain > 0 && rain < 2) score += 10;
                if (rain >= 5) score -= 20;

                // 5. Time of Day (Solunar)
                const now = new Date();
                const sunrise = new Date(daily.sunrise[0]);
                const sunset = new Date(daily.sunset[0]);
                const isDawn = Math.abs(now.getTime() - sunrise.getTime()) < 3600000;
                const isDusk = Math.abs(now.getTime() - sunset.getTime()) < 3600000;

                if (isDawn || isDusk) score += 15;

                // 6. Moon Phase (Local Calc)
                const moonPhaseVal = getMoonPhase(now); // 0-8
                let moonLabel = "";

                // Full Moon (4)
                if (moonPhaseVal === 3 || moonPhaseVal === 4 || moonPhaseVal === 5) {
                    score += 15;
                    moonLabel = "Pełnia";
                }
                // New Moon (0 or 8)
                else if (moonPhaseVal === 0 || moonPhaseVal === 1 || moonPhaseVal === 7 || moonPhaseVal === 8) {
                    score += 15;
                    moonLabel = "Nów";
                }

                // 7. Season/Month Modifier
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

                setWeather({
                    temperature: Math.round(current.temperature_2m),
                    pressure: Math.round(current.surface_pressure),
                    windSpeed: Math.round(current.wind_speed_10m),
                    cloudCover: clouds,
                    rain,
                    humidity: current.relative_humidity_2m,
                    score,
                    label,
                    isDay: current.is_day === 1,
                    sunrise: sunrise.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    sunset: sunset.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' }),
                    moonPhase: moonLabel
                });
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    return { weather, loading, error };
};
