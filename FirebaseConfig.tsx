import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtoY2eLNj3I5dz1czme-ObdSyPqWsbRdY",
  authDomain: "cook-book-app-614af.firebaseapp.com",
  projectId: "cook-book-app-614af",
  storageBucket: "cook-book-app-614af.appspot.com",
  messagingSenderId: "815242506005",
  appId: "1:815242506005:web:882ecce08d30f15720c31c"
};

// Initialize Firebase 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app); 

export { db, auth };