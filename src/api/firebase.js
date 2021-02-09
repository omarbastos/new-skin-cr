import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  databaseURL: process.env.VUE_APP_FIREBASE_DB_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID
};

firebase.initializeApp(firebaseConfig);

// firebase utils
const faceboookProvider = new firebase.auth.FacebookAuthProvider();
faceboookProvider.setCustomParameters({
  display: "popup"
});

var googleProvider = new firebase.auth.GoogleAuthProvider();
firebase.auth().languageCode = "en";
googleProvider.setCustomParameters({
  login_hint: "user@example.com"
});

const db = firebase.firestore();
const fieldValue = firebase.firestore.FieldValue;
const timestamp = firebase.firestore.FieldValue.serverTimestamp();
const fb = firebase;
const auth = firebase.auth();
const usersCollection = db.collection("users");
const storage = firebase.storage();

export {
  faceboookProvider,
  googleProvider,
  storage,
  auth,
  usersCollection,
  fb,
  db,
  fieldValue,
  timestamp
};
