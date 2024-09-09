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
import { fetchForecastData, fetchWeatherData } from '../fetch';
import { count } from 'console';
import { WeatherInfo } from '@/type/weatherInfo';

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

  const { setValue } = form;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    let weatherData = await fetchForecastData(data.lat, data.lon);

    if (!weatherData) {
      console.error('Failed to fetch weather data');
      return;
    }

      console.log(weatherData);
    const totalDate = weatherData.list.reduce((acc: any, item: any) => {
      const day = item.dt_txt.split(' ')[0];
      if (!acc[day]) {
        acc[day] = { ...item, count: 1 };
      } else {
        let shouldBreak = false;
        WeatherInfo.forEach((key) => {
          if (!item[key.variablePath]) {
            return;
          }
          const value = key.subPath
            ? item[key.variablePath][key.subPath]
            : item[key.variablePath];
        });

        acc[day].count++;
      }
    }, []);

    Object.keys(totalDate).forEach((key) => {
      typeof totalDate[key] === 'number' && (totalDate[key] /= totalDate.count);
    });
      
    console.log(totalDate);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="activityDate"
          render={({ field }) => <ActivityDate field={field} />}
        />

        {/* Location Field */}
        <div>
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
    </Form>
  );
}
