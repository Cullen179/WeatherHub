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
        const weather = item.weather[0] || 'No description';
        //the object inside main
        const feelsLike = item.main.feels_like;
        const tempMin =
          item.main.temp_min !== undefined ? item.main.temp_min : 'N/A';
        const tempMax =
          item.main.temp_max !== undefined ? item.main.temp_max : 'N/A';
        const pressure = item.main.pressure;
        const seaLevel = item.main.sea_level;
        const groundLevel = item.main.grnd_level;
        const humidity = item.main.humidity;
        // tempKf = temperature correction factor
        const tempKf = item.main.temp_kf;

        const cloudCoverage =
          item.clouds.all !== undefined ? item.clouds.all + '%' : 'N/A';

        //the object inside wind
        const windSpeed =
          item.wind.speed !== undefined ? item.wind.speed + ' m/s' : 'N/A';
        const windDegree = item.wind.deg;
        const windGust = item.wind.gust;

        const visibility =
          item.visibility !== undefined
            ? item.visibility / 1000 + ' km'
            : 'N/A';
        const rainVolume =
          item.rain?.['3h'] !== undefined ? item.rain['3h'] + ' mm' : 'N/A';

        return `On ${formattedDate} at ${time}, the weather in ${city} will be ${weather} with temperatures ranging from ${tempMin}°C to ${tempMax}°C. Cloud coverage: ${cloudCoverage}. Wind speed: ${windSpeed}. Visibility: ${visibility}. Rain volume: ${rainVolume}.`;
      })
      .join('\n');

    return `The weather forecast for ${city} over the next few days is as follows:\n${forecastSummary}`;
  } else {
    return 'No forecast data available.';
  }
};

console.log('formatForecastData', formatForecastData);

// Convert messages from the Vercel AI SDK format to the format GoogleGenerativeAI expects
const buildGoogleGenAIPrompt = (
  messages: Message[],
  weatherData: any,
  forecastData: any
) => {
  const formattedMessages = messages.map((message) => ({
    role: message.role === 'user' ? 'user' : 'model',
    content: message.content,
  }));

  // Insert the weather data as the first message in the conversation
  const weatherMessage = {
    role: 'model',
    content: formatWeatherData(weatherData),
  };

  // Insert the forcast weather data as the first message in the conversation
  const weatherFocastMessage = {
    role: 'model',
    content: formatForecastData(forecastData),
  };

  // The final structure expected by the API should be an array of strings
  return [
    ...formattedMessages.map((m) => m.content),
    weatherMessage.content,
    weatherFocastMessage.content,
  ];
};

export async function POST(req: Request) {
  // Extract the body of the request
  const body = await req.json();
  console.log('body', body);

  const { messages, weatherData, forecastData } = body;

  console.log('messages', messages);

  //   if (body.forecastWeather && Array.isArray(body.forecastWeather.list)) {
  //     console.log('Forecast Data List:');
  //     body.forecastWeather.list.forEach((item: any , index: number) => {
  //       console.log(`Item ${index}:`, JSON.stringify(item, null, 2));
  //     });
  //   }

  // Ensure that messages is an array
  if (!Array.isArray(messages) || !weatherData) {
    return new NextResponse('Invalid request format', { status: 400 });
  }

  const prompt = buildGoogleGenAIPrompt(messages, weatherData, forecastData);

  const geminiStream = await genAI
    .getGenerativeModel({ model: 'gemini-pro' })
    .generateContentStream(prompt);

  // Convert the response into a friendly text-stream
  const stream = GoogleGenerativeAIStream(geminiStream);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
