//Iniciar Firebase
import { initializeApp } from "firebase/app";
//base de datos
import { getFirestore } from "firebase/firestore";
//autenticacion
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCAdFUPc_GHxCX-a8ecDRFFe_XRYH9-s0E",
  authDomain: "chicas-tec-am.firebaseapp.com",
  projectId: "chicas-tec-am",
  storageBucket: "chicas-tec-am.firebasestorage.app",
  messagingSenderId: "85027786061",
  appId: "1:85027786061:web:7102a4ace730835c5cfb04"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//exportaciones
export default app;
export { db, getAuth };