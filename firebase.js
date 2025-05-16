// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBDnd4ueTFpQDJcnRGVeuA1CnTa23rNHE",
  authDomain: "publicchatapp-3138d.firebaseapp.com",
  projectId: "publicchatapp-3138d",
  storageBucket: "publicchatapp-3138d.firebasestorage.app",
  messagingSenderId: "737883314050",
  appId: "1:737883314050:web:367f7cf80ab8d6704ee19b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
