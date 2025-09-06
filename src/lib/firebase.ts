'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'verdant-agenda-n0do2',
  appId: '1:413433751450:web:80ddd9e8ca74d82c81bc23',
  storageBucket: 'verdant-agenda-n0do2.firebasestorage.app',
  apiKey: 'AIzaSyDa493qgNZMOpkzvfhEwZFFEdLjPAq4dlc',
  authDomain: 'verdant-agenda-n0do2.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '413433751450',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, signInWithPopup };
