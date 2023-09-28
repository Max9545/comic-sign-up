import { initializeApp } from "firebase/app"
import {GoogleAuthProvider, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth"
import {getFirestore, query, getDocs, collection, where, addDoc} from "firebase/firestore"
const firebaseConfig = {
  apiKey: "AIzaSyACjnVDOd0PEK3E6hjTQTyTSmIlsBY75XI",
  authDomain: "comic-availability.firebaseapp.com",
  projectId: "comic-availability",
  storageBucket: "comic-availability.appspot.com",
  messagingSenderId: "451574672103",
  appId: "1:451574672103:web:79813c41344e6baa3c1042",
  measurementId: "G-0252MMQ3YT"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

const googleProvider = new GoogleAuthProvider()

const logInWithEmailAndPassword = async (email: string, password: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password)
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid))
    const docs = await getDocs(q)
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        allowed: true
      })
    }
  } catch (err: any) {
    console.error(err);
    alert('Wrong email or password. Perhaps not an authorized comic. Hopefully soon!')
  }
}

const registerWithEmailAndPassword = async (name: string, email: string, password: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: email,
      authProvider: "local",
      email: email,
    })
  } catch (err: any) {
    console.error(err)
    alert(err.message)
  }
}

const sendPasswordReset = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    alert("Password reset link sent!")
  } catch (err: any) {
    console.error(err)
    alert(err.message)
  }
}

const logout = () => {
  signOut(auth)
}

export {
  auth,
  db,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
}