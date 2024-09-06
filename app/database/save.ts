import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export async function saveDashboardData(userID: string, widgets: any[]) {
  const docRef = doc(db, 'accounts', userID);
  await setDoc(docRef, { widgets }, { merge: true });
}
