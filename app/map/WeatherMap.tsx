'use client';

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Adjust the import path as needed
import { cn } from "@/lib/utils"; // Utility function for class names
import  SearchCity from "./SearchCity"; // Import the SearchCity component
import { useWeather } from '@/hooks/WeatherContext';


// Fix for missing marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const WeatherInfor = [
  {
    "id": "temp_new",
    "title": "Temperature",
  },
  {
    "id": "clouds_new",
    "title": "Clouds",
  },
  {
    "id": "precipitation_new",
    "title": "Precipitation",
  },
  {
    "id": "pressure_new",
    "title": "Pressure",
  },
  {
    "id": "wind_new",
    "title": "Wind",
  },
]

const WeatherMap = ({
  showSearch = true,
  showTabs = true,
}: {
  showSearch?: boolean;
  showTabs?: boolean;
}) => {
  const [selectedLayer, setSelectedLayer] = useState<string>("temp_new");
  const [weatherLayerUrl, setWeatherLayerUrl] = useState<string | null>(null);
  const {geoLocation, setGeoLocation} = useWeather();

  const handleCoordinatesFound = (latitude: number, longitude: number) => {
    setGeoLocation({ latitude, longitude });    
  };

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (apiKey) {
      const url = `https://tile.openweathermap.org/map/${selectedLayer}/{z}/{x}/{y}.png?appid=${apiKey}`;
      setWeatherLayerUrl(url);
    } else {
      console.error("API key for OpenWeatherMap is not set.");
    }
  }, [selectedLayer]);

  if (!weatherLayerUrl) {
    return <div>Loading...</div>;
  }
 
  return (
    <>
        {/* Tabs for selecting map layers */}
        <div className="absolute right-2 z-10 flex justify-between">
          {showTabs && (
            <Tabs
              defaultValue={selectedLayer}
              onValueChange={(value) => {
                setSelectedLayer(value)
              }}
              className="p-4"
            >
              <TabsList className="flex space-x-1 rounded-md bg-white p-1">
                {WeatherInfor.map((weather) => (
                  <TabsTrigger
                    key={weather.id}
                    value={weather.id}
                    className={cn(
                      "px-3 rounded-md text-sm",
                      weather.id === selectedLayer
                        ? "bg-black text-white"
                        : "text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {weather.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          {showSearch && (
            <div className="flex items-center">
              <SearchCity onCoordinatesFound={handleCoordinatesFound} />
            </div> 
          )}
        </div>
        {/* Map Container */}
        <MapContainer
          key={geoLocation ? `${geoLocation.latitude}-${geoLocation.longitude}` : 'default'}
          center={geoLocation ? [geoLocation.latitude, geoLocation.longitude] : [10, 106]}
          zoom={6}
          scrollWheelZoom={true}
          className="relatitudeive h-full z-0"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <TileLayer
            attribution="&copy; OpenWeatherMap"
            url={weatherLayerUrl}
            zIndex={1}
          />
          <Marker position={geoLocation ? [geoLocation.latitude, geoLocation.longitude] : [10, 106]}>
            <Popup>Current Location</Popup>
          </Marker>
        </MapContainer>
    </>
  );
};

export default WeatherMap;
