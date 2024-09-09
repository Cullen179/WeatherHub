'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import ActivityDate from './form/ActivityDate';
import { Input } from '@/components/ui/input';
import ActivityLocation from './form/ActivityLocation';
import { fetchForecastData } from '../fetch';
import { WeatherInfo } from '@/type/weatherInfo';
import { useState } from 'react';
import ActivityRecom from './form/ActivityRecom';

const FormSchema = z.object({
    activityDate: z.date({
        required_error: 'A date of birth is required.',
    }),
    lat: z.number(),
    lon: z.number(),
});

export default function Weather() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            activityDate: new Date(),
        },
    });

    const [weatherOverview, setWeatherOverview] = useState<any>({});

    const { setValue } = form;
    
    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const activityDate = data.activityDate.toISOString().split('T')[0];
        let weatherData = await fetchForecastData(data.lat, data.lon);

        if (!weatherData) {
            console.error('Failed to fetch weather data');
            return;
        }

        const formatWeatherData = weatherData.list
            .filter((item: any) => item.dt_txt.split(' ')[0] === activityDate)
            .map((item: any) => {
                return {
                    ...WeatherInfo.reduce((acc: any, key) => {
                        if (!item[key.variablePath]) {
                            acc[
                                key.variablePath +
                                    (key.subPath ? key.subPath : '')
                            ] = 0;
                            return acc;
                        }

                        acc[
                            key.variablePath + (key.subPath ? key.subPath : '')
                        ] = key.subPath
                            ? item[key.variablePath][key.subPath]
                            : item[key.variablePath];
                        return acc;
                    }, {}),
                };
            });

        const overviewData = formatWeatherData.reduce((acc: any, item: any) => {
            // Initialize acc with zero values if it's the first iteration
            if (acc.activityDate === undefined) {
                acc = { activityDate, ...item };
            } else {
                // Sum up the numeric values and increment count outside the loop
                Object.keys(item).forEach((key) => {
                    if (typeof item[key] == 'number') {
                        acc[key] += item[key] || 0;
                    }
                });
            }

            return acc;
        }, {});

        Object.keys(overviewData).forEach((key: any) => {
            typeof overviewData[key] === 'number' &&
                (overviewData[key] /= formatWeatherData.length);
        });
        setWeatherOverview(overviewData);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
            >
                <FormField
                    control={form.control}
                    name="activityDate"
                    render={({ field }) => <ActivityDate field={field} />}
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

                <Button type="submit">Find Activities</Button>
            </form>
            {weatherOverview.activityDate && (
                <ActivityRecom weatherOverview={weatherOverview} />
            )}
        </Form>
    );
}
