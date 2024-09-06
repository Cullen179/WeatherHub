'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useWeather } from '@/hooks/WeatherContext';
import ConditionLevel from '@/components/ConditionLevel';
import SearchCity from './map/SearchCity';
import { useEffect } from 'react';

export default function Forecast() {
  const { weatherData, forecastData,geoLocation, setGeoLocation } = useWeather();

  const handleCoordinatesFound = (latitude: number, longitude: number) => {
    setGeoLocation({ latitude, longitude });
  };

  const calculateDailyAverages = (forecastData: any[]) => {
    const dailyData: { [key: string]: any[] } = {};

    forecastData.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split('T')[0]; // Get the ISO date string, and split to keep only the date part
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    const dailyAverages = Object.keys(dailyData)
      .slice(1, 5)
      .map((date) => {
        const dayData = dailyData[date];

        // Calculate actual min and max temperatures for the day
        const minTemp = Math.min(...dayData.map((item) => item.main.temp_min));
        const maxTemp = Math.max(...dayData.map((item) => item.main.temp_max));
        const avgTemp = (minTemp + maxTemp) / 2;

        return {
          date, // The date is already in ISO format, no need to adjust
          avgTemp: avgTemp.toFixed(0),
          minTemp: minTemp.toFixed(0),
          maxTemp: maxTemp.toFixed(0),
          main: dayData[0].weather[0].main,
          icon: dayData[0].weather[0].icon, // Assuming similar weather for the day
        };
      });

    return dailyAverages;
  };

  return (
    <div>
      {!weatherData ? (
        <h1>Error fetching data</h1>
      ) : (
        <>
          <div className='flex justify-between'>
            <h2 className="text-2xl font-bold mb-3">Week Forecast</h2>
            <div className="flex items-center p-4">
              <SearchCity onCoordinatesFound={handleCoordinatesFound} />
            </div>
          </div>
          <div className="flex w-[50%] gap-2">
            <Card className="basis-3/6 drop-shadow-md rounded-md">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-sm">{weatherData.name}</CardTitle>
                  <CardDescription className='basis-2/3 flex justify-end'>
                    {new Date(weatherData.dt * 1000).toLocaleTimeString('en-EN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: true,
                    })}
                  </CardDescription>
                </div>
                  <div className='text-sm basis-1/3'>
                    {"Today: "}
                    {
                      new Date(weatherData.dt * 1000)
                      .toLocaleDateString('en-GB', {
                        weekday: 'long',
                      })
                      .split('T')[0]
                    }
                  </div>
              </CardHeader>
                <h2 className="flex justify-center text-6xl my-5 font-bold">
                  {weatherData.main.temp.toFixed(0)}°
                </h2>  
              <CardContent className="basis-2/5">
                <div className="flex flex-col">
                  <Image
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    width={40}
                    height={40}
                    alt={weatherData.description}
                  />
                  <p className="capitalize text-sm">
                    {weatherData.weather[0].description}
                  </p>
                  <div className="flex">
                    <p className="text-sm text-muted-foreground">
                      {"L: "}
                      {weatherData.main.temp_min.toFixed(0)}°
                      {" H: "}
                      {weatherData.main.temp_max.toFixed(0)}°
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className='flex'>
              {calculateDailyAverages(forecastData.list).map(
                (day: any, index: number) => (
                  <Card
                    className="flex flex-col items-center justify-between basis-1/4 border-0 rounded-md py-6 px-4"
                    key={index}
                  >
                    <h2 className="font-bold">
                      {index === 0
                        ? "Tomorrow"
                        : new Date(day.date).toLocaleDateString('en-GB', {
                            weekday: 'short',
                        })
                      }
                    </h2>
                    <Image
                      src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                      width={60}
                      height={60}
                      alt={day.main}
                    />
                    <div className="flex justify-center w-full">
                      <p className="text-sm">{day.avgTemp}° </p>
                    </div>
                  </Card>
                )
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
