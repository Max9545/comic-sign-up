import React, { useEffect, useState } from "react" 
import { useAuthState } from "react-firebase-hooks/auth" 
import { useNavigate } from "react-router-dom" 
import "./Dashboard.css" 
import { auth, db, logout } from "./firebase" 
import { query, collection, getDocs, where, orderBy, limit } from "firebase/firestore" 
import Week  from './Week'
import { Comic } from './interface'
import Admin from './Admin'



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
    },
    showsAvailabledowntownHistory: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    },
    showsAvailablesouthHistory: {
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

  useEffect(() => {
    fetchComicInfo()
  }, [name])

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
        },
        showsAvailabledowntownHistory: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [], 
          friday: [],
          saturday: [],
          sunday: []
        },
        showsAvailablesouthHistory: {
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

 const fetchComicInfo = async () => {

  if (name.length > 0) {
    try {
      const docRef = query(collection(db, `comediansForAdmin`), where("comedianInfo.id", "==", user?.uid))
      const doc = await (getDocs(docRef))
      const comic = await doc.docs[0].data().comedianInfo
      setComedian({
        name: comic.name,
        id: comic.id,
        type: comic.type,
        showsAvailabledowntown: comic.showsAvailabledowntown,
        showsAvailablesouth: comic.showsAvailablesouth,
        showsAvailabledowntownHistory: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [], 
          friday: [],
          saturday: [],
          sunday: []
        },
        showsAvailablesouthHistory: {
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
      // alert("An error occured while fetching user data") 
    }  
  }
 }

const viewAllComicsAvailableDowntown = async () => {

    const downtownShows = shows.filter((show: { club: string }) => show.club === 'downtown')

    for (var key in comedian.showsAvailabledowntown) {
      downtownShows.map((show: any) => {
        comedian.showsAvailabledowntown[key].map((comicShow: any) => {
          if (comicShow == show.id) {
            show.availableComics.push(name)
            show.availability = true 
          }
        })
      })
    }
  }

const viewAllComicsAvailableSouth = async () => {

  const southShows = shows.filter((show: { club: string }) => show.club === 'south')
    
  for (var key in comedian.showsAvailablesouth) {
    southShows.map((show: any) => {
      comedian.showsAvailablesouth[key].map((comicShow: any) => {
        if (comicShow == show.id) {
          // pastAvailsObj[key].push(show)
          show.availableComics.push(name)
          show.availability = true 
          }
        })
      })
    }
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