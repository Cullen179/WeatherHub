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

export async function fetchForecastData(
  lat?: number,
  lon?: number,
  city?: string
) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenWeather API key is not set');
  }

  const baseUrl = `http://api.openweathermap.org/data/2.5/forecast`;
  let url;

  if (city !== undefined) {
    url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat !== undefined && lon !== undefined) {
    url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    throw new Error('No location data provided');
  }
  const response = await fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Failed to fetch forecast data:', error);
      return null;
    });

  return response;
}

export async function fetchCity(lat: number, lon: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    throw new Error('OpenWeather API key is not set');
  }

  const baseUrl = `http://api.openweathermap.org/geo/1.0/reverse`;
  const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`;

  const response = await fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Failed to fetch city data:', error);
      return null;
    });

  return response;
}
