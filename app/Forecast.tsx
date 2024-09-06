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
import { SkeletonCard } from '@/components/SkeletonCard';
import SearchCity from './map/SearchCity';
import WeatherMap from './map/WeatherMap';

export default function Forecast() {
  const { weatherData, forecastData, geoLocation, setGeoLocation } =
    useWeather();

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
      .slice(0, 5)
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
        <SkeletonCard />
      ) : (
        <>
          <div className="flex justify-between">
            <h2 className="text-2xl font-bold mb-3">Week Forecast</h2>
            <div className="flex items-center justify-end mb-4">
              <SearchCity onCoordinatesFound={handleCoordinatesFound} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex w-[50%] gap-4">
              <Card className="basis-3/6 drop-shadow-md rounded-md">
                <CardHeader>
                  <div className="flex justify-between items-center mb-2">
                    <CardTitle>{weatherData.name}</CardTitle>
                  </div>
                  <div className='flex space-x-2'>
                    <p className="text-sm">
                      {'Today: '}
                      {
                        new Date(weatherData.dt * 1000)
                          .toLocaleDateString('en-GB', {
                            weekday: 'long',
                          })
                          .split('T')[0]
                      }
                    </p>
                    <CardDescription>
                      {new Date(weatherData.dt * 1000).toLocaleTimeString(
                        'en-EN',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                          hour12: true,
                        }
                      )}
                    </CardDescription>
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
                        {'L: '}
                        {weatherData.main.temp_min.toFixed(0)}°{' H: '}
                        {weatherData.main.temp_max.toFixed(0)}°
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex-col basis-1/2">
                <CardHeader className="px-4">
                  <CardTitle>5-day Forecast</CardTitle>
                </CardHeader>
                {calculateDailyAverages(forecastData.list).map(
                  (day: any, index: number) => (
                    <Card
                      className="flex items-center justify-between basis-1/5 border-0 border-b rounded-none border-border py-2 px-4"
                      key={index}
                    >
                      <h2 className="text-sm basis-1/4">
                        {index === 0
                          ? 'Today'
                          : index === 1
                            ? 'Tomorrow'
                            : new Date(day.date).toLocaleDateString('en-GB', {
                                weekday: 'short',
                              })}
                      </h2>
                      <Image
                        src={`http://openweathermap.org/img/wn/${day.icon}@2x.png`}
                        width={30}
                        height={30}
                        alt={day.main}
                      />
                      <p className="text-sm">{day.minTemp}° </p>
                      <div className="basis-1/3">
                        <ConditionLevel
                          type="Temperature"
                          startNum={day.minTemp}
                          endNum={day.maxTemp}
                        />
                      </div>
                      <p className="text-sm">{day.maxTemp}° </p>
                    </Card>
                  )
                )}
              </Card>
            </div>
            <div className="w-[50%] h-[calc(15rem + 40px)]">
              <WeatherMap
                showSearch={false}
                showTabs={false}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
