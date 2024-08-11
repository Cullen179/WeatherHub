import { db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function fetchAccountData(userID: string) {
  const docRef = doc(db, 'accounts', userID);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const newAccount = {};
    await setDoc(docRef, newAccount);

    return newAccount;
  }

  return docSnap.data();
}
