import { FC } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { SkeletonCard } from '@/components/SkeletonCard';
import { WeatherInfo } from '@/type/weatherInfo';
import { WeatherInfoType } from '@/type/weatherInfo';
import { useWeather } from '@/hooks/WeatherContext';

interface WeatherWidgetProps {
  option: string;
  weatherData: any;
  forecastData: any;
  showDescription?: boolean; // New prop to control description visibility
}

const WeatherWidget: FC<WeatherWidgetProps> = ({ option, weatherData, forecastData, showDescription = false }) => {
  const weatherInfo = WeatherInfo.find(info => info.type === option);

  if (!weatherInfo) {
    return <SkeletonCard />;
  }

  const modalData = forecastData?.list
    .map((item: any) => {
      if (!item[weatherInfo.variablePath]) return null;

      return {
        time: new Date(item.dt * 1000).toLocaleDateString('en-US', {
          weekday: 'short',
          hour: 'numeric',
        }),
        [option]: weatherInfo.subPath
          ? item[weatherInfo.variablePath][weatherInfo.subPath]
          : item[weatherInfo.variablePath],
      };
    })
    .filter((item: any) => item !== null);

  const chartConfig: ChartConfig = {
    [option]: {
      label: weatherInfo.type.charAt(0).toUpperCase() + weatherInfo.type.slice(1),
    },
  };

  return (
    <div>
      {!modalData ? (
        <SkeletonCard />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{`${weatherInfo.type} (${weatherInfo.unit})`}</CardTitle>
            {showDescription && (
              <CardDescription className="text-sm text-gray-600">{weatherInfo.definition}</CardDescription>
            )}
          </CardHeader>
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
                  dataKey={option}
                  type="natural"
                  fill={`hsl(${weatherInfo.chartColor})`}
                  fillOpacity={0.4}
                  stroke={`hsl(${weatherInfo.chartColor})`}
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherWidget;
