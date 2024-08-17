'use client'
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WeatherInfo } from '@/type/weatherInfo';
import Modal from './modal';

export default function WeatherModals() {
  // const weatherInfos = WeatherInfo.map((info) => info.type);
  return (
    <div className="grid grid-cols-3 gap-3">
      {WeatherInfo.map((info) => (
        <Dialog key={info.type}>
          <DialogTrigger asChild>
            <Button variant="outline">{info.type}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[60%] p-10">
            <DialogHeader>
              <DialogTitle>{`${info.type} (${info.unit})`}</DialogTitle>
              <DialogDescription>{info.definition}</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px]">
              <Modal
                key={info.type}
                info={info}
              />
            </ScrollArea>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
