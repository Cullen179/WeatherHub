import { fetchForecastData } from '@/app/fetch';

export async function GET() {
  // const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  // // const lat = 10.722959;
  // // const lon = 106.705378;
  // const city = 'Ho Chi Minh City';
  // const baseUrl = `http://api.openweathermap.org/data/2.5/weather`;
  // // // const baseUrl = `http://api.openweathermap.org/data/2.5/forecast`;
  // // // const baseUrl = `http://api.openweathermap.org/geo/1.0/reverse`;
  // // const url = `${baseUrl}?lat=${lat.toFixed(1)}&lon=${lon.toFixed(1)}&appid=${apiKey}&units=metric`;
  // const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`;
  // // console.log(url);
  // // const response = await fetch(url)
  // //   .then((response) => response.json())
  // //   .catch((error) => {
  // //     console.error('Failed to fetch weather data:', error);
  // //     return null;
  // //   });
  // // return Response.json(response);
  // // const city = 'Ho Chi Minh City';
  // // const forecastData = await fetchForecastData(undefined, undefined, city);
  // const dt = 1724557822;
  // const timezone = 25200;
  // const date = new Date((dt + timezone) * 1000);
  // console.log(date);
  // return Response.json(response);
}
