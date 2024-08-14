'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const [lat, setLat] = useState('10.823099');
  const [lon, setLon] = useState('106.629662');
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon]);

  const fetchWeatherData = async () => {
    try {
      const weatherResponse = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const forecastResponse = await fetch(
        `/api/forecast?lat=${lat}&lon=${lon}`
      );

      if (!weatherResponse.ok || !forecastResponse.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const weatherData = await weatherResponse.json();
      const forecastData = await forecastResponse.json();
      console.log(weatherData)
      setCurrentWeather(weatherData);
      setForecast(calculateDailyAverages(forecastData.list));
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setCurrentWeather(null);
      setForecast([]);
    }
  };

  const calculateDailyAverages = (forecastList: any[]) => {
    const dailyData: { [key: string]: any[] } = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]; // Get the ISO date string, and split to keep only the date part
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    console.log('Grouped Daily Data:', dailyData); // Debugging

    const dailyAverages = Object.keys(dailyData)
      .slice(1, 5)
      .map((date) => {
        const dayData = dailyData[date];

        // Calculate actual min and max temperatures for the day
        const minTemp = Math.min(...dayData.map((item) => item.main.temp_min));
        const maxTemp = Math.max(...dayData.map((item) => item.main.temp_max));

        return {
          date, // The date is already in ISO format, no need to adjust
          minTemp: minTemp.toFixed(0),
          maxTemp: maxTemp.toFixed(0),
          main: dayData[0].weather[0].main,
          icon: dayData[0].weather[0].icon, // Assuming similar weather for the day
        };
      });

    console.log('Daily Averages:', dailyAverages); // Debugging
    return dailyAverages;
  };

  return (
    <div>
      {error && <p>{error}</p>}
      {currentWeather && (
        <h1 className="text-3xl font-bold mb-3">{currentWeather.name}</h1>
      )}
      <h2 className="text-2xl font-bold mb-3">Week Forecast</h2>
      <div className="flex gap-2">
        {currentWeather && (
          <Card className="flex items-center basis-2/6 drop-shadow-md rounded-md">
            <CardHeader className="basis-3/5">
              <CardTitle>
                Today:{' '}
                {new Date(currentWeather.dt * 1000).toISOString().split('T')[0]}
              </CardTitle>
              <CardDescription>
                {new Date(currentWeather.dt * 1000).toLocaleTimeString(
                  'vi-VN',
                  { hour: '2-digit', minute: '2-digit', hour12: true }
                )}
              </CardDescription>
              <p className="capitalize text-sm">
                {currentWeather.weather[0].description}
              </p>
            </CardHeader>
            <CardContent className="basis-2/5">
              <div className="flex flex-col items-center">
                <Image
                  src={`http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                  width={100}
                  height={100}
                  alt={currentWeather.description}
                />
                <div className="flex">
                  <p className="text-sm">
                    {currentWeather.main.temp_min}°C -{' '}
                    {currentWeather.main.temp_max}°C
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {forecast.map((day, index) => (
          <Card
            className="flex flex-col items-center basis-1/6 drop-shadow-md rounded-md p-2"
            key={index}
          >
            <h2 className="font-bold">{day.date}</h2>
            <Image
              src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
              width={100}
              height={100}
              alt={currentWeather.description}
            />
            <div className="flex items-center gap-2">
              <p className="text-sm">{day.minTemp}°C </p>
              <div
                style={{
                  borderRadius: '0.25rem',
                  height: '0.3rem',
                  width: '4rem',
                  background:
                    'linear-gradient(to right, #0085FF, #FF7A00, #FF0000)',
                }}
              ></div>
              <p className="text-sm">{day.maxTemp}°C </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
