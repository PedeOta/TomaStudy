import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDebwIg8ji7z13MPI9uMlNiD-_7XnFqQEQ",
  authDomain: "tomastudy-ar2205.firebaseapp.com", // ✔ correto
  projectId: "tomastudy-ar2205",
  storageBucket: "tomastudy-ar2205.appspot.com", // ✔ correto
  messagingSenderId: "491468208778",
  appId: "1:491468208778:web:72cfc5d29d404c89b20b73"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app);
