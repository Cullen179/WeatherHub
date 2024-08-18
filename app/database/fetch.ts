import { db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function fetchAccountData(userID: string) {
  const docRef = doc(db, 'accounts', userID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const newAccount = { widgets: [] };
    await setDoc(docRef, newAccount);

    return newAccount;
  }

  return docSnap.data();
}

export const saveDashboardData = async (userId: string, widgets: any[]) => {
  try {
    const docRef = doc(db, 'users', userId, 'dashboards', 'main');
    await setDoc(docRef, { widgets }, { merge: true });
  } catch (error) {
    console.error('Error saving dashboard data:', error);
  }
};