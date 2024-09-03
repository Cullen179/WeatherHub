import { FC } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { SkeletonCard } from '@/components/SkeletonCard';
import { WeatherInfo } from '@/type/weatherInfo';

interface WeatherWidgetProps {
  option: string;
  weatherData: any;
  forecastData: any;
  showDescription?: boolean;
  isModal?: boolean;
}

const WeatherWidget: FC<WeatherWidgetProps> = ({
  option,
  weatherData,
  forecastData,
  showDescription = false,
  isModal = false,
}) => {
  const weatherInfo = WeatherInfo.find((info) => info.type === option);

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
      label:
        weatherInfo.type.charAt(0).toUpperCase() + weatherInfo.type.slice(1),
    },
  };

  return (
    <div
      className={`w-full`}
    >
      {!modalData ? (
        <SkeletonCard />
      ) : (
        <Card
          className={`${isModal ? 'bg-white border-none shadow-none' : 'bg-white border border-gray-100 shadow-md'}`}
        >
          <CardHeader className="mb-2">
            <CardTitle className="text-lg font-semibold text-gray-900">
              {`${weatherInfo.type} (${weatherInfo.unit})`}
            </CardTitle>
            {showDescription && (
              <CardDescription className="text-sm text-gray-600">
                {weatherInfo.definition}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <AreaChart
                data={modalData}
                margin={{ left: 12, right: 12 }}
                className="w-full h-64"
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value: string) => value}
                  className="text-gray-700"
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
