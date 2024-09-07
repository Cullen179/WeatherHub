import WeatherMap from './WeatherMap';

export default function Map() {
  return (
    <div className="relative">
      <div className="flex flex-col absolute -top-4 -left-10 w-screen h-[calc(100vh-53px)]">
        <WeatherMap />
      </div>
    </div>
  );
}
