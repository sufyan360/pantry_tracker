// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYKX8ehvXugdBS4UOFhTf7pq9ltmxWRT0",
  authDomain: "inventory-managment-dba4f.firebaseapp.com",
  projectId: "inventory-managment-dba4f",
  storageBucket: "inventory-managment-dba4f.appspot.com",
  messagingSenderId: "419654179421",
  appId: "1:419654179421:web:10735bc067161884e44bb4",
  measurementId: "G-ERM0319L4J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};