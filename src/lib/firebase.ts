import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBr29Tv-VYEuDrS71_qlOPE-McAviDwpl0",
  authDomain: "among-us-game-7ea67.firebaseapp.com",
  databaseURL: "https://among-us-game-7ea67-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "among-us-game-7ea67",
  storageBucket: "among-us-game-7ea67.firebasestorage.app",
  messagingSenderId: "1051065395082",
  appId: "1:1051065395082:web:aa0aaff2b95a2dca458a73"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, onValue, remove, get };

