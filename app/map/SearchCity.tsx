// components/SearchCity.tsx

"use client";

import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CityCoordinates {
  name: string;
  lat: number;
  lon: number;
}

interface SearchCityProps {
  onCoordinatesFound: (lat: number, lon: number) => void;
}

const SearchCity: React.FC<SearchCityProps> = ({ onCoordinatesFound }) => {
  const [city, setCity] = useState<string>("");
  const [coordinates, setCoordinates] = useState<CityCoordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );

      if (response.data && response.data.length > 0) {
        const { name, lat, lon } = response.data[0];
        setCoordinates({ name, lat, lon });
        setError(null);
        onCoordinatesFound(lat, lon); // Export the coordinates
      } else {
        setError("City not found.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <Input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full p-2 border rounded-md"
      />
      <Button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded-md">
        Search
      </Button>

      {error && <div className="text-red-500">{error}</div>}

      {coordinates && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Coordinates for {coordinates.name}:</h3>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lon}</p>
        </div>
      )}
    </div>
  );
};

export default SearchCity;
