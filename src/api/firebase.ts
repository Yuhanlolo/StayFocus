import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: 'your-api-key',
  authDomain: 'your-auth-domain',
  projectId: 'your-project-id',
  storageBucket: 'your-storage',
  messagingSenderId: 'your-id',
  appId: 'your-id',
};

export const app = initializeApp(firebaseConfig);
