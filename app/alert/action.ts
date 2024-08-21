import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';
import { currentUser } from '@clerk/nextjs/server';

// Function to fetch user alerts
export async function fetchUserAlerts() {
  // Get user data
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }

  // Get user data from Firestore
  const userRef = doc(db, 'users', user.id);
  const userAlerts = await getDoc(userRef);

  // Return user data
  if (userAlerts.exists()) {
    return userAlerts.data();
  } else {
    throw new Error('No data found');
  }
}

// Function to save form data to Firestore
export async function saveUserAlerts(formData: any) {
  // Get user data
  const user = await currentUser();
  if (!user) {
    throw new Error('Unauthorized');
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
  const userRef = doc(db, 'users', user.id);
  await setDoc(userRef, data, { merge: true });

  return 'Data successfully saved';
}
