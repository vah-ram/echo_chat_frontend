importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB8uHVXyLrfNaeNIbhDCaet52yldH7EeVU",
  authDomain: "test-147d1.firebaseapp.com",
  projectId: "test-147d1",
  storageBucket: "test-147d1.firebasestorage.app",
  messagingSenderId: "504476618424",
  appId: "1:504476628424:web:401a1d7d3deb7a9027ae4d"
});

const messaging = firebase.messaging();