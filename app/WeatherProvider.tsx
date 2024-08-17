'use client';
import { WeatherContext } from '@/hooks/WeatherContext';
import { fetchForecastData, fetchWeatherData } from './fetch';
import { useEffect, useState } from 'react';

export default function WeatherProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          const weatherData = await fetchWeatherData(latitude, longitude);
          const forecastData = await fetchForecastData(latitude, longitude);

          await Promise.all([weatherData, forecastData]);

          setWeatherData((w) => weatherData);
          setForecastData((f) => forecastData);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported');
    }
  }, []);

  return (
    <WeatherContext.Provider value={{ weatherData, forecastData }}>
      {children}
    </WeatherContext.Provider>
  );
}
