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
  const [suggestions, setSuggestions] = useState<CityCoordinates[]>([]);

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

  const fetchSuggestions = async (input: string) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${apiKey}`
      );
      if (response.data && response.data.length > 0) {
        const formattedSuggestions = response.data.map((city: any) => ({
          name: city.name,
          lat: city.lat,
          lon: city.lon
        }));
        setSuggestions(formattedSuggestions);
        setError(null);
      } else {
        setSuggestions([]);
        setError("No cities found.");
      }
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    fetchSuggestions(e.target.value);
  };
  
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={handleInputChange}
          className="w-full bg-background p-2 border rounded-md"
        />
        {suggestions.length > 0 && (
          <ul className="absolute top-[100%] z-10 w-full mt-1 bg-background overflow-auto border rounded-md max-h-40">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setCity(suggestion.name);
                  setCoordinates(suggestion);
                  setSuggestions([]);
                  onCoordinatesFound(suggestion.lat, suggestion.lon);
                }}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
        {error && <div className="absolute top-[100%] z-10 p-3 w-full mt-1 bg-background overflow-auto border rounded-md max-h-40 text-red-500">
          {error}
        </div>}
      </div>
      <Button onClick={handleSearch}>
        Search
      </Button>
    </div>
  );
};

export default SearchCity;
