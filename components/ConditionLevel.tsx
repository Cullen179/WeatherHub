import { WeatherInfo, WeatherType } from '@/type/weatherInfo';

export default function ConditionLevel({
  type,
  startNum,
  endNum,
}: {
  type: (typeof WeatherType)[number];
  startNum: number;
  endNum: number;
}) {
  const info = WeatherInfo.info.find((info) => info.type === type);
  console.log(info);
  if (!info) {
    return null;
  }
  const startPercent = ((startNum - info.min) / (info.max - info.min)) * 100;
  const endPercent = ((endNum - info.min) / (info.max - info.min)) * 100;

  return (
    <div
      className={
        `bg-gradient-to-r from-[#4ab7ff] from-${startPercent}% to-[#ff3232] to-${endPercent}% w-fill h-[10px] rounded`
      }
    />
  );
}
