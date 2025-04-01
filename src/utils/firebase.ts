import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// const API_KEY = process.env.API_KEY;
// const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
// const PROJECT_ID = process.env.PROJECT_ID;
// const STORAGE_BUCKET = process.env.STORAGE_BUCKET;
// const MESSAGING_SENDER_ID = process.env.MESSAGING_SENDER_ID;
// const APP_ID = process.env.APP_ID;

const firebaseConfig = {
  apiKey: "AIzaSyALHCRTGr_OteRfhCis27J6ouz_JbwmcHg",
  authDomain: "management-app-5fbfa.firebaseapp.com",
  projectId: "management-app-5fbfa",
  storageBucket: "management-app-5fbfa.firebasestorage.app",
  messagingSenderId: "128507521148",
  appId: "1:128507521148:web:0a0eedf752e6158f8781f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);