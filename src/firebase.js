import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

console.log("plz, ", import.meta.env);
console.log("plz, ", process.env);

const config = {
  apiKey: import.meta.env.VITE_VERCEL_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_VERCEL_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_VERCEL_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_VERCEL_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_VERCEL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_VERCEL_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_VERCEL_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_VERCEL_FIREBASE_MEASUREMENT_ID,
};

firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

const usersCollection = db.collection("users");
const shelvesCollection = db.collection("shelves");
const booksCollection = db.collection("books");

const fb = {
  db,
  auth,
  currentUser,
  usersCollection,
  shelvesCollection,
  booksCollection,
};

export default fb;
