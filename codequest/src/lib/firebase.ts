import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize App Check
if (typeof window !== 'undefined') {
  // Use debug token in development, or a specific debug token set via env var (useful for Vercel)
  const debugToken = process.env.NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN;
  if (process.env.NODE_ENV !== 'production') {
    (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  } else if (debugToken) {
    (self as unknown as Record<string, unknown>).FIREBASE_APPCHECK_DEBUG_TOKEN = debugToken;
  }

  if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
    try {
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (error) {
      console.warn('App Check initialization failed:', error);
    }
  }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
