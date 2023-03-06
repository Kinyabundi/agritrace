import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../env";

// Init firebase

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { app, db };
