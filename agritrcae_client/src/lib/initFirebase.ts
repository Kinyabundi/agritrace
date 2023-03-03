import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJuyCf9hVbwhEmv9MUdjEhZM3ZI4nO7FM",
  authDomain: "agritrace-83ee5.firebaseapp.com",
  projectId: "agritrace-83ee5",
  storageBucket: "agritrace-83ee5.appspot.com",
  messagingSenderId: "426146281212",
  appId: "1:426146281212:web:170db301a48e21481b8979",
  measurementId: "G-07EWP0YTHN",
};

// Init firebase

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { app, db };
