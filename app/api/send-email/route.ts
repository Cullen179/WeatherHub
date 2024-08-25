import { EmailTemplate } from '../../../components/emailTemplates/email-templates';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // can replace with actual weather data with fetch api from weather api
    const notification = {type: 'temperature', value: 20, date: new Date()};

    // can add more emails to the array
    // can add more data to the object to send to the email template

    const { data, error } = await resend.emails.send({
      from: 'WeatherHub <onboarding@resend.dev>',
      to: ['s3977773@rmit.edu.vn', 's3963286@rmit.edu.vn'],
      subject: 'WeatherHub Alert!',
      react: EmailTemplate(),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
