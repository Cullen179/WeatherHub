export default function WeatherOverview({weatherOverview}: {
    weatherOverview: WeatherOverviewType;
}) {
    const { cloudsall, mainhumidity, mainsea_level, maintemp, pop, rain3h, visibility, windspeed } = weatherOverview;
    const cloudsOverview = `${
        cloudsall > 80
            ? 'Complete cloud cover, sky is fully overcast.'
            : cloudsall > 50
            ? 'Mostly cloudy.'
            : 'Partly cloudy or mostly clear skies.'
    }`;

    // Humidity
    const humidityOverview = `${
        mainhumidity > 80
            ? 'High humidity, it may feel sticky or uncomfortable.'
            : mainhumidity > 40
            ? 'Moderate humidity, fairly comfortable.'
            : 'Low humidity, dry air.'
    }`;

    // Sea Level Pressure
    const pressureOverview = `${
        mainsea_level >= 1010
            ? 'High pressure, indicating stable weather.'
            : mainsea_level >= 990
            ? 'Normal pressure, typical weather.'
            : 'Low pressure, may indicate stormy weather.'
    }`;

    // Temperature
    const temperatureOverview = `${
        maintemp > 30
            ? 'Hot, take precautions for heat.'
            : maintemp > 20
            ? 'Warm and comfortable.'
            : maintemp > 10
            ? 'Cool, light layers recommended.'
            : 'Cold, dress warmly.'
    }`;

    // Rain Probability
    const rainProbabilityOverview = `${
        pop > 0.7
            ? 'High chance of rain, likely to rain.'
            : pop > 0.4
            ? 'Moderate chance of rain, bring an umbrella.'
            : 'Low chance of rain, unlikely.'
    }`;

    // Rain Volume
    const rainVolumeOverview = `${
        rain3h > 5
            ? 'Heavy rain, may cause disruptions.'
            : rain3h > 1
            ? 'Light rain, manageable.'
            : 'Very light or no rain.'
    }`;

    // Visibility
    const visibilityOverview = `${
        visibility > 10000
            ? 'Excellent visibility.'
            : visibility > 5000
            ? 'Good visibility, some haze.'
            : 'Poor visibility, difficult to see far.'
    }`;

    // Wind Speed
    const windSpeedOverview = `${
        windspeed > 20
            ? 'Very strong winds, be cautious.'
            : windspeed > 10
            ? 'Strong winds, noticeable.'
            : windspeed > 5
            ? 'Moderate wind, gentle breeze.'
            : 'Light wind, calm conditions.'
    }`;
    return (
        <div className="mt-2">
            <h2 className="text-lg font-semibold">Weather Overview</h2>
            <ul className="list-disc pl-5">
                <li>{cloudsOverview}</li>
                <li>{humidityOverview}</li>
                <li>{pressureOverview}</li>
                <li>{temperatureOverview}</li>
                <li>{rainProbabilityOverview}</li>
                <li>{rainVolumeOverview}</li>
                <li>{visibilityOverview}</li>
                <li>{windSpeedOverview}</li>
            </ul>
        </div>
    );
}