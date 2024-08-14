const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchWeatherData(lat: string, lon: string) {
  const weatherResponse = await fetch(
    `${baseUrl}/api/weather?lat=${lat}&lon=${lon}`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error('Failed to fetch weather data', error);
      return null;
    });
  return weatherResponse;
}

export async function fetchForecastData(lat: string, lon: string) {
  const forecastResponse = await fetch(
    `${baseUrl}/api/forecast?lat=${lat}&lon=${lon}`
  )
    .then((res) => res.json())
    .catch((error) => {
      console.error('Failed to fetch forecast data', error);
      return null;
    });
  return forecastResponse;
}
