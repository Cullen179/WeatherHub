'use client';
import { WeatherContext } from '@/hooks/WeatherContext';

export default function WeatherProvider({
  children,
  weatherData,
  forecastData,
}: Readonly<{
  children: React.ReactNode;
  weatherData: any;
  forecastData: any;
}>) {
  return (
    <WeatherContext.Provider value={{ weatherData, forecastData }}>
      {children}
    </WeatherContext.Provider>
  );
}
