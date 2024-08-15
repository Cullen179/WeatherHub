import { WeatherInfo, WeatherType } from "@/type/weatherInfo";

export default function ConditionLevel({ type, startNum, endNum}: {
    type: typeof WeatherType[number];
    startNum: number;
    endNum: number;
}) {
    const info = WeatherInfo.info.find((info) => info.type === type);
    if (!info) {
        return null;
    }
    const startPercent = (startNum - info.min) / (info.max - info.min) * 100;
    const endPercent = (endNum - info.min) / (info.max - info.min) * 100;

    return (
        <div className={`bg-gradient-to-r from-[${info.startColor}] from-${startPercent}% to-[${info.endColor}] to-${endPercent}%` + " w-full h-2 rounded"} />
    );
}