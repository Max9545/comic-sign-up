import React, { useEffect, useState } from "react" 
import { useAuthState } from "react-firebase-hooks/auth" 
import { useNavigate } from "react-router-dom" 
import "./Dashboard.css" 
import { auth, db, logout } from "./firebase" 
import { query, collection, getDocs, where, doc, getDoc, setDoc, orderBy, limit } from "firebase/firestore" 
import Week  from './Week'
import { Comic, ShowToBook } from './interface'
import Admin from './Admin'
import { Link, Route, Routes } from 'react-router-dom'
import testData from './testData'


function Dashboard() {

  const [user, loading, error] = useAuthState(auth) 
  const [name, setName] = useState("")
  const [admin, setAdmin] = useState(false)
  const [comedian, setComedian] = useState<Comic>({
    name: '',
    id: '',
    type: '',
    showsAvailabledowntown: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    }, 
    showsAvailablesouth: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    }
  }
)

  const [weekSchedule, setWeekSchedule] = useState('')

  const [shows, setShows] = useState<any>([]) 

  const navigate = useNavigate() 

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid)) 
      const doc = await getDocs(q)
      const data = doc.docs[0].data()
      setName(data.name)
      setAdmin(data.admin)
      console.log(data)
      setComedian({
        name: data.name,
        id: data.uid,
        type: '',
        showsAvailabledowntown: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [], 
          friday: [],
          saturday: [],
          sunday: []
        }, 
        showsAvailablesouth: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [], 
          friday: [],
          saturday: [],
          sunday: []
        }
      })
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching user data") 
    }
  }

  const fetchWeekForComedian = async () => {

    try {
      const docRef = query(collection(db, `shows for week`), orderBy('fireOrder', 'desc'), limit(1))
      const doc = await (getDocs(docRef))
      setShows(doc.docs[0].data().thisWeek)
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching user data") 
    }  
}
    
  useEffect(() => {
    if (loading) return 
    if (!user) return navigate("/") 
    fetchUserName() 
  }, [user, loading]) 

  useEffect(() => {
    fetchWeekForComedian()
}, [])  

  return (
    <div className="dashboard">
      <Week comedian={comedian} weeklyShowTimes={shows}/>
      {admin && <Admin shows={shows} setShows={setShows}
      setWeekSchedule={setWeekSchedule}/>}
      {/* {user?.email === 'bregmanmax91@gmail.com' && <p>Current Week Shown To Comedians</p>}
      <Week comedian={comedian} weeklyShowTimes={shows}/>
      {user?.email === 'bregmanmax91@gmail.com' && <Admin shows={shows} setShows={setShows}
      setWeekSchedule={setWeekSchedule}/>} */}
       <div className="dashboard__container">
        Logged in as
         <div>{name}</div>
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
     </div>
  ) 
} 
export default Dashboard 