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
import { count } from 'console';

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

        const overview = weatherData.list.reduce((acc: any, item: any) => {
            const date = item.dt_txt.split(' ')[0];

            if (date !== activityDate) {
                return acc;
            }
            WeatherInfo.forEach((key) => {
                !acc[key.variablePath + (key.subPath ? key.subPath : '')] &&
                    (acc[key.variablePath + (key.subPath ? key.subPath : '')] =
                        0);

                if (!item[key.variablePath]) {
                    return;
                }

                acc[key.variablePath + (key.subPath ? key.subPath : '')] +=
                    key.subPath
                        ? item[key.variablePath][key.subPath]
                        : item[key.variablePath];
            });

            acc.count+= 1;
            return acc;
        }, {count: 0, activityDate: activityDate});

        Object.keys(overview).forEach((key: any) => {
            (key != 'count' && typeof overview[key] === 'number') &&
            (overview[key] /= overview.count);
        });

        setWeatherOverview(overview);
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
