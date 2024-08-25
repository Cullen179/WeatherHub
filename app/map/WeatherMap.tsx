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
      <Tabs
        value={selectedLayer}
        onValueChange={(value) => setSelectedLayer(value)}
        className="p-4 bg-gray-100"
      >
        <TabsList className="flex space-x-1 rounded-md bg-white p-1">
          <TabsTrigger
            value="temp_new"
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              selectedLayer === "temp_new"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            Temperature
          </TabsTrigger>
          <TabsTrigger
            value="clouds_new"
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              selectedLayer === "clouds_new"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            Clouds
          </TabsTrigger>
          <TabsTrigger
            value="precipitation_new"
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              selectedLayer === "precipitation_new"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            Precipitation
          </TabsTrigger>
          <TabsTrigger
            value="pressure_new"
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              selectedLayer === "pressure_new"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            Pressure
          </TabsTrigger>
          <TabsTrigger
            value="wind_new"
            className={cn(
              "px-3 py-2 rounded-md text-sm font-medium",
              selectedLayer === "wind_new"
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            Wind
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div>
        <SearchCity onCoordinatesFound={handleCoordinatesFound} />
        {cityCoordinates && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Exported Coordinates:</h3>
            <p>Latitude: {cityCoordinates.lat}</p>
            <p>Longitude: {cityCoordinates.lon}</p>
          </div>
        )}
      </div>
      {/* Map Container */}
      <MapContainer
        center={cityCoordinates ? [cityCoordinates.lat, cityCoordinates.lon] : [10, 106]} 
        zoom={9}
        scrollWheelZoom={true}
        className="flex-1"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TileLayer
          attribution="&copy; OpenWeatherMap"
          url={weatherLayerUrl}
          zIndex={10}
        />
        <Marker position={cityCoordinates ? [cityCoordinates.lat, cityCoordinates.lon] : [10, 106]}>
          <Popup>Your home</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;
