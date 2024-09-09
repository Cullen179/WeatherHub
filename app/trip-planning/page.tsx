import { ScrollArea } from '@/components/ui/scroll-area';
import WeatherMap from '../map/WeatherMap';
import Sheet from './Sheet';

export default function TripPlanning() {
  return (
      <div className="flex grow">
          <ScrollArea className="w-[35%] flex border-border border-r-2 pr-4 h-[calc(100vh-76.667px)]">
              <Sheet />
          </ScrollArea>

          <div className="w-[65%] relative">
              <div className="flex flex-col absolute w-full h-full">
                  {/* <WeatherMap showSearch={false} /> */}
              </div>
          </div>
      </div>
  );
}
