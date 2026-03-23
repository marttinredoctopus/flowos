import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDxOmhPUNCp47cQ0hcispGUmubGdf7oahc',
  authDomain: 'tasksdone-c93d6.firebaseapp.com',
  projectId: 'tasksdone-c93d6',
  storageBucket: 'tasksdone-c93d6.firebasestorage.app',
  messagingSenderId: '793105215349',
  appId: '1:793105215349:web:4819e7bea7fb7e9b84ad3c',
  measurementId: 'G-37YC5J8YM0',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
