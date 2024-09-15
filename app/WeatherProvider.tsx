'use client';
import { WeatherContext } from '@/hooks/WeatherContext';
import { fetchForecastData, fetchWeatherData, saveLocation } from './fetch';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import AIChatButton from '@/components/AI/AIChatBoxButton';

interface geoLocation {
  latitude: number;
  longitude: number;
}

export default function WeatherProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const { user } = useUser();

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
  }, [user]);

  return (
    <WeatherContext.Provider value={{ weatherData, forecastData }}>
      {children}
      <AIChatButton />
    </WeatherContext.Provider>
  );
}

