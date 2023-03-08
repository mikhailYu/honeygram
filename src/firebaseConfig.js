import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { onValue, ref, set } from "firebase/database";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDAjq4kMCjYcew2oHMFPDT1BZBOqigNoJk",
  authDomain: "honeygram-1d5de.firebaseapp.com",
  projectId: "honeygram-1d5de",
  storageBucket: "honeygram-1d5de.appspot.com",
  messagingSenderId: "564811487501",
  appId: "1:564811487501:web:fe286970fd56d825e13844",
};

export const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const Storage = getStorage();
export const db = getDatabase();
