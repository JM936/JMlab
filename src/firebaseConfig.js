// src/config/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Configuração do Firebase (Client-side)
const clientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Inicialização do Firebase no Client-side
let app, auth, db, storage, analytics;

if (typeof window !== 'undefined' && getApps().length === 0) {
  app = initializeApp(clientConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Analytics só é inicializado se suportado e em produção
  isSupported().then((supported) => {
    if (supported && process.env.NODE_ENV === 'production') {
      analytics = getAnalytics(app);
    }
  });
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

// Configuração para Server-side (opcional)
const serverConfig = {
  apiKey: process.env.FIREBASE_SERVER_API_KEY,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  // Não inclua authDomain para server-side
};

export { 
  app as firebaseApp,
  auth as firebaseAuth, 
  db as firestoreDB, 
  storage as firebaseStorage,
  analytics as firebaseAnalytics,
  serverConfig as firebaseServerConfig
};

// Helper para inicialização segura no SSR
export const initFirebase = () => {
  if (typeof window === 'undefined') return null;
  if (getApps().length > 0) return getApp();
  return initializeApp(clientConfig);
};