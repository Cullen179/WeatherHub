'use client';

import React, { FC, useState } from 'react';
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
  X,
  Zap,
} from 'lucide-react';

import { Toaster, toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  temperatureNoti: z.boolean().default(false).optional(),
  temperatureRange: z.array(z.number()).length(2),

  sparkNoti: z.boolean().default(false).optional(),
  sparkRange: z.array(z.number()).length(2),

  hurricaneNoti: z.boolean().default(false).optional(),
  hurricaneRange: z.array(z.number()).length(2),

  fireNoti: z.boolean().default(false).optional(),
  fireRange: z.array(z.number()).length(2),

  airQualityNoti: z.boolean().default(false).optional(),
  airQualityRange: z.array(z.number()).length(2),

  stormRiskNoti: z.boolean().default(false).optional(),
  stormRiskRange: z.array(z.number()).length(2),
  email: z.string().email(),
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
      temperatureRange: [25, 50], // Default range with two numbers

      sparkNoti: false,
      sparkRange: [25, 50], // Default range with two numbers

      hurricaneNoti: false,
      hurricaneRange: [25, 50], // Default range with two numbers

      fireNoti: false,
      fireRange: [25, 50], // Default range with two numbers

      airQualityNoti: false,
      airQualityRange: [25, 50], // Default range with two numbers

      stormRiskNoti: false,
      stormRiskRange: [25, 50], // Default range with two numbers
      email: '',
    },
  });

  const { reset, getValues, setValue, resetField } = form;

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (emails.length === 0) {
      toast.error('At least one email is required');
      return;
    }
    toast.success('Form submitted successfully');
    console.log({ ...values, emails });
  }
  const [emails, setEmails] = useState<string[]>([]);

  const onAddEmail = () => {
    const email = getValues('email');
    if (!email || emails.includes(email)) {
      toast.error('Invalid or duplicate email');
      return;
    }
    setEmails((prev) => [...prev, email]);
    setValue('email', '');
  };

  const onRemoveEmail = (email: string) => {
    setEmails((prev) => prev.filter((m) => m !== email));
  };

  const [isChecked, setIsChecked] = useState(false);
  const [previousValue, setPreviousValue] = useState(false);

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
        <div className="">
          <table className="w-full rounded-md border">
            <thead className="border-b-2 h-16">
              <tr className="text-xl text-muted-foreground p-3">
                <th className="max-w-12">
                  <div className="mr-12">WEATHER CONDITION</div>
                </th>
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
                              max={100}
                              min={0}
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
                        <Checkbox
                          onClick={() => {
                            if (isChecked) {
                              // If currently checked and clicking to uncheck, revert to previous value
                              setIsChecked(previousValue);
                            } else {
                              // If currently unchecked and clicking to check, update previous value and check
                              setPreviousValue(isChecked);
                              setIsChecked(true);
                            }
                            // Perform other actions on change
                            resetField(
                              `${name}Range` as keyof z.infer<typeof formSchema>
                            );
                            resetField(
                              `${name}Noti` as keyof z.infer<typeof formSchema>
                            );
                          }}
                        />
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
              <FormItem className="w-5/12">
                <div className="flex items-center gap-3">
                  <FormLabel htmlFor="name">Email</FormLabel>
                  <Input
                    id="email"
                    className="flex-1 py-4"
                    placeholder="yourname@gmail.com"
                    {...field}
                  />
                  <Button
                    type="button"
                    onClick={onAddEmail}
                    variant="secondary"
                  >
                    Add
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center flex-wrap gap-1">
            {emails.map((email) => (
              <Badge
                key={email}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <p>{email}</p>
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => onRemoveEmail(email)}
                />
              </Badge>
            ))}
          </div>
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
