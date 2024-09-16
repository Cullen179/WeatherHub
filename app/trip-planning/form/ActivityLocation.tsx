'use client';
import SearchCity from '@/app/map/SearchCity';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useWeather } from '@/hooks/WeatherContext';
import { set } from 'date-fns';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';

export default function ActivityLocation({
    setValue,
}: {
    setValue: UseFormSetValue<any>;
}) {
    async function getCurrentLocation() {
        if (typeof window !== 'undefined' && 'geolocation' in navigator) {
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        reject(error);
                    }
                );
            });
        } else {
            console.error('Geolocation is not supported by this browser.');
            return Promise.reject(
                'Geolocation is not supported by this browser.'
            );
        }
    }

    const handleCoordinatesFound = (lat: number, lon: number) => {
        setValue('lat', lat);
        setValue('lon', lon);
        setOpen(false);
        setGeoLocation({ latitude: lat, longitude: lon });
    };

    const [open, setOpen] = useState(false);
    const { setGeoLocation } = useWeather();

    return (
        <div>
            <Dialog
                open={open}
                onOpenChange={setOpen}
            >
                <DialogTrigger asChild>
                    <Button
                        type="button"
                        variant={'outline'}
                    >
                        <Search />
                        Search Location
                    </Button>
                </DialogTrigger>
                <DialogContent className="w-fit p-10">
                    <SearchCity onCoordinatesFound={handleCoordinatesFound} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
