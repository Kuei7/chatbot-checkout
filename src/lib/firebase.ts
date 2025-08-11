
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "whatsapp-sales-bot-qtrke",
  "appId": "1:566270237270:web:96dca1890a3bd7c6ce39f7",
  "storageBucket": "whatsapp-sales-bot-qtrke.firebasestorage.app",
  "apiKey": "AIzaSyBbd-R15vwkvsRZe-kjemHgx7QSHDFwL80",
  "authDomain": "whatsapp-sales-bot-qtrke.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "566270237270"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
