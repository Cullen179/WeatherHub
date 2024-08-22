import { EmailTemplate } from '../../../components/emailTemplates/email-templates';
import { Resend } from 'resend';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    try {
        // Fetch all users from firestore
        const usersCollectionRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollectionRef);
    }
}

// function to send email to array of users
async function sendEmail(to: string[], weatherData: any) {
    try {
        const { data, error } = await resend.emails.send({
          from: 'WeatherHub <onboarding@resend.dev>',
          to: to,
          subject: 'WeatherHub Alert!',
          react: EmailTemplate({
            temperature: weatherData.temperature,
            spark: weatherData.spark,
            hurricane: weatherData.hurricane,
            fire: weatherData.fire,
            airQuality: weatherData.airQuality,
            stormRisk: weatherData.stormRisk,
          }),
        });
    
        if (error) {
          return Response.json({ error }, { status: 500 });
        }
    
        return Response.json(data);
      } catch (error) {
        return Response.json({ error }, { status: 500 });
      }
}

// function to filter users based on weather data
function checkWeatherAgainstPreferences(weatherData: any, preferences: any) {
    if (weatherData.temperature > preferences.temperature.max || weatherData.temperature < preferences.temperature.min) {
        return true;
    }

}