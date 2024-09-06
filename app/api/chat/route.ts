'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAIStream, Message, StreamingTextResponse } from 'ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

const formatWeatherData = (weatherData: any) => {
  console.log('weatherData', weatherData);
  return `The weather in ${weatherData.name}, ${weatherData.sys.country} is currently ${weatherData.weather[0].description} with a temperature of ${weatherData.main.temp}°C, feeling like ${weatherData.main.feels_like}°C. The wind speed is ${weatherData.wind.speed} m/s coming from ${weatherData.wind.deg}°.`;
};

// Helper function to format the forecast data
const formatForecastData = (forecastData: any) => {
  console.log('Received forecastData:', forecastData);

  if (forecastData && forecastData.city && Array.isArray(forecastData.list)) {
    const city = forecastData.city.name;

    const forecastSummary = forecastData.list
      .map((item: any, index: number) => {
        console.log(`Item ${index}:`, JSON.stringify(item, null, 2));
        const date = new Date(item.dt * 1000); // Convert timestamp to Date object
        const formattedDate = date.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        });
        const time = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        });

        // const description = item.weather[0].description || 'No description';
        const weather = item.weather[0];
        //the object inside main
        const temperature = item.main.feels_like + '°C';
        const tempMin = item.main.temp_min + '°C';
        const tempMax = item.main.temp_max + '°C';
        const pressure = item.main.pressure + 'hPa';
        const seaLevel = item.main.sea_level + 'hPa';
        const groundLevel = item.main.grnd_level + 'hPa';
        const humidity = item.main.humidity + '%';
        // tempKf = temperature correction factor
        const tempKf = item.main.temp_kf + '°C';

        const cloudCoverage = item.clouds.all + '%';

        //the object inside wind
        const windSpeed = item.wind.speed + ' m/s';
        const windDegree = item.wind.deg + ' m/s';
        const windGust = item.wind.gust + '°';

        const visibility = item.visibility / 1000 + ' km';
        const rainVolume = item.rain?.['3h'] + ' mm';

        return `On ${formattedDate} at ${time}, the weather in ${city} will be ${weather} with temperatures ranging from ${tempMin}°C to ${tempMax}°C.The temperature is ${temperature} Cloud coverage: ${cloudCoverage}. Wind speed: ${windSpeed}. Visibility: ${visibility}. Rain volume: ${rainVolume}.`;
      })
      .join('\n');

    return `The weather forecast for ${city} over the next few days is as follows:\n${forecastSummary}`;
  } else {
    return 'No forecast data available.';
  }
};

const isWeatherRelated = (message: string) => {
  const weatherKeywords = [
    'weather',
    'forecast',
    'temperature',
    'rain',
    'wind',
    'cloud',
    'conditions',
    'humidity',
    'storm',
    'thunderstorm',
    'snow',
    'hail',
    'precipitation',
    'sunshine',
    'sunny',
    'fog',
    'mist',
    'frost',
    'freeze',
    'breeze',
    'gust',
    'cyclone',
    'hurricane',
    'tornado',
    'drought',
    'drizzle',
    'dew',
    'lightning',
    'visibility',
    'barometer',
    'UV index',
  ];

  return weatherKeywords.some((keyword) =>
    message.toLowerCase().includes(keyword)
  );
};

const buildGoogleGenAIPrompt = (
  messages: Message[],
  weatherData: any,
  forecastData: any
) => {
  return {
    contents: messages
      .filter(
        (message) => message.role === 'user' || message.role === 'assistant'
      )
      .map((message) => {
        const isWeather = isWeatherRelated(message.content);
        const weatherMessage = isWeather
          ? formatWeatherData(weatherData)
          : null;
        const forecastMessage = isWeather
          ? formatForecastData(forecastData)
          : null;

        const parts = [
          { text: message.content },
          ...(weatherMessage ? [{ text: weatherMessage }] : []),
          ...(forecastMessage ? [{ text: forecastMessage }] : []),
        ];

        return {
          role: message.role === 'user' ? 'user' : 'model',
          parts,
        };
      }),
  };
};

export async function POST(req: Request) {
  // Extract the body of the request
  const body = await req.json();

  const { messages, weatherData, forecastData } = body;

  // Ensure that messages is an array
  if (!Array.isArray(messages) || !weatherData) {
    return new NextResponse('Invalid request format', { status: 400 });
  }

  const message = buildGoogleGenAIPrompt(messages, weatherData, forecastData);

  const geminiStream = await genAI
    .getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        candidateCount: 1,
        temperature: 1.0,
      },
    })
    .generateContentStream(message);

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
