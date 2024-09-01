'use client';

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Adjust the import path as needed
import { cn } from "@/lib/utils"; // Utility function for class names
import  SearchCity from "./SearchCity"; // Import the SearchCity component

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

const WeatherMap = () => {
  const [selectedLayer, setSelectedLayer] = useState<string>("temp_new");
  const [weatherLayerUrl, setWeatherLayerUrl] = useState<string | null>(null);
  const [cityCoordinates, setCityCoordinates] = useState<{ lat: number; lon: number } | null>(null);

  const handleCoordinatesFound = (lat: number, lon: number) => {
    setCityCoordinates({ lat, lon });
    console.log("Coordinates found:", { lat, lon });
    // You can now use lat and lon for other purposes here
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
    <div className="flex flex-col h-svh">
      {/* Tabs for selecting map layers */}
      <div className="absolute right-[5%] z-10 flex justify-between">
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
        <div className="flex items-center p-4">
          <SearchCity onCoordinatesFound={handleCoordinatesFound} />
        </div>
      </div>
      {/* Map Container */}
      <MapContainer
        key={cityCoordinates ? `${cityCoordinates.lat}-${cityCoordinates.lon}` : 'default'}
        center={cityCoordinates ? [cityCoordinates.lat, cityCoordinates.lon] : [10, 106]} 
        zoom={6}
        scrollWheelZoom={true}
        className="relative h-[85%] z-0"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TileLayer
          attribution="&copy; OpenWeatherMap"
          url={weatherLayerUrl}
          zIndex={1}
        />
        <Marker position={cityCoordinates ? [cityCoordinates.lat, cityCoordinates.lon] : [10, 106]}>
          <Popup>Your home</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
