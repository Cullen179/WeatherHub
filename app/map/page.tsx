'use client';

import { useEffect, useState } from 'react';
import { fetchWeatherMap } from '../fetch';
import Image from 'next/image';

const WeatherMap = () => {
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeatherMap = async () => {
      const lat = 10; 
      const lon = 106; 
      const zoom = 9; 
      const mapType = 'clouds_new'; 

      try {
        const url = await fetchWeatherMap(lat, lon, zoom, mapType);
        if (url) {
          setMapUrl(url);
        } else {
          setError('Failed to load weather map');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getWeatherMap();
  }, []);

  if (loading) return <p>Loading weather map...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Weather Map</h1>
      {mapUrl && (
        <Image
            src={mapUrl}
            alt="Weather Map"
            width={600}  
            height={400} 
            layout="responsive" 
            objectFit="contain" 
        />
        )}
    </div>
  );
};

export default WeatherMap;
