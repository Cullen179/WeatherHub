import { createContext, useContext } from 'react';

export const WeatherContext = createContext<any>(null);

export const useWeather = () => {
  return useContext(WeatherContext);
};
