import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmJQwnSlnd3vaK6LT6xTfIAra9uY6eNLo",
  authDomain: "synergy-96.firebaseapp.com",
  projectId: "synergy-96",
  storageBucket: "synergy-96.firebasestorage.app",
  messagingSenderId: "702120443022",
  appId: "1:702120443022:web:faf743d8d4676c1970dddf",
  measurementId: "G-3XXZ8CN6P8"
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const firestore = getFirestore(app);

export { app, firestore };