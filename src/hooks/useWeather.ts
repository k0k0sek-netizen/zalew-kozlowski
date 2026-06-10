import { useState, useEffect } from "react";
import { getWeatherAction, WeatherData } from "@/app/actions/weather";

export type { WeatherData };

export const useWeather = () => {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const data = await getWeatherAction();
                setWeather(data);
                setError(false);
            } catch (err) {
                console.error("Failed to fetch weather from server action:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    return { weather, loading, error };
};
