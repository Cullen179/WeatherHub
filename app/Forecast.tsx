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

export default function Forecast() {
  const { weatherData, forecastData } = useWeather();

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

        return {
          date, // The date is already in ISO format, no need to adjust
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
          <h1 className="text-3xl font-bold mb-3">{weatherData.name}</h1>
          <h2 className="text-2xl font-bold mb-3">Week Forecast</h2>
          <div className="flex gap-2">
            <Card className="flex items-center basis-2/6 drop-shadow-md rounded-md">
              <CardHeader className="basis-3/5">
                <CardTitle>
                  Today:{' '}
                  {
                    new Date(weatherData.dt * 1000)
                      .toLocaleDateString('en-GB', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                      })
                      .split('T')[0]
                  }
                </CardTitle>
                <CardDescription>
                  {new Date(weatherData.dt * 1000).toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </CardDescription>
                <p className="capitalize text-sm">
                  {weatherData.weather[0].description}
                </p>
              </CardHeader>
              <CardContent className="basis-2/5">
                <div className="flex flex-col items-center">
                  <Image
                    src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    width={100}
                    height={100}
                    alt={weatherData.description}
                  />
                  <div className="flex">
                    <p className="text-sm">
                      {weatherData.main.temp_min}°C -{' '}
                      {weatherData.main.temp_max}°C
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {calculateDailyAverages(forecastData.list).map(
              (day: any, index: number) => (
                <Card
                  className="flex flex-col items-center basis-1/6 drop-shadow-md rounded-md py-2 px-4"
                  key={index}
                >
                  <h2 className="font-bold">
                    {new Date(day.date).toLocaleDateString('en-GB', {
                      weekday: 'short',
                      day: '2-digit',
                      month: 'short',
                    })}
                  </h2>
                  <Image
                    src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                    width={100}
                    height={100}
                    alt={day.main}
                  />
                  <p className="capitalize text-sm text-muted-foreground">
                    {day.main}
                  </p>
                  <div className="flex items-center gap-2 w-full">
                    <p className="text-sm">{day.minTemp}°C </p>
                    <ConditionLevel
                      type="Temperature"
                      startNum={parseInt(day.minTemp)}
                      endNum={parseInt(day.maxTemp)}
                    />
                    <p className="text-sm">{day.maxTemp}°C </p>
                  </div>
                </Card>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
