'use client';

import React, { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { z } from 'zod';
import { Switch } from '@/components/ui/switch';

import { Checkbox } from '@/components/ui/checkbox';
import {
  Thermometer,
  Droplet,
  Waves,
  Eye,
  Wind,
  Droplets,
  Umbrella,
} from 'lucide-react';

import { Toaster, toast } from 'sonner';

import { InputTags } from '@/components/ui/emailTags';
import { Slider } from '@/components/ui/slider';
import { fetchUserAlerts, saveUserAlerts } from './action';
import { fetchCity } from '../fetch';

const formSchema = z.object({
  temperatureNoti: z.boolean().default(false).optional(),
  temperatureRange: z.array(z.number()).length(2), // Celsius (0 - 40)

  humidityNoti: z.boolean().default(false).optional(),
  humidityRange: z.array(z.number()).length(2), // Percentage (30 - 70)

  seaPressureNoti: z.boolean().default(false).optional(),
  seaPressureRange: z.array(z.number()).length(2), // hPa (980 - 1050)

  visibilityNoti: z.boolean().default(false).optional(),
  visibilityRange: z.array(z.number()).length(2), // km (1 - 20)
                  
  windSpeedNoti: z.boolean().default(false).optional(),
  windSpeedRange: z.array(z.number()).length(2), // m/s (0 - 20)

  rainChanceNoti: z.boolean().default(false).optional(),
  rainChanceRange: z.array(z.number()).length(2), // % (0 - 50)

  rainVolumeNoti: z.boolean().default(false).optional(),
  rainVolumeRange: z.array(z.number()).length(2), // mm (0 - 50)
  email: z
    .array(z.string().email({ message: 'Invalid email address' }))
    .nonempty('At least one email is required'),
});

interface AlertSettingFormProps {
  onCloseForm?: () => void;
}

const AlertForm: FC<AlertSettingFormProps> = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperatureNoti: false,
      temperatureRange: [0, 40],

      humidityNoti: false,
      humidityRange: [30, 70], 

      seaPressureNoti: false,
      seaPressureRange: [980, 1050],

      visibilityNoti: false,
      visibilityRange: [1, 20],

      windSpeedNoti: false,
      windSpeedRange: [0, 20],

      rainChanceNoti: false,
      rainChanceRange: [0, 50],

      rainVolumeNoti: false,
      rainVolumeRange: [0, 50],

      email: [],
    },
  });

  const { resetField, reset } = form;

  // 2. Fetch the user alerts data on component mount
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUserAlerts(); // Fetch user alerts from Firestore
        console.log(data);
        reset(data); // Reset form with fetched data
      } catch (error) {
        toast.error(`Failed to load data: ${(error as Error).message}`);
      }
    }
    loadData();
  }, [reset]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Fetch geolocation
      const { coords } = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      // Include city in form data
      console.log(coords);
      const response = await fetchCity(coords.latitude, coords.longitude);
      console.log(response);
      const formDataWithLocation = {
        ...values,
        city: response[0].name,
      };

      await saveUserAlerts(formDataWithLocation); // Save form data directly to Firestore
      toast.success('Form submitted successfully');
    } catch (error) {
      toast.error(`Failed to submit form: ${(error as Error).message}`);
    }
  }

  const [isChecked, setIsChecked] = useState(false);
  const [previousValue, setPreviousValue] = useState(false);

  const conditions = [
    { name: 'temperature', label: 'Temperature (°C)', icon: <Thermometer />, min: -10, max: 50 },
    { name: 'humidity', label: 'Humidity (%)', icon: <Droplet />, min: 0, max: 100 },
    { name: 'seaPressure', label: 'Sea Pressure (hPa)', icon: <Waves />, min: 900, max: 1100 },
    { name: 'visibility', label: 'Visibility (km)', icon: <Eye />, min: 0, max: 10 },
    { name: 'windSpeed', label: 'Wind Speed (m/s)', icon: <Wind />, min: 0, max: 40 },
    { name: 'rainChance', label: 'Rain Chance (%)', icon: <Umbrella />, min: 0, max: 100 },
    { name: 'rainVolume', label: 'Rain Volume (mm/h)', icon: <Droplets />, min: 0, max: 50 },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="">
          <table className="w-full rounded-md border">
            <thead className="border-b-2 h-16">
              <tr className="text-xl text-muted-foreground p-3">
                <th className="max-w-12">
                  <div className="mr-12">WEATHER CONDITION</div>
                </th>
                <th>Notification</th>
                <th>Acceptable Range</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map(({ name, label, icon, min, max }) => (
                <tr
                  key={name}
                  className="border-b-2 h-16"
                >
                  <td className="">
                    <div className="flex">
                      <FormLabel key={label}>
                        <div className="flex content-center items-center gap-1 ml-14">
                          <span>{icon}</span>
                          {label}
                        </div>
                      </FormLabel>
                    </div>
                  </td>
                  <td>
                    <FormField
                      control={form.control}
                      name={`${name}Noti` as keyof z.infer<typeof formSchema>}
                      render={({ field }) => (
                        <FormItem className="flex justify-center">
                          <FormControl>
                            <Switch
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none"></div>
                        </FormItem>
                      )}
                    />
                  </td>

                  <td className="pr-3">
                    <FormField
                      control={form.control}
                      name={`${name}Range` as keyof z.infer<typeof formSchema>}
                      render={({ field }) => (
                        <FormItem className="flex">
                          <FormControl>
                            <Slider
                              value={field.value as [number, number]}
                              onValueChange={(val) =>
                                field.onChange(val as [number, number])
                              }
                              max={max}
                              min={min}
                              step={1}
                              minStepsBetweenThumbs={0}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </td>

                  <td>
                    <div className="flex justify-center">
                      <FormControl>
                        <Button
                          type="reset"
                          onClick={() => resetField(name + 'Range')}
                        >
                          Default
                        </Button>
                      </FormControl>
                      <div className="space-y-1 leading-none"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight pt-8">
          Recipient Details
        </h2>
        <p className="pt-1 pb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odipti hic id
          numquam unde placeat, ipsum eius consequuntur animi a dolores neque
          dicta aspernatur adipisci!
        </p>
        <div className="flex justify-center items-center gap-4 pt-4 ">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-3">
                  <FormLabel>Email</FormLabel>
                  <InputTags
                    className="pr-8 py-4"
                    placeholder="email@gmail.com"
                    {...field}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-4 justify-end mt-12 mb-12">
          <Button
            variant="secondary"
            className="font-semibold"
            type="button"
            onClick={() => form.reset()}
          >
            Cancel
          </Button>
          <Button type="submit">
            <Toaster richColors />
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AlertForm;
