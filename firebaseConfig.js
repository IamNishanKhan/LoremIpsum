// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyPAszzJKXltiLg30tF3DMSEbjHnH0Kgo",
  authDomain: "rideshareapp-nk.firebaseapp.com",
  projectId: "rideshareapp-nk",
  storageBucket: "rideshareapp-nk.firebasestorage.app",
  messagingSenderId: "1045700740405",
  appId: "1:1045700740405:web:e1faa7ebdfcb13755a787c"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
