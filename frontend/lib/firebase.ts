// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAnxMKG0_CcN7vzXjIpdjM1OeCz6GPCFHE",
  authDomain: "resume-builder-7d288.firebaseapp.com",
  projectId: "resume-builder-7d288",
  storageBucket: "resume-builder-7d288.appspot.com",
  messagingSenderId: "762739174513",
  appId: "1:762739174513:web:cd321a73a6b325b445bfd0"
};

// Prevent duplicate initialization in Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);