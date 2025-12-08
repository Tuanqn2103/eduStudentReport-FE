import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtH7XzmmNrS9PKHEkNCBUQMWLfdVpEMb4",
  authDomain: "edureport-24d69.firebaseapp.com",
  projectId: "edureport-24d69",
  storageBucket: "edureport-24d69.firebasestorage.app",
  messagingSenderId: "449638001072",
  appId: "1:449638001072:web:e510db0469ee3a0f314e75",
  measurementId: "G-8C43KCGZWP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);