// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// optional analytics (catch errors)
try { if (typeof window !== "undefined") getAnalytics(app); } catch (e) { /* ignore */ }

export const auth = getAuth(app);
export const db = getFirestore(app);

// keep login persistent
setPersistence(auth, browserLocalPersistence).catch((e) => {
  console.warn("setPersistence error:", e?.message || e);
});

// DEBUG only — expose to window so you can inspect runtime values in the browser console
if (typeof window !== "undefined") {
  window.__FIREBASE_CONFIG__ = firebaseConfig;
  window.auth = auth;
  window.db = db;
}

export default app;
