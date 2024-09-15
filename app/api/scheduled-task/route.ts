import { EmailTemplate } from '@/components/emailTemplates/email-templates';
import { Resend } from 'resend';
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
} from 'firebase/firestore';
import { db } from '@/firebase';
import { fetchForecastData } from '@/app/fetch';
import { NextResponse } from 'next/server';
import {
  EmailNotification,
  EmailTemplateProps,
} from '@/components/emailTemplates/email-templates';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const processedCities = new Map<string, any>(); // Map to store processed cities and their forecast data
  const dataToNotify = new Map<string[], EmailTemplateProps>(); // Map to store data to be notified and the users that it needs to be sent to

  try {
    // Fetch all alert settings
    const alertSettingsRef = query(collectionGroup(db, 'alertSettings'));
    const querySnapshot = await getDocs(alertSettingsRef);

    // console.log('All alert settings:', querySnapshot.docs);

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
        processedCities.set(data.city, forecastData);

        // Check if the user needs to be notified
        const notifications = checkNotification(data, forecastData);

        // Add user to the list of users that need to be notified
        if (notifications.length > 0) {
          const emailProps = { data: notifications };
          dataToNotify.set(data.emails, emailProps);
        }
      } else {
        // Use cached forecast data
        const forecastData = processedCities.get(data.city);

        // Check if the user needs to be notified
        const notifications = checkNotification(data, forecastData);

        // Add all notifications to the Map
        if (notifications.length > 0) {
          const emailProps = { data: notifications };
          dataToNotify.set(data.emails, emailProps);
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }

  console.log('Data to notify:', dataToNotify);

  // Send notifications to users

  // EMAIL
  const entries = Array.from(dataToNotify.entries());
  try {
    // keep track of emails that have been sent
    const sentEmails = new Set<string>();

    // hard code to send to my email only

    const email: string = 's3977773@rmit.edu.vn';

    for (const [emails, notifications] of entries) {
      // check if the email has been sent
      if (sentEmails.has(email)) {
        console.log('Email already sent:', email);
        continue;
      }

      const { data, error } = await resend.emails.send({
        from: 'WeatherHub <onboarding@resend.dev>',
        to: email,
        subject: 'WeatherHub Alert!',
        react: EmailTemplate(notifications),
      });

      sentEmails.add(email);

      if (error) {
        console.error('Failed to send email:', error);
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Failed to send notifications:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }

  // SMS
  const INFOBIP_API_URL = 'https://43dgrn.api.infobip.com/sms/2/text/advanced';

  const myHeaders = new Headers();
  myHeaders.append('Authorization', `App ${process.env.INFOBIP_API_KEY}`);
  myHeaders.append('Content-Type', 'application/json');
  myHeaders.append('Accept', 'application/json');

  const raw = {
    messages: [
      {
        destinations: [{ to: '84913237666' }, { to: '84942150366' }],
        from: '447491163443',
        text: '',
      },
    ],
  };

  // Keep track of numbers that have been sent
  const sentNumbers = new Set<string>();

  for (const [emails, notifications] of entries) {
    let textData = '';
    textData += `WeatherHub Alert!\n\n`;

    for (const notification of notifications.data) {
      // Intro

      // Capitalize the first letter of the notification type
      const type =
        notification.type.charAt(0).toUpperCase() + notification.type.slice(1);
      textData += `At ${notification.date.toISOString()}, ${type} is ${notification.value}\n`;
    }

    raw.messages[0].text = textData;

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(raw),
    };

    const response = await fetch(INFOBIP_API_URL, requestOptions);
    const responseData = await response.json();
    if (response.status !== 200) {
      console.error('Failed to send SMS:', responseData);
      return NextResponse.json(
        { error: 'Failed to send SMS' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { message: 'Notifications sent successfully' },
    { status: 200 }
  );
}

// Function to check if the user needs to be notified and when to notify what data
function checkNotification(data: any, forecastData: any): EmailNotification[] {
  // forecastData.list is an array of forecast data for the next 5 days with 3-hour intervals
  // Check every forecast for tomorrow from 6 AM to 3 PM ()
  // If any forecast meets the criteria, return true along with the data that needs to be notified
  // If no forecast meets the criteria, return false

  const notifications: EmailNotification[] = [];
  const timeZoneDiff = forecastData.city.timezone; // Timezone difference in seconds
  for (let i = 5; i < 10; i++) {
    const forecast = forecastData.list[i];
    const date = new Date((forecast.dt + timeZoneDiff) * 1000); // Convert timestamp to date and add the timezone difference
    const temperature = forecast.main.temp;
    const humidity = forecast.main.humidity;
    const seaPressure = forecast.main.sea_level;
    const visibility = forecast.visibility / 1000; // Convert meters to kilometers
    const windSpeed = forecast.wind.speed ? forecast.wind.speed : 0; // Wind speed in m/s if available
    let rainChance = forecast.pop ? forecast.pop : 0;
    rainChance *= 100; // Convert to percentage
    const rainVolume = forecast.rain?.['3h'] ? forecast.rain['3h'] : 0; // Rain volume in the last 3 hours if available

    // Check if the forecast meets the criteria
    if (
      temperature < data.temperatures.range[0] ||
      temperature > data.temperatures.range[1]
    ) {
      // Create a EmailNotification object and add it to the notifications array
      notifications.push({ type: 'temperature', value: temperature, date });
    }
    if (
      humidity < data.humidity.range[0] ||
      humidity > data.humidity.range[1]
    ) {
      notifications.push({ type: 'humidity', value: humidity, date });
    }

    if (
      seaPressure < data.seaPressure.range[0] ||
      seaPressure > data.seaPressure.range[1]
    ) {
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
      notifications.push({ type: 'rainVolume', value: rainVolume, date });
    }
  }

  return notifications;
}
