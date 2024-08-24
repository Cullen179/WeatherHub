export async function GET() {

  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const lat = 10.722959;
  const lon = 106.705378;
  // const baseUrl = `http://api.openweathermap.org/data/2.5/weather`;
  const baseUrl = `http://api.openweathermap.org/data/2.5/forecast`;
  // const baseUrl = `http://api.openweathermap.org/geo/1.0/reverse`;
  const url = `${baseUrl}?lat=${lat.toFixed(1)}&lon=${lon.toFixed(1)}&appid=${apiKey}&units=metric`;
  console.log(url);

  const response = await fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error('Failed to fetch weather data:', error);
      return null;
    });

  return Response.json(response);
}
