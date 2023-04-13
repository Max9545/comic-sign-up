import React, { useEffect, useState } from "react" 
import { useAuthState } from "react-firebase-hooks/auth" 
import { useNavigate } from "react-router-dom" 
import "./Dashboard.css" 
import { auth, db, logout } from "./firebase" 
import { query, collection, getDocs, where, doc, getDoc, setDoc, orderBy, limit, collectionGroup, DocumentData } from "firebase/firestore" 
import Week  from './Week'
import { Comic, ShowToBook } from './interface'
import Admin from './Admin'
import { Link, Route, Routes } from 'react-router-dom'
import testData from './testData'
import ShowWithAvails from "./ShowWithAvails"


function Dashboard() {

  const [user, loading, error] = useAuthState(auth) 
  const [name, setName] = useState("")
  const [admin, setAdmin] = useState(false)
  const [signedShowsDown, setSignedShowsDown] = useState<any[]>([])
  const [signedShowsSouth, setSignedShowsSouth] = useState<any[]>([])
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
  const [trigger, setTrigger] = useState(true)
  const [shows, setShows] = useState<any>([]) 

  const navigate = useNavigate() 

  useEffect(() => {
    viewAllComicsAvailableDowntown()
    viewAllComicsAvailableSouth()
  }, [comedian])

  useEffect(() => {
    if (loading) return 
    if (!user) return navigate("/") 
    fetchUserName() 
  }, [user, loading]) 

  useEffect(() => {
    fetchWeekForComedian()
    
}, [user])  

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid)) 
      const doc = await getDocs(q)
      const data = doc.docs[0].data()
      setName(data.name)
      setAdmin(data.admin)
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
console.log('hi')
    try {
      const docRef = query(collection(db, "comedians"),where("comedianInfo.id", "==", user?.uid))
      const doc = await (getDocs(docRef))
      console.log(doc.docs[0].data().comedianInfo.showsAvailabledowntown)
      const comic = await doc.docs[0].data().comedianInfo
      setComedian({
        name: comic.name,
        id: comic.id,
        type: comic.type,
        showsAvailabledowntown: comic.showsAvailabledowntown,
        showsAvailablesouth: comic.showsAvailablesouth
      })
      console.log(comedian, comic)
    } catch (err) {
      console.error(err) 
      // alert("An error occured while fetching user data") 
    }  
    console.log('bye')
  }

  const fetchWeekForComedian = async () => {

    try {
      const docRef = query(collection(db, `shows for week`), orderBy('fireOrder', 'desc'), limit(1))
      const doc = await (getDocs(docRef))
      setShows(doc.docs[0].data().thisWeek)
      console.log(doc.docs[0].data())
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching user data") 
    }  
}

const viewAllComicsAvailableDowntown = async () => {

  const downtownShows = shows.filter((show: { club: string }) => show.club === 'downtown')

  const docRef = query(collectionGroup(db, `comedians`))
  const doc = await (getDocs(docRef))
  
    const availableComics: DocumentData[] = []
    
    doc.docs.forEach(comic => availableComics.push(comic.data()))

    shows.map((show: { day: string; id: string; availableComics: any[] }) => {
        const availabeComedians: any[] = []
        availableComics.map((comedian, index) => {
            console.log(show, comedian)
              comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].map((downTownShow: string) => {
                if (show.id == downTownShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
                  availabeComedians.push(comedian.comedianInfo.name)
                  show.availableComics = availabeComedians
                }
              })
        })
      })
}

const viewAllComicsAvailableSouth = async () => {

  const southShows = shows.filter((show: { club: string }) => show.club === 'south')

  const docRef = query(collectionGroup(db, `comedians`))
  const doc = await (getDocs(docRef))
  
    const availableComics: DocumentData[] = []
    
    doc.docs.forEach(comic => availableComics.push(comic.data()))
    shows.map((show: { day: string; id: string; availableComics: any[] }) => {
        const availabeComedians: any[] = []
        availableComics.map((comedian) => {
            
              comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].map((southShow: string) => {
                if (show.id == southShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
                  availabeComedians.push(comedian.comedianInfo.name)
                  show.availableComics = availabeComedians
                }
              })
        })
      })
}


  return (
    <div className="dashboard">
      <Week comedian={comedian} weeklyShowTimes={shows}/>
      {admin && <Admin shows={shows} setShows={setShows}
      setWeekSchedule={setWeekSchedule}/>}
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