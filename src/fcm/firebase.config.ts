import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB8uHVXyLrfNaeNIbhDCaet52yldH7EeVU",
  authDomain: "test-147d1.firebaseapp.com",
  projectId: "test-147d1",
  storageBucket: "test-147d1.firebasestorage.app",
  messagingSenderId: "504476618424",
  appId: "1:504476618424:web:401a1d7d3deb7a9027ae4d",
  measurementId: "G-SS7LQSHK7S"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging };