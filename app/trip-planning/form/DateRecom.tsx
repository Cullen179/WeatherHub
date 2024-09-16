import { Typography } from '@/components/Typography';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function DateRecom({
    dateOverview,
}: {
    dateOverview: DateOverviewType[];
}) {
    function statusLevel(status: Status) {
        switch (status) {
            case 'Danger':
                return 3;
            case 'Moderate':
                return 2;
            case 'Good':
                return 1;
            default:
                return 0;
        }
    }

    function statusColor(status: Status) {
        switch (status) {
            case 'Danger':
                return {
                    text: 'text-red-500',
                    bg: 'bg-red-500',
                };
            case 'Moderate':
                return {
                    text: 'text-yellow-500',
                    bg: 'bg-yellow-500',
                };
            case 'Good':
                return {
                    text: 'text-green-500',
                    bg: 'bg-green-500',
                };
        }
    }

    dateOverview.sort((a, b) => statusLevel(a.status) - statusLevel(b.status));

    return (
        <div className="w-full flex flex-col mt-4 rounded-md border">
            {dateOverview.map((day: DateOverviewType) => (
                <>
                    <div
                        key={day.date}
                        className="w-full flex items-center justify-between py-2 px-6 rounded-md gap-4"
                    >
                        <Typography variant="h6">
                            {new Date(day.date).toLocaleDateString('en-GB', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                            })}
                        </Typography>
                        {/* <h2>{recommendation.activity}</h2> */}
                        <div className="flex items-center space-x-1">
                            <p
                                className={cn(
                                    'text-muted-foreground text-xs',
                                    statusColor(day.status).text
                                )}
                            >
                                {day.status}
                            </p>
                            <span
                                className={cn(
                                    'flex h-2 w-2 rounded-full',
                                    statusColor(day.status).bg
                                )}
                            />
                        </div>
                    </div>
                    <Separator className="my-1" />
                </>
            ))}
        </div>
    );
}
