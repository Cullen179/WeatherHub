// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAqI5l9-nQgFC7dq33UJaV3w_Cokbu8di0',
  authDomain: 'bits---weatherhub.firebaseapp.com',
  projectId: 'bits---weatherhub',
  storageBucket: 'bits---weatherhub.appspot.com',
  messagingSenderId: '378702839427',
  appId: '1:378702839427:web:5ebf03a7ff5c48fc18e5b6',
  measurementId: 'G-1K1PT2J8KK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
