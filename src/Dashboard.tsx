import React, { useEffect, useState } from "react" 
import { useAuthState } from "react-firebase-hooks/auth" 
import { useNavigate } from "react-router-dom" 
import "./Dashboard.css" 
import { auth, db, logout } from "./firebase" 
import { query, collection, getDocs, where } from "firebase/firestore" 
import Week  from './Week'
import { Comic, ShowToBook } from './interface'
import Admin from './Admin'
import { Link, Route, Routes } from 'react-router-dom'
import testData from './testData'


function Dashboard() {

  const [user, loading, error] = useAuthState(auth) 
  const [name, setName] = useState("")

  const [comedian, setComedian] = useState<Comic>(testData.testComedians[1])

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
      console.log(doc.docs) 
      const data = doc.docs[0].data() 
      setName(data.name) 
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching user data") 
    }
  }

  useEffect(() => {
    console.log(user)
    if (loading) return 
    if (!user) return navigate("/") 
    fetchUserName() 
  }, [user, loading]) 

  useEffect(() => {
    const toParse = localStorage.getItem('new-week')
    if (toParse !== null) {
      const parsedData = JSON.parse(toParse)
      setShows(parsedData)
    }
    
},[])  

  return (
    <div className="dashboard">
      <Week comedian={comedian} weeklyShowTimes={shows}/>
      {user?.email === 'bregmanmax91@gmail.com' && <Admin shows={shows} setShows={setShows}/>}
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