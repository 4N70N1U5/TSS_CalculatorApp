// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, setPersistence, signInWithEmailAndPassword, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAMi1MkE8_AKKATTk5pNPDY5OX8OBd2_50",
  authDomain: "iquit-5f95e.firebaseapp.com",
  projectId: "iquit-5f95e",
  storageBucket: "iquit-5f95e.appspot.com",
  messagingSenderId: "763210831718",
  appId: "1:763210831718:web:fcce7f1c10350defa45aa7"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);  
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);