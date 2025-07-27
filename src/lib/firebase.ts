// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "empowersafe-g2pno",
  appId: "1:977716741286:web:0149b23b945d4c4938a067",
  storageBucket: "empowersafe-g2pno.firebasestorage.app",
  apiKey: "AIzaSyDaV8zePW4bRZ14fst9KolJamRlJ1hz-J8",
  authDomain: "empowersafe-g2pno.firebaseapp.com",
  messagingSenderId: "977716741286"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
