// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from '@firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC-kSXCQZUa6QHSsdR_sCXZ6lbzQWIzii8",
    authDomain: "embeddedfinalproject.firebaseapp.com",
    projectId: "embeddedfinalproject",
    storageBucket: "embeddedfinalproject.appspot.com",
    messagingSenderId: "1003284314614",
    appId: "1:1003284314614:web:5735853681e536574b6fd7",
    measurementId: "G-QS2L26XGPX"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);