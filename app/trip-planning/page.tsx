import WeatherMap from '../map/WeatherMap';
import Sheet from './Sheet';

export default function TripPlanning() {
  return (
    <div className="flex grow h-full">
      <div className="w-[30%] flex border-border border-r-2">
        <Sheet />
      </div>
      <div className="w-[70%] relative">
        <div className="flex flex-col absolute w-full h-full">
          <WeatherMap showSearch={false} />
        </div>
      </div>
    </div>
  );
}
