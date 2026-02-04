// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDPK_loJ5tU4V6OnGCBomdcJYfkHUK6bco",
  authDomain: "lifeboarding-5172a.firebaseapp.com",
  projectId: "lifeboarding-5172a",
  storageBucket: "lifeboarding-5172a.firebasestorage.app",
  messagingSenderId: "664884481317",
  appId: "1:664884481317:web:06fe747eadbe5de7ffdecc",
  measurementId: "G-8J4TZEFESL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth=getAuth(app);
export const db=getFirestore(app);