import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { currentUser } from '@clerk/nextjs/server';

export async function GET() {
  // Get user data
  const user = await currentUser();
  if (!user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
    });
  }

  // Get user data from Firestore
  const alertSettingsRef = doc(db, 'users', user.id, 'alertSettings', 'data');
  const userAlerts = await getDoc(alertSettingsRef);

  // Return user data
  if (userAlerts.exists()) {
    console.log(userAlerts.data());
    return new Response(JSON.stringify(userAlerts.data()), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: 'No data found' }), {
      status: 404,
    });
  }
}

export async function POST(req: Request) {
  try {
    // Get form data
    const formData = await req.json();
    if (!formData) {
      return new Response(
        JSON.stringify({ message: 'Bad request, no form data' }),
        { status: 400 }
      );
    }

    // Get user data
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    }

    // Prepare data for Firestore
    const data = {
      emails: formData.email,
      temperatures: {
        noti: formData.temperatureNoti,
        range: formData.temperatureRange,
      },
      sparks: {
        noti: formData.sparkNoti,
        range: formData.sparkRange,
      },
      hurricanes: {
        noti: formData.hurricaneNoti,
        range: formData.hurricaneRange,
      },
      fires: {
        noti: formData.fireNoti,
        range: formData.fireRange,
      },
      airQualities: {
        noti: formData.airQualityNoti,
        range: formData.airQualityRange,
      },
      stormRisks: {
        noti: formData.stormRiskNoti,
        range: formData.stormRiskRange,
      },
    };

    // Push form data to Firestore
    const alertSettingsRef = doc(db, 'users', user.id, 'alertSettings', 'data');
    await setDoc(alertSettingsRef, data, { merge: true });

    // Return success response
    return new Response(
      JSON.stringify({ message: 'Data successfully saved' }),
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors
    return new Response(
      JSON.stringify({ message: 'Internal server error', error: error }),
      { status: 500 }
    );
  }
}
