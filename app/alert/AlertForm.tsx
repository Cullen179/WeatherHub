'use client';

import { FC, useState, useEffect } from 'react';
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

import {
    Thermometer,
    Droplet,
    Waves,
    Eye,
    Wind,
    Droplets,
    Umbrella,
    Info,
} from 'lucide-react';

import { Toaster, toast } from 'sonner';

import { InputTags } from '@/components/ui/emailTags';
import { Slider } from '@/components/ui/slider';
import { fetchUserAlerts, saveUserAlerts } from './action';
import { fetchCity } from '../fetch';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

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
            temperatureRange: [18, 35],

            humidityNoti: false,
            humidityRange: [40, 60],

            seaPressureNoti: false,
            seaPressureRange: [980, 1050],

            visibilityNoti: false,
            visibilityRange: [5, 10],

            windSpeedNoti: false,
            windSpeedRange: [0, 10],

            rainChanceNoti: false,
            rainChanceRange: [0, 30],

            rainVolumeNoti: false,
            rainVolumeRange: [0, 5],

            email: [],
        },
    });

    const { resetField, reset } = form;

    // 2. Fetch the user alerts data on component mount
    useEffect(() => {
        async function loadData() {
            try {
                const {
                    emails,
                    humidity,
                    rainChance,
                    rainVolume,
                    seaPressure,
                    temperatures,
                    visibility,
                    windSpeed,
                } = await fetchUserAlerts(); // Fetch user alerts from Firestore
                
                reset({
                    temperatureNoti: temperatures.noti,
                    temperatureRange: temperatures.range, // Celsius (0 - 40)
                
                    humidityNoti: humidity.noti,
                    humidityRange: humidity.range, // Percentage (30 - 70)
                
                    seaPressureNoti: seaPressure.noti,
                    seaPressureRange: seaPressure.range, // hPa (980 - 1050)
                
                    visibilityNoti: visibility.noti,
                    visibilityRange: visibility.range, // km (1 - 20)
                
                    windSpeedNoti: windSpeed.noti,
                    windSpeedRange: windSpeed.range, // m/s (0 - 20)
                
                    rainChanceNoti: rainChance.noti,
                    rainChanceRange: rainChance.range, // % (0 - 50)
                
                    rainVolumeNoti: rainVolume.noti,
                    rainVolumeRange: rainVolume.range, // mm (0 - 50)
                    email: emails,
                }, { keepDefaultValues: true }); // Reset form with fetched data
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
            const { coords } = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                }
            );

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

    const conditions: {
        name: string;
        label: string;
        icon: JSX.Element;
        min: number;
        max: number;
        tooltip: JSX.Element;
    }[] = [
        {
            name: 'temperature',
            label: 'Temperature (°C)',
            icon: <Thermometer />,
            min: -10,
            max: 50,
            tooltip: (
                <div>
                    <h3>
                        <Thermometer /> Temperature (°C)
                    </h3>
                    <p>Safe Range: 18°C to 35°C</p>
                    <p>
                        <strong>Danger:</strong> Below -18°C (hypothermia risk)
                        or above 35°C (heatstroke risk)
                    </p>
                </div>
            ),
        },
        {
            name: 'humidity',
            label: 'Humidity (%)',
            icon: <Droplet />,
            min: 0,
            max: 100,
            tooltip: (
                <div>
                    <h3>
                        <Droplet /> Humidity (%)
                    </h3>
                    <p>Safe Range: 40% to 60%</p>
                    <p>
                        <strong>Danger:</strong> High humidity (&gt;80%)
                        increases the risk of heat-related illnesses, low
                        humidity (&lt; 20%) may cause dehydration.
                    </p>
                </div>
            ),
        },
        {
            name: 'seaPressure',
            label: 'Sea Pressure (hPa)',
            icon: <Waves />,
            min: 900,
            max: 1100,
            tooltip: (
                <div>
                    <h3>
                        <Waves /> Sea Pressure (hPa)
                    </h3>
                    <p>Safe Range: 900 hPa to 1050 hPa</p>
                    <p>
                        <strong>Danger:</strong> Sea pressure below 900 hPa may
                        indicate severe weather conditions (e.g., storms or
                        hurricanes).
                    </p>
                </div>
            ),
        },
        {
            name: 'visibility',
            label: 'Visibility (km)',
            icon: <Eye />,
            min: 0,
            max: 10,
            tooltip: (
                <div>
                    <h3>
                        <Eye /> Visibility (km)
                    </h3>
                    <p>Safe Range: 5 km to 10 km</p>
                    <p>
                        <strong>Danger:</strong> Visibility below 1 km may lead
                        to dangerous driving conditions and increase the risk of
                        accidents.
                    </p>
                </div>
            ),
        },
        {
            name: 'windSpeed',
            label: 'Wind Speed (m/s)',
            icon: <Wind />,
            min: 0,
            max: 40,
            tooltip: (
                <div>
                    <h3>
                        <Wind /> Wind Speed (m/s)
                    </h3>
                    <p>Safe Range: 0 m/s to 10 m/s</p>
                    <p>
                        <strong>Danger:</strong> Wind speeds above 20 m/s can
                        cause significant damage and pose safety risks.
                    </p>
                </div>
            ),
        },
        {
            name: 'rainChance',
            label: 'Rain Chance (%)',
            icon: <Umbrella />,
            min: 0,
            max: 100,
            tooltip: (
                <div>
                    <h3>
                        <Umbrella /> Rain Chance (%)
                    </h3>
                    <p>Safe Range: 0% to 30%</p>
                    <p>
                        <strong>Danger:</strong> Rain chances above 80% indicate
                        a strong likelihood of heavy precipitation, which could
                        lead to flooding.
                    </p>
                </div>
            ),
        },
        {
            name: 'rainVolume',
            label: 'Rain Volume (mm/h)',
            icon: <Droplets />,
            min: 0,
            max: 50,
            tooltip: (
                <div>
                    <h3>
                        <Droplets /> Rain Volume (mm/h)
                    </h3>
                    <p>Safe Range: 0 mm/h to 5 mm/h</p>
                    <p>
                        <strong>Danger:</strong> Rain volume above 30 mm/h could
                        lead to flash flooding or other dangerous conditions.
                    </p>
                </div>
            ),
        },
    ];

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div>
                    <table className="w-full rounded-md border">
                        <thead className="border-b-[1px] h-16">
                            <tr className="text-xl text-muted-foreground p-3">
                                <th>
                                    <div className="mr-8">
                                        WEATHER CONDITION
                                    </div>
                                </th>
                                <th>Notification</th>
                                <th className="w-[40%]">Acceptable Range</th>
                                <th>Recommended Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {conditions.map(
                                ({ name, label, icon, min, max, tooltip }) => (
                                    <tr
                                        key={name}
                                        className="border-b-[1px] h-16"
                                    >
                                        <td className="">
                                            <div className="flex">
                                                <FormLabel key={label}>
                                                    <div className="flex content-center items-center gap-1 ml-14">
                                                        <span>{icon}</span>
                                                        {label}
                                                        <TooltipProvider
                                                            delayDuration={100}
                                                        >
                                                            <Tooltip>
                                                                <TooltipTrigger
                                                                    asChild
                                                                >
                                                                    <Info
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                </TooltipTrigger>
                                                                <TooltipContent className="max-w-[300px]">
                                                                    {tooltip}
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </FormLabel>
                                            </div>
                                        </td>
                                        <td>
                                            <FormField
                                                control={form.control}
                                                name={
                                                    `${name}Noti` as keyof z.infer<
                                                        typeof formSchema
                                                    >
                                                }
                                                render={({ field }) => (
                                                    <FormItem className="flex justify-center">
                                                        <FormControl>
                                                            <Switch
                                                                checked={
                                                                    field.value as boolean
                                                                }
                                                                onCheckedChange={
                                                                    field.onChange
                                                                }
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
                                                name={
                                                    `${name}Range` as keyof z.infer<
                                                        typeof formSchema
                                                    >
                                                }
                                                render={({ field }) => (
                                                    <FormItem className="flex">
                                                        <FormControl>
                                                            <Slider
                                                                value={
                                                                    field.value as [
                                                                        number,
                                                                        number,
                                                                    ]
                                                                }
                                                                onValueChange={(
                                                                    val
                                                                ) =>
                                                                    field.onChange(
                                                                        val as [
                                                                            number,
                                                                            number,
                                                                        ]
                                                                    )
                                                                }
                                                                max={max}
                                                                min={min}
                                                                step={1}
                                                                minStepsBetweenThumbs={
                                                                    0
                                                                }
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
                                                        onClick={() =>
                                                            resetField(
                                                                (name +
                                                                    'Range') as keyof z.infer<
                                                                    typeof formSchema
                                                                >
                                                            )
                                                        }
                                                    >
                                                        Default
                                                    </Button>
                                                </FormControl>
                                                <div className="space-y-1 leading-none"></div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>

                <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight pt-8">
                    Recipient Emails
                </h2>
                <div className="flex justify-center items-center gap-4 pt-4 ">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="space-y-3">
                                    <FormLabel>Emails</FormLabel>
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
