'use client';

import React, { FC } from 'react';
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
import { Input } from '@/components/ui/input';

import { z } from 'zod';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

import { Checkbox } from '@/components/ui/checkbox';
import {
  CloudLightning,
  Flame,
  Thermometer,
  Tornado,
  Wind,
  Zap,
} from 'lucide-react';

const formSchema = z.object({
  temperature: z.boolean().default(false).optional(),
  temperatureNoti: z.boolean().default(false).optional(),
  temperatureRange: z.number(),
  spark: z.boolean().default(false).optional(),
  sparkNoti: z.boolean().default(false).optional(),
  sparkRange: z.number(),
  hurricane: z.boolean().default(false).optional(),
  hurricaneNoti: z.boolean().default(false).optional(),
  hurricaneRange: z.number(),
  fire: z.boolean().default(false).optional(),
  fireNoti: z.boolean().default(false).optional(),
  fireRange: z.number(),
  airQuality: z.boolean().default(false).optional(),
  airQualityNoti: z.boolean().default(false).optional(),
  airQualityRange: z.number(),
  stormRisk: z.boolean().default(false).optional(),
  stormRiskNoti: z.boolean().default(false).optional(),
  stormRiskRange: z.number(),
  email: z
    .string()
    .min(1, { message: 'This field has to be filled.' })
    .email('This is not a valid email.'),
  // .refine((e) => e === "abcd@fg.com", "This email is not in our database")
});

interface AlertSettingFormProps {
  onCloseForm?: () => void;
}

const AlertForm: FC<AlertSettingFormProps> = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      temperature: false,
      temperatureNoti: false,
      temperatureRange: 50,
      spark: false,
      sparkNoti: false,
      sparkRange: 50,
      hurricane: false,
      hurricaneNoti: false,
      hurricaneRange: 50,
      fire: false,
      fireNoti: false,
      fireRange: 50,
      airQuality: false,
      airQualityNoti: false,
      airQualityRange: 50,
      stormRisk: false,
      stormRiskNoti: false,
      stormRiskRange: 50,
      email: '',
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const conditions = [
    { name: 'temperature', label: 'Temperature', icon: <Thermometer /> },
    { name: 'spark', label: 'Spark', icon: <Zap /> },
    { name: 'hurricane', label: 'Hurricane', icon: <Tornado /> },
    { name: 'fire', label: 'Fire', icon: <Flame /> },
    { name: 'airQuality', label: 'Air Quality', icon: <Wind /> },
    { name: 'stormRisk', label: 'Storm Risk', icon: <CloudLightning /> },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <table className="w-full rounded-md border">
          <thead className="border-b-2 h-16">
            <tr className="text-xl text-muted-foreground p-3">
              <th className="max-w-32">WEATHER CONDITION</th>
              <th>NOTIFICATION</th>
              <th>ACCEPTABLE RANGE</th>
              <th>AUTO</th>
            </tr>
          </thead>
          <tbody>
            {conditions.map(({ name, label, icon }) => (
              <tr
                key={name}
                className="border-b-2 h-16"
              >
                <td className="">
                  <FormLabel
                    key={label}
                    className="flex content-center align-middle gap-1 justify-center"
                  >
                    <span>{icon}</span>
                    {label}
                  </FormLabel>
                </td>
                <td>
                  <FormField
                    control={form.control}
                    name={name as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-center">
                        <FormControl>
                          <Switch
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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
                            value={[field.value as number]}
                            onValueChange={(val) => field.onChange(val[0])}
                            max={100}
                            min={0}
                            step={1}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </td>
                <td>
                  <FormField
                    control={form.control}
                    name={`${name}Noti` as keyof z.infer<typeof formSchema>}
                    render={({ field }) => (
                      <FormItem className="flex justify-center">
                        <FormControl>
                          <Checkbox
                            checked={field.value as boolean}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none"></div>
                      </FormItem>
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight pt-8">
          Recipient Details
        </h2>
        <p className="pt-1 pb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Odipti hic id
          numquam unde placeat, ipsum eius consequuntur animi a dolores neque
          dicta aspernatur adipisci!
        </p>
        <div className="flex justify-center items-center gap-4 pt-4 ">
          <p className="font-semibold">Email</p>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-5/12">
                <FormControl>
                  <Input
                    type="email"
                    className="p-4"
                    placeholder="yourname@gmail.com"
                    {...field}
                  />
                </FormControl>
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
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
};

export default AlertForm;
