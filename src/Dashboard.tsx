import React, { useEffect, useState } from "react" 
import { useAuthState } from "react-firebase-hooks/auth" 
import { useNavigate } from "react-router-dom" 
import "./Dashboard.css" 
import { auth, db, logout } from "./firebase" 
import { query, collection, getDocs, where, doc, getDoc, setDoc } from "firebase/firestore" 
import Week  from './Week'
import { Comic, ShowToBook } from './interface'
import Admin from './Admin'
import { Link, Route, Routes } from 'react-router-dom'
import testData from './testData'


function Dashboard() {

  const [user, loading, error] = useAuthState(auth) 
  const [name, setName] = useState("")

  const [comedian, setComedian] = useState<Comic>(testData.testComedians[1])

  const [weekSchedule, setWeekSchedule] = useState('')



  const [shows, setShows] = useState<[ShowToBook]>([{
    key: 0, 
    day: '', 
    time: '', 
    pay: '', 
    currentClub: '', 
    availableComedian: {}, 
    date: '', 
    id: '',
    headliner: '',
    club: ''}]) 

  const navigate = useNavigate() 

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid)) 
      const doc = await getDocs(q)
      const data = doc.docs[0].data() 
      setName(data.name) 
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching user data") 
    }
  }

  const fetchWeekForComedian = async () => {

    try {
      const docRef = query(collection(db, `shows for week`))
      const doc = await (await getDocs(docRef))
      setShows(doc.docs[0].data().thisWeek)
      console.log(doc.docs[0].data().thisWeek)
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching user data") 
    }  
}
    
    
    // try {
    //   const docRef = doc(db, 'shows for week of 2022-03-02', 'thisWeek')
    //   const docSnap = await getDoc(docRef)

    //   console.log(docSnap.data())
    // } catch (err) {
    //   console.error(err) 
    //   alert("An error occured while fetching user data") 
    // }


  useEffect(() => {
    if (loading) return 
    if (!user) return navigate("/") 
    fetchUserName() 
  }, [user, loading]) 

  useEffect(() => {
    fetchWeekForComedian()
    // const toParse = localStorage.getItem('new-week')
    // if (toParse !== null) {
    //   const parsedData = JSON.parse(toParse)
    //   setShows(parsedData)
    // }
},[])  

  return (
    <div className="dashboard">
      <Week comedian={comedian} weeklyShowTimes={shows}/>
      {user?.email === 'bregmanmax91@gmail.com' && <Admin shows={shows} setShows={setShows}
      setWeekSchedule={setWeekSchedule}/>}
      {/* <Link to={'/dashboard/admin'}>Administration</Link>
      <Link to={'/dashboard/comic'}>Comedian Portal</Link> */}
        {/* <Routes>
          <Route path='dashboard/comic' element={
              <Week 
              comedian={comedian} 
              weeklyShowTimes={shows}/>}
              />
            <Route path='dashboard/admin' element={
              <Admin shows={shows} setShows={setShows}/>
            }/>
        </Routes> */}
       <div className="dashboard__container">
        {/* <Week comedian={comedian} weeklyShowTimes={shows}/> */}
        {/* <Admin shows={shows} setShows={setShows}/> */}
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