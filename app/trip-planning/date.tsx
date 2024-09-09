'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { act, useState } from 'react';
import { useForm } from 'react-hook-form';
import { date, z } from 'zod';
import { fetchForecastData } from '../fetch';
import { WeatherInfo } from '@/type/weatherInfo';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ActivityLocation from './form/ActivityLocation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { activities, recommendActivity } from './form/WeatherActivity';
import { Typography } from '@/components/Typography';
import { count } from 'console';
import DateRecom from './form/DateRecom';

const FormSchema = z.object({
    activity: z.string(),
    lat: z.number(),
    lon: z.number(),
});

export default function Date() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {},
    });

    const [dateOverview, setDateOverview] = useState<any>([]);

    const { setValue } = form;

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        let weatherData = await fetchForecastData(data.lat, data.lon);

        if (!weatherData) {
            console.error('Failed to fetch weather data');
            return;
        }

        const formatWeatherData = weatherData.list.reduce(
            (acc: any, item: any) => {
                const date = item.dt_txt.split(' ')[0];

                const curDate = acc?.find((el: any) => el.date === date);
                if (!curDate) {
                    acc.push({
                        date,
                        count: 1,
                        ...WeatherInfo.reduce((acc: any, key: any) => {
                            if (!item[key.variablePath]) {
                                acc[
                                    key.variablePath +
                                        (key.subPath ? key.subPath : '')
                                ] = 0;
                                return acc;
                            }

                            acc[
                                key.variablePath +
                                    (key.subPath ? key.subPath : '')
                            ] = key.subPath
                                ? item[key.variablePath][key.subPath]
                                : item[key.variablePath];
                            return acc;
                        }, {}),
                    });
                } else {
                    curDate.count += 1;
                    WeatherInfo.forEach((key) => {
                        if (!item[key.variablePath]) {
                            curDate[
                                key.variablePath +
                                    (key.subPath ? key.subPath : '')
                            ] = 0;
                            return;
                        }

                        curDate[
                            key.variablePath + (key.subPath ? key.subPath : '')
                        ] += key.subPath
                            ? item[key.variablePath][key.subPath]
                            : item[key.variablePath];
                    });
                }

                return acc;
            },
            []
        );

        const activityStatus = formatWeatherData.map((item: any) => {
            return {
                activity: data.activity,
                date: item.date,
                status: recommendActivity(data.activity, item.cloudsall / item.count, item.maintemp / item.count, item.pop / item.count, item.rain3h / item.count, item.visibility / item.count, item.windspeed / item.count),
            }
        });

        console.log(activityStatus);
        setDateOverview(activityStatus);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="activity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Activity</FormLabel>
                            <FormDescription>
                                Find the recommended day for the activity
                            </FormDescription>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an activity" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {activities.map((activity) => (
                                        <SelectItem
                                            key={activity.name}
                                            value={activity.name}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className="p-2 rounded-full bg-background">
                                                    {activity.icon}
                                                </div>
                                                <Typography variant="h6">
                                                    {activity.name}
                                                </Typography>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                {/* Location Field */}
                <div className="space-y-2">
                    <div className="flex space-x-2">
                        <FormField
                            control={form.control}
                            name="lat"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Latitude</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="lat"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lon"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Longtitude</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="lon"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <ActivityLocation setValue={setValue} />
                </div>

                <Button type="submit">Find Date</Button>
            </form>

            {dateOverview.length > 0 && <DateRecom dateOverview={dateOverview} />}
        </Form>
    );
}
