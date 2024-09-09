import { Typography } from '@/components/Typography';
import { cn } from '@/lib/utils';
import {
    Bike,
    Flower2,
    Footprints,
    Mountain,
    Telescope,
    Tent,
} from 'lucide-react';
import { useMemo } from 'react';

type Status = 'Danger' | 'Moderate' | 'Good' | 'Not advisable';
interface recommendation {
    activity: string;
    status: Status;
    icon: React.ReactNode;
}

export default function ActivityRecom({
    weatherOverview,
}: {
    weatherOverview: WeatherOverviewType;
}) {
    // Define activity recommendations with three-tier scale
    function recommendActivity(
        activity: string,
        icon: React.ReactNode,
        good: boolean,
        moderate: boolean,
        danger: boolean
    ) {
        let status: Status = 'Not advisable'; // Initialize with a default value
        if (danger) {
            status = 'Danger';
        } else if (moderate) {
            status = 'Moderate';
        } else if (good) {
            status = 'Good';
        }
        return { activity, status, icon } as recommendation;
    }

    const {
        maintemp,
        cloudsall,
        mainhumidity,
        rain3h,
        visibility,
        windspeed,
        pop,
    } = weatherOverview;
    const recommendations: recommendation[] = useMemo(() => {
        return [
            // Hiking: Prefer cooler temperatures, low rain, moderate cloudiness
            recommendActivity(
                'Hiking',
                <Mountain />,
                maintemp < 25 && rain3h < 0.5 && cloudsall < 50,
                maintemp < 30 && rain3h < 1 && cloudsall < 80,
                maintemp >= 30 || rain3h >= 1 || cloudsall >= 80
            ),

            // Running: Prefer cooler temperatures, low humidity, good visibility
            recommendActivity(
                'Running',
                <Footprints />,
                maintemp < 20 && mainhumidity < 60 && visibility > 10000,
                maintemp < 25 && mainhumidity < 70 && visibility > 8000,
                maintemp >= 25 || mainhumidity >= 70 || visibility <= 8000
            ),

            // Picnic: Prefer no rain, low wind, some clouds for shade
            recommendActivity(
                'Picnic',
                <Tent />,
                pop < 0.1 && windspeed < 3 && cloudsall < 70,
                pop < 0.3 && windspeed < 5 && cloudsall < 90,
                pop >= 0.3 || windspeed >= 5 || cloudsall >= 90
            ),

            // Stargazing: Needs clear sky, no rain, good visibility
            recommendActivity(
                'Stargazing',
                <Telescope />,
                cloudsall < 10 && rain3h === 0 && visibility > 10000,
                cloudsall < 20 && rain3h < 0.2 && visibility > 9000,
                cloudsall >= 20 || rain3h >= 0.2 || visibility <= 9000
            ),

            // Cycling: Moderate temperature, low wind, good visibility
            recommendActivity(
                'Cycling',
                <Bike />,
                maintemp > 15 &&
                    maintemp < 25 &&
                    windspeed < 3 &&
                    visibility > 10000,
                maintemp > 20 &&
                    maintemp < 30 &&
                    windspeed < 4 &&
                    visibility > 8000,
                maintemp <= 15 ||
                    maintemp >= 30 ||
                    windspeed >= 4 ||
                    visibility <= 8000
            ),

            // Gardening: Prefer moderate humidity, no strong winds, mild temperatures
            recommendActivity(
                'Gardening',
                <Flower2 />,
                mainhumidity < 60 &&
                    windspeed < 3 &&
                    maintemp > 18 &&
                    maintemp < 28,
                mainhumidity < 80 &&
                    windspeed < 5 &&
                    maintemp > 15 &&
                    maintemp < 35,
                mainhumidity >= 80 ||
                    windspeed >= 5 ||
                    maintemp <= 15 ||
                    maintemp >= 35
            ),
        ];
    }, [maintemp, cloudsall, mainhumidity, rain3h, visibility, windspeed, pop]); 
        
    function statusColor(status: Status) {
        switch (status) {
            case 'Danger':
                return 'red-500';
            case 'Moderate':
                return 'yellow-500';
            case 'Good':
                return 'green-500';
            case 'Not advisable':
                return 'gray-500';
        }
    }

    return (
        <div className="flex flex-wrap gap-1 mt-4">
            {recommendations.map((recommendation: recommendation) => (
                <div
                    key={recommendation.activity}
                    className="flex items-center justify-between bg-muted border border-muted-foreground py-2 px-4 rounded-md gap-4"
                >
                    <div className="p-2 rounded-full bg-background">
                        {recommendation.icon}
                    </div>
                    <div className="space-y-1">
                        {/* <h2>{recommendation.activity}</h2> */}
                        <Typography variant="h6">
                            {recommendation.activity}
                        </Typography>
                        <div className="flex items-center space-x-1">
                            <p className={cn('text-muted-foreground text-xs',
                                `text-${statusColor(recommendation.status)}`
                            )}>
                                {recommendation.status}
                            </p>
                            <span
                                className={cn(
                                    'flex h-2 w-2 rounded-full',
                                    `bg-${statusColor(recommendation.status)}`
                                )}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
