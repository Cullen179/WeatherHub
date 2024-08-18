'use client';

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const WeatherMap = () => {
  const [weatherLayerUrl, setWeatherLayerUrl] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    if (apiKey) {
      const url = `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${apiKey}`;
      setWeatherLayerUrl(url);
    } else {
      console.error("API key for OpenWeatherMap is not set.");
    }
  }, []);

  if (!weatherLayerUrl) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      center={[10, 106]} 
      zoom={9}
      scrollWheelZoom={true}
      style={{ height: "85vh", width: "100vw" }}
      {...{ center: [47.606, -122.332], zoom: 9 } as any}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <TileLayer
        attribution="OpenWeatherMap"
        url={weatherLayerUrl}
        zIndex={10}
        {...{ attribution: "OpenWeatherMap", opacity: 1, zIndex: 10 } as any}
      />
        <Marker position={[10, 106]}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>    
        </Marker>
    </MapContainer>
  );
};

export default WeatherMap;
