'use client';
import { WeatherContext } from '@/hooks/WeatherContext';
import { fetchForecastData, fetchWeatherData } from './fetch';
import { useEffect, useState } from 'react';
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
  const [geoLocation, setGeoLocation] = useState<geoLocation | null>(null);

  // Function to fetch data
  const fetchData = async (latitude: number, longitude: number) => {
    try {
      const weatherData = await fetchWeatherData(latitude, longitude);
      const forecastData = await fetchForecastData(latitude, longitude);
      setWeatherData(weatherData);
      setForecastData(forecastData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (geoLocation) {
      const { latitude, longitude } = geoLocation;
      fetchData(latitude, longitude);
    } else if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setGeoLocation({ latitude, longitude });

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
    }
  }, [geoLocation]);

  return (
    <WeatherContext.Provider
      value={{ weatherData, forecastData, geoLocation, setGeoLocation }}
    >
      {children}
      <AIChatButton />
    </WeatherContext.Provider>
  );
}
