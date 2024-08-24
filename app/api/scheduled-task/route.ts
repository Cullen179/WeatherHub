import { EmailTemplate } from '@/components/emailTemplates/email-templates';
import { Resend } from 'resend';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { fetchForecastData } from '@/app/fetch';
import { Hash } from 'lucide-react';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const processedCities = new Map<string, any>(); // Map to store processed cities and their forecast data
  const dataToNotify = new Map<any, string[]>(); // Map to store data to be notified and the users that it needs to be sent to

  try {
    // Fetch all alert settings
    const querySnapshot = await getDocs(collection(db, 'users'));

    // Iterate over each user
    for (const userDoc of querySnapshot.docs) {
      const alertSettingsDoc = doc(db, 'users', userDoc.id, 'alertSettings', 'data');
      const alertSettings = await getDoc(alertSettingsDoc);

      if (alertSettings.exists()) {
        const data = alertSettings.data();
        
        // Check if the city has already been processed
        if (!processedCities.has(data.city)) {
          // Fetch forecast data for the city
          const forecastData = await fetchForecastData(data.city);
          processedCities.set(data.city, forecastData);

          // Check if the user needs to be notified
          const notifications = checkNotification(data, forecastData);

          // Add user to the list of users that need to be notified
          if (notifications.length > 0) {
            for (const notification of notifications) {
              if (!dataToNotify.has(notification)) {
                dataToNotify.set(notification, []);
              }
              dataToNotify.get(notification)!.push(data.emails);
            }
          }
        } else {
          // Use cached forecast data
          const forecastData = processedCities.get(data.city);

          // Check if the user needs to be notified
          const notifications = checkNotification(data, forecastData);

          // Add user to the list of users that need to be notified
          if (notifications.length > 0) {
            for (const notification of notifications) {
              if (!dataToNotify.has(notification)) {
                dataToNotify.set(notification, []);
              }
              dataToNotify.get(notification)!.push(data.emails);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }

  // Send notifications to users
  try {
    const entries = Array.from(dataToNotify.entries());

    for (const [notification, emails] of entries) {
      const { data, error } = await resend.emails.send({
        from: 'WeatherHub <onboarding@resend.dev>',
        to: emails,
        subject: 'WeatherHub Alert!',
        react: EmailTemplate(notification),
      });

      if (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
      }
    }
    return NextResponse.json({ message: 'Notifications sent successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to send notifications:', error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}

// Function to check if the user needs to be notified and when to notify what data
function checkNotification(data: any, forecastData: any) {
  // forecastData.list is an array of forecast data for the next 5 days with 3-hour intervals
  // Check every forecast for tomorrow (7th index to 15th index)
  // If any forecast meets the criteria, return true along with the data that needs to be notified
  // If no forecast meets the criteria, return false

  const notifications = [];
  for (let i = 7; i < 16; i++) {
    const forecast = forecastData.list[i];
    const date = new Date(forecast.dt * 1000); // Convert timestamp to date
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const seaPressure = forecast.main.sea_level;
    const visibility = forecast.visibility / 1000; // Convert meters to kilometers
    const windSpeed = forecast.wind.speed ? forecast.wind.speed : 0; // Wind speed in m/s if available
    let rainChance = forecast.pop ? forecast.pop : 0;
    rainChance *= 100; // Convert to percentage
    const rainVolume = forecast.rain['3h'] ? forecast.rain['3h'] : 0; // Rain volume in the last 3 hours if available


    // Check if the forecast meets the criteria
    if (temperature < data.temperatures.range[0] || temperature > data.temperatures.range[1]) {
      notifications.push({ type: 'temperature', value: temperature, date });
    }
    if (humidity < data.humidity.range[0] || humidity > data.humidity.range[1]) {
      notifications.push({ type: 'humidity', value: humidity, date });
    }

    if (seaPressure < data.seaPressure.range[0] || seaPressure > data.seaPressure.range[1]) {
      notifications.push({ type: 'seaPressure', value: seaPressure, date });
    }

    if (visibility < data.visibility.range[0]) {
      notifications.push({ type: 'visibility', value: visibility, date });
    }

    if (windSpeed > data.windSpeed.range[1]) {
      notifications.push({ type: 'windSpeed', value: windSpeed, date });
    }

    if (rainChance > data.rainChance.range[1]) {
      notifications.push({ type: 'rainChance', value: rainChance, date });
    }

    if (rainVolume > data.rainVolume.range[1]) {
      notifications.push({ type: 'rainVolume', value: forecast.rain['3h'], date });
    }
  }

  return notifications;
}
