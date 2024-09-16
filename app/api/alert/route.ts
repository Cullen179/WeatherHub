import {
  collectionGroup,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { fetchForecastData } from '@/app/fetch';
import { NextResponse } from 'next/server';
import Forecast from '@/app/Forecast';

export async function POST() {
  const processedCities = new Map<string, any>(); // Map to store processed cities and their forecast data
  const dataToNotify = new Map<string[], string[]>(); // Map to store data to be notified and the users that it needs to be sent to
  const result = [];
  try {
    // Fetch all alert settings
    const alertSettingsRef = query(collectionGroup(db, 'alertSettings'));
    const querySnapshot = await getDocs(alertSettingsRef);

    // Iterate over each user
    for (const alertSettings of querySnapshot.docs) {
      const data = alertSettings.data();
      console.log('User data:', data);

      // Check if the city has already been processed
      if (!processedCities.has(data.city)) {
        // Fetch forecast data for the city
        const forecastData = await fetchForecastData(
          undefined,
          undefined,
          data.city
        );
        console.log(forecastData);
        processedCities.set(data.city, forecastData);

        // Check if the user needs to be notified
        const notifications = checkNotification(data, forecastData.list[0]);

        // Add user to the list of users that need to be notified
        if (notifications.length > 0) {
          dataToNotify.set(data.emails, notifications);
          const futureTime = new Date((forecastData.list[0].dt + forecastData.city.timezone) * 1000);
          const timeDiff = getHourMinuteDifference(
              new Date(),
              futureTime
          );
          // add date to result
          result.push({
            emails: data.emails,
            conditions: notifications,
            time: futureTime.toTimeString(),
            timeDiff: timeDiff,
          });
        }
      } else {
          // Use cached forecast data
          const forecastData = processedCities.get(data.city);

          // Check if the user needs to be notified
          const notifications = checkNotification(data, forecastData.list[0]);

          // Add all notifications to the Map
          // Add user to the list of users that need to be notified
          if (notifications.length > 0) {
              dataToNotify.set(data.emails, notifications);
              const futureTime = new Date(
                  (forecastData.list[0].dt + forecastData.city.timezone) * 1000
              );
              const timeDiff = getHourMinuteDifference(new Date(), futureTime);
              // add date to result
              result.push({
                  emails: data.emails,
                  conditions: notifications,
                  time: futureTime.toTimeString(),
                  timeDiff: timeDiff,
              });
          }
      }
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
  if (dataToNotify.size === 0) {
    return NextResponse.json([], { status: 200 });
  }
  console.log('Data to notify:', result);
  return NextResponse.json(result, { status: 200 });
}

// Sample result
// {
//   [
//     {
//       emails: ['blahblah@gmail.com'],
//       conditions: [
//         'Temperature is out of range',
//         'Humidity is out of range',
//         'Sea pressure is out of range',
//       ],
//       time: '2024-09-15T10:30:00Z',
//     },
//   ];
// }

// Function to check if the user needs to be notified and when to notify what data
function checkNotification(data: any, forecastData: any): string[] {
  // forecastData is a forecast data for the hour
  // If any forecast meets the criteria, return true along with the data that needs to be notified
  // If no forecast meets the criteria, return false

  const notifications: string[] = [];
  const temperature = forecastData.main.temp;
  const humidity = forecastData.main.humidity;
  const seaPressure = forecastData.main.sea_level;
  const visibility = forecastData.visibility / 1000; // Convert meters to kilometers
  const windSpeed = forecastData.wind.speed ? forecastData.wind.speed : 0; // Wind speed in m/s if available
  let rainChance = forecastData.pop ? forecastData.pop : 0;
  rainChance *= 100; // Convert to percentage
  const rainVolume = forecastData.rain?.['3h'] ? forecastData.rain['3h'] : 0; // Rain volume in the last 3 hours if available

  // Check if the forecast meets the criteria
  if (
    data.temperatures.noti &&
    (temperature < data.temperatures.range[0] ||
    temperature > data.temperatures.range[1])
  ) {
    // Create a EmailNotification object and add it to the notifications array
    notifications.push('Temperature is out of range');
  }
  if (
      data.humidity.noti && (
          humidity < data.humidity.range[0] || humidity > data.humidity.range[1]
      )
  ) {
      notifications.push('Humidity is out of range');
  }

  if (
    data.seaPressure.noti &&
    (seaPressure < data.seaPressure.range[0] ||
    seaPressure > data.seaPressure.range[1])
  ) {
    notifications.push('Sea pressure is out of range');
  }

  if (
    data.visibility.noti &&
    (visibility < data.visibility.range[0])) {
    notifications.push('Visibility is low');
  }

  if (
    data.windSpeed.noti &&
    (windSpeed > data.windSpeed.range[1])) {
    notifications.push('Wind speed is high');
  }

  if (
    data.rainChance.noti &&
    (rainChance > data.rainChance.range[1])) {
    notifications.push('Rain chance is high');
  }

  if (
    data.rainVolume.noti &&
    (rainVolume > data.rainVolume.range[1])) {
    notifications.push('Rain volume is high');
  }

  return notifications;
}

function getHourMinuteDifference(date1: Date, date2: Date): string {
  let diff = Math.abs(date1.getTime() - date2.getTime());
  let hours = Math.floor(diff / 1000 / 60 / 60);
  diff -= hours * 1000 * 60 * 60;
  let minutes = Math.floor(diff / 1000 / 60);
  // diff /= 60;
  let diffStr = hours === 0 ? (minutes + " minute(s)" ): (hours + " hour(s) " + minutes + " minute(s)");
  return diffStr;
  // return Math.abs(Math.round(diff));
}
