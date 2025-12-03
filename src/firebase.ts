import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// CONFIG DO FIREBASE QUE O SITE TE DEU
const firebaseConfig = {
  apiKey: "AIzaSyCWPtTaAySVEV55sclM4ybHPktcRvFsnAg",
  authDomain: "tomastudy-e7c9f.firebaseapp.com",
  projectId: "tomastudy-e7c9f",
  storageBucket: "tomastudy-e7c9f.firebasestorage.app",
  messagingSenderId: "566381184194",
  appId: "1:566381184194:web:223bbd124bb62a5b97675b",
  measurementId: "G-G9G715XQ3Q",
};

// INICIALIZA O APP (SÓ UMA VEZ)
const app = initializeApp(firebaseConfig);

// SERVIÇOS
export const auth = getAuth(app);
export const db = getFirestore(app);
