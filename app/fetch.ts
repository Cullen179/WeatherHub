const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function fetchWeatherData(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenWeather API key is not set');
  }

  const baseUrl = `http://api.openweathermap.org/data/2.5/weather`;
  const url = `${baseUrl}?lat=${lat.toFixed(1)}&lon=${lon.toFixed(1)}&appid=${apiKey}&units=metric`;
  console.log(url);

  const response = await fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Failed to fetch weather data:', error);
      return null;
    });

  return response;
}

export async function fetchForecastData(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenWeather API key is not set');
  }

  const baseUrl = `http://api.openweathermap.org/data/2.5/forecast`;
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const response = await fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Failed to fetch forecast data:', error);
      return null;
    });

  return response;
}
