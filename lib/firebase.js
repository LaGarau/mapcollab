// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import {
//   getFirestore,
//   enableIndexedDbPersistence,
//   clearIndexedDbPersistence,
//   initializeFirestore,
// } from "firebase/firestore";
// import { getDatabase } from "firebase/database";

// //demo 3
// const firebaseConfig = {
//   apiKey: "AIzaSyDzH27bDe0h6xaze_xNNzb6co6e8xyn6Lg",
//   authDomain: "ghumanteyuwa-alpha.firebaseapp.com",
//   databaseURL: "https://ghumanteyuwa-alpha-default-rtdb.firebaseio.com",
//   projectId: "ghumanteyuwa-alpha",
//   storageBucket: "ghumanteyuwa-alpha.firebasestorage.app",
//   messagingSenderId: "536286401690",
//   appId: "1:536286401690:web:5d75b2b91dcd025cc0fb23",
//   measurementId: "G-3SSFE0L00W"
// };

// // Ensure single app instance
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// // Initialize Firebase services
// export const auth = getAuth(app);
// export const realtimeDb = getDatabase(app);

// // ✅ Use initializeFirestore for more stable persistence
// export const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true, // helps with some browsers and proxies
// });

// // ✅ Enable offline persistence safely
// if (typeof window !== "undefined") {
//   enableIndexedDbPersistence(db).catch(async (err) => {
//     if (err.code === "failed-precondition") {
//       console.warn("Firestore persistence failed — multiple tabs open.");
//     } else if (err.code === "unimplemented") {
//       console.warn("Persistence not supported by this browser.");
//     } else {
//       console.error("Error enabling persistence:", err);
//       // Fallback: clear corrupted cache once
//       try {
//         await clearIndexedDbPersistence(db);
//         console.log("Cleared corrupt Firestore cache.");
//       } catch (e) {
//         console.warn("Could not clear persistence cache:", e);
//       }
//     }
//   });
// }


import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize app (prevents duplicate init)
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize services
const db = getDatabase(app);
const auth = getAuth(app);

// ✅ Named exports
export { db, auth };

// (optional)
export default app;
