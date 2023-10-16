import React, { useEffect, useState } from "react" 
import { Link, useNavigate } from "react-router-dom" 
import { auth, db, logInWithEmailAndPassword } from "./firebase" 
import { useAuthState } from "react-firebase-hooks/auth" 
import "./Login.css" 
import { collection, getDocs, query, where } from "firebase/firestore"

function Login() {

  const [email, setEmail] = useState("") 
  const [password, setPassword] = useState("")
  const [user, loading, error] = useAuthState(auth)
  
  
  const navigate = useNavigate() 
  
  useEffect(() => {   
    
    if (loading) {
      // maybe trigger a loading screen
      return 
    }
    if (user) navigate("/dashboard")
  }, [user, loading]) 


  // const retrieveUser = async () => {
  //   const docRef = query(collection(db, `users`), where(`name`, "==", user?.displayName))
  //   const doc = (getDocs(docRef))
  //   const comic = (await doc).docs[0].data()
  //   console.log(comic.allowed, comic)
  //   const allowed = comic.allowed
  //   setAllowed(allowed)
  // }
  // let lastEvent: KeyboardEvent

  // document.getElementById('login')?.addEventListener('keyup', function(event) {
  //   console.log('outside', lastEvent, event)
  //   event.preventDefault()
  //   // event.keyCode === 13 
  //   if (event.key === "Enter" && lastEvent != event) {
  //     event.preventDefault()
  //     lastEvent = event
  //     document.getElementById('login__btn')?.click()
  //     console.log('enter key', event.timeStamp)
  //   }
  // })

  
  return (
    <div className="login" id="login">
      <div className="login__container" 
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          logInWithEmailAndPassword(email.trim(), password)
        }
      }}
      >
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
          autoFocus
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="login__btn"
          id="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <div>
          <Link to="/reset">Reset/Forgot Password</Link>
        </div>
      </div>
    </div>
  ) 
}
export default Login 