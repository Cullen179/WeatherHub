import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    console.log('Request received:', request.url);
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    console.log('Latitude:', lat);
    console.log('Longitude:', lon);

    if (!lat || !lon) {
      console.error('Latitude and longitude are required');
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error('OpenWeather API key is not set');
      return NextResponse.json(
        { error: 'OpenWeather API key is not set' },
        { status: 500 }
      );
    }

    console.log('OpenWeather API Key:', apiKey);

    const baseUrl = `http://api.openweathermap.org/data/2.5/forecast`;
    const url = `${baseUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    console.log(`Fetching weather data from: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch weather data:', errorText);
      throw new Error(`Failed to fetch weather data: ${errorText}`);
    }

    const data = await response.json();
    console.log('Weather data fetched successfully:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching weather data:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
