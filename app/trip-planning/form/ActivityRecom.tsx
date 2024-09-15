import { Typography } from '@/components/Typography';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';
import { activities, recommendActivity } from './WeatherActivity';

interface Recommendation {
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

    const {
        maintemp,
        cloudsall,
        mainhumidity,
        rain3h,
        visibility,
        windspeed,
        pop,
    } = weatherOverview;

    const recommendations: Recommendation[] = useMemo(() => {
        return activities.map((activity) => {
            const status = recommendActivity(
                activity.name,
                cloudsall,
                maintemp,
                pop,
                rain3h,
                visibility,
                windspeed
            );
            return {
                activity: activity.name,
                status,
                icon: activity.icon,
            };
        });
    }, [maintemp, cloudsall, rain3h, visibility, windspeed, pop]);

    function statusColor(status: Status) {
        switch (status) {
            case 'Danger':
                return 'red-500';
            case 'Moderate':
                return 'yellow-500';
            case 'Good':
                return 'green-500';
        }
    }

    return (
        <div className="flex flex-wrap gap-1 mt-4">
            {recommendations.map((recommendation: Recommendation) => (
                <div
                    key={recommendation.activity}
                    className="w-[calc(50%-4px)] flex items-center justify-between bg-muted py-2 px-4 rounded-md gap-4"
                >
                    <div className="p-2 rounded-full bg-background">
                        {recommendation.icon}
                    </div>
                    <div className="space-y-1 text-right">
                        {/* <h2>{recommendation.activity}</h2> */}
                        <Typography variant="h6">
                            {recommendation.activity}
                        </Typography>
                        <div className="flex justify-end items-center space-x-1">
                            <p
                                className={cn(
                                    'text-muted-foreground text-xs',
                                    `text-${statusColor(recommendation.status)}`
                                )}
                            >
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
