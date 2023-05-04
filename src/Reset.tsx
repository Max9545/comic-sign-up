import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
import React, { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { useNavigate } from "react-router-dom"
import { auth, sendPasswordReset } from "./firebase"
import "./Reset.css"
function Reset() {

  const [email, setEmail] = useState("")
  const [user, loading, error] = useAuthState(auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (user) navigate("/dashboard")
  }, [user, loading])

  const passWordResetVerify = 
  async (emailToReset: string) => {

    try {
    
    const db = getFirestore()
    
    const docRef = query(collection(db, 'users'), where('email', '==', emailToReset))

    const doc = await getDocs(docRef)

    const data = doc.docs[0].data()
    
    sendPasswordReset(emailToReset)
  
    } catch (err) {
      alert('You are not yet a verified user. Password reset not possible yet. You must first login at least once in order to reset password')
    }
  }

  return (
    <div className="reset">
      <div className="reset__container">
        <input
          type="text"
          className="reset__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <button
          className="reset__btn"
          onClick={() => passWordResetVerify(email)}
        >
          Send password reset email
        </button>
        <button onClick={() => navigate("/dashboard")} className="login__btn">Back To Sign In</button>
      </div>
    </div>
  );
}
export default Reset