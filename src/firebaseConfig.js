import firebase from "firebase";
import "firebase/firestore";

const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
};
firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();
const currentUser = auth.currentUser;

const usersCollection = db.collection("users");
const shelvesCollection = db.collection("shelves");
const booksCollection = db.collection("books");

export {
  db,
  auth,
  currentUser,
  usersCollection,
  shelvesCollection,
  booksCollection
};
