import SearchCity from '@/app/map/SearchCity';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { set } from 'date-fns';
import { Search } from 'lucide-react';
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
    };

    return (
        <div className="flex space-x-2">
            <Button
                type="button"
                variant={'outline'}
                onClick={() => {
                    // Example usage:
                    getCurrentLocation()
                        .then((coords: any) => {
                            setValue('lat', coords.latitude);
                            setValue('lon', coords.longitude);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                            setValue('lat', 0);
                            setValue('lon', 0);
                        });
                }}
            >
                Current Location
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button type="button">
                        <Search />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <SearchCity onCoordinatesFound={handleCoordinatesFound} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
