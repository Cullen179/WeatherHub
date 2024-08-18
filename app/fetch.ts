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

export async function fetchWeatherMap(lat: number, lon: number, zoom: number, mapType: string) {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

  if (!apiKey) {
    console.error('Error: OpenWeather API key is not set');
    throw new Error('OpenWeather API key is not set');
  }

  // Validate latitude and longitude
  if (lat < -90 || lat > 90) {
    throw new Error('Invalid latitude value. It must be between -90 and 90.');
  }

  if (lon < -180 || lon > 180) {
    throw new Error('Invalid longitude value. It must be between -180 and 180.');
  }

  // Validate zoom level
  if (zoom < 0 || zoom > 18) {
    console.warn('Zoom level out of typical range, setting to default value of 10');
    zoom = 10; // Default zoom level
  }

  // Validate map type
  const validMapTypes = ['clouds_new', 'precipitation_new', 'pressure_new', 'wind_new']; // Add other valid types
  if (!validMapTypes.includes(mapType)) {
    console.error(`Invalid map type: ${mapType}. Using default map type: clouds_new`);
    mapType = 'clouds_new'; // Default map type
  }

  const baseUrl = `https://tile.openweathermap.org/map`;
  const mapUrl = `${baseUrl}/${mapType}/${zoom}/${lat}/${lon}.png?appid=${apiKey}`;

  // Log the constructed URL
  console.log(`Fetching weather map from URL: ${mapUrl}`);

  try {
    const response = await fetch(mapUrl);
    if (!response.ok) {
      // Log detailed error message with the response status and text
      console.error(`Failed to fetch weather map. Status: ${response.status}, StatusText: ${response.statusText}`);
      throw new Error(`Failed to fetch weather map with status: ${response.status}`);
    }
    return mapUrl; // Return the map URL for rendering
  } catch (error: any) {
    // Log the error object with a clear label and stack trace
    console.error('Error fetching weather map:', error.message);
    console.error(error.stack);
    return null;
  }
}
