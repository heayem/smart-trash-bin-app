import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, remove, onValue } from 'firebase/database';
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKrvPTDE_YSFrbOLlwaIi-iM9ge-Pchz0",
  authDomain: "training-smart-trash-bin.firebaseapp.com",
  projectId: "training-smart-trash-bin",
  storageBucket: "training-smart-trash-bin.appspot.com",
  messagingSenderId: "296309931657",
  appId: "1:296309931657:web:0c7f0c04ed7e66ab44d058",
  measurementId: "G-MPY8Y3K9DJ",
  databaseURL: "https://training-smart-trash-bin-default-rtdb.asia-southeast1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Auth with persistence using AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { database, ref, get, set, update, remove, onValue, auth, signInWithEmailAndPassword, signOut };
