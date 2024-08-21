'use server';

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { currentUser } from '@clerk/nextjs/server';

// Function to fetch user alerts
export async function fetchUserAlerts() {
  try {
    // Get user data
    const user = await currentUser();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    // Get user data from Firestore
    const userRef = doc(db, 'users', user.id, 'alertSettings', 'data');
    const userAlerts = await getDoc(userRef);

    // Return user data
    if (userAlerts.exists()) {
      return userAlerts.data();
    } else {
      return { error: 'No data found' };
    }
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Function to save form data to Firestore
export async function saveUserAlerts(formData: any) {
  try {
    if (!formData) {
      return { error: 'Bad request, no form data' };
    }

    // Get user data
    const user = await currentUser();
    if (!user) {
      return { error: 'Unauthorized' };
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
      latitude: formData.lat,
      longitude: formData.lon,
    };

    // Push form data to Firestore
    const alertSettingsRef = doc(db, 'users', user.id, 'alertSettings', 'data');
    await setDoc(alertSettingsRef, data, { merge: true });
    console.log(formData);

    // Return success message
    return { message: 'Data successfully saved' };
  } catch (error) {
    // Handle any errors
    return { error: (error as Error).message };
  }
}