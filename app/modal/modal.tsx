'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { WeatherInfoType } from '@/type/weatherInfo';
import { useWeather } from '@/hooks/WeatherContext';
import { SkeletonCard } from '@/components/SkeletonCard';
const chartConfig = {
  WeatherInfo: {
    label: 'WeatherInfo',
  },
} as ChartConfig;

export default function Modal({ info }: { info: WeatherInfoType }) {
  const { forecastData } = useWeather();

  const modalData = forecastData?.list
    .map((item: any) => {
      console.log(info.type + ' Info: ' + item[info.variablePath]);

      if (!item[info.variablePath]) return null;

      return {
        time: new Date(item.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'short',
          hour: 'numeric',
        }),
        WeatherInfo: info.subPath
          ? item[info.variablePath][info.subPath]
          : item[info.variablePath],
      };
    })
    .filter((item: any) => item !== null);

  return (
    <div>
      {!modalData ? (
        <SkeletonCard />
      ) : (
        <Card>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                accessibilityLayer
                data={modalData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: string) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Area
                  dataKey="WeatherInfo"
                  type="natural"
                  fill={`hsl(${info.chartColor})`}
                  fillOpacity={0.4}
                  stroke={`hsl(${info.chartColor})`}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
          {/* <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                January - June 2024
              </div>
            </div>
          </div>
        </CardFooter> */}
        </Card>
      )}
    </div>
  );
}
