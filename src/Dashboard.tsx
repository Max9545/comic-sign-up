import React, { useEffect, useState } from "react" 
import { useAuthState } from "react-firebase-hooks/auth" 
import { useNavigate } from "react-router-dom" 
import "./Dashboard.css" 
import { auth, db, logout } from "./firebase" 
import { query, collection, getDocs, where, orderBy, limit, getFirestore, setDoc, doc, deleteDoc } from "firebase/firestore"
import Week  from './Week'
import { Comic } from './interface'
import Admin from './Admin'
import { updateProfile, User } from "firebase/auth"

function Dashboard() {

  const [user, loading, error] = useAuthState(auth) 
  const [name, setName] = useState('')
  const [admin, setAdmin] = useState(false)
  const [weekOrder, setWeekOrder] = useState('')
  const [comedian, setComedian] = useState<Comic>({
    name: '',
    id: '',
    type: '',
    email: '',
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
    if(!user.displayName && !admin) {
      const db = getFirestore()
      const newName = window.prompt('Please enter your first and last name as you want the club to see them. This is requiered to move forward and enter the website')
      setName(newName ? newName : '')
      if (newName == '' || newName == null) return navigate("/")
      if (newName.length > 0 && newName != '' && newName != null) {
        makeUserName(user, newName)
      } else {
        navigate("/")
      }
    } else {
      fetchUserName()
    }
  }, [user, loading]) 

  useEffect(() => {
    fetchWeekForComedian()
  }, [user])  

  useEffect(() => {
    fetchComicInfo()
  }, [name])

  const makeUserName = async (user: any, newNameToUse: any) => {
    const docToDelete = query(collection(db, `users`), where("email", "==", user?.email))
    const docD = await (getDocs(docToDelete))
    await deleteDoc(doc (db,"users", docD.docs[0].id))
    await updateProfile(user, {displayName: newNameToUse})
    await setDoc(doc(db, `users/${user.uid}`), {name: newNameToUse, email: user.email, uid: user.uid, type: 'pro' })
    await fetchUserName()
  }   

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
        email: data.email,
        type: data.type,
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
    }
  }

  const fetchWeekForComedian = async () => {

    try {
      const docRef = query(collection(db, `shows for week`), orderBy('fireOrder', 'desc'), limit(1))
      const doc = await (getDocs(docRef))
      setShows(doc.docs[0].data().thisWeek)
      setWeekOrder(doc.docs[0].data().fireOrder)
    } catch (err) {
      console.error(err) 
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
        type: comedian.type,
        email: user?.email,
        showsAvailabledowntown: comic.showsAvailabledowntown,
        showsAvailablesouth: comic.showsAvailablesouth,
        showsAvailabledowntownHistory: comic.showsAvailabledowntownHistory,
        showsAvailablesouthHistory: comic.showsAvailablesouthHistory
      })
    } catch (err) {
      console.error(err) 
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
          show.availableComics.push(name)
          show.availability = true 
          }
        })
      })
    }
  }


  return (
    <div className="dashboard">
      <div className="dashboard__container">
        Logged in as {name}
         <div>{user?.email}</div>
         <button className="dashboard__btn" onClick={logout}>
          Logout
         </button>
       </div>
      <p className='available-example'>This red color means you are AVAILABLE to be booked for the this show</p>
      <p className='not-available-example'>This blue color means you are NOT available to be booked for this show</p>
      <input
          type="userName"
          className="login__textBox userName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="User Name If First Time"
      />
      {!admin && <Week comedian={comedian} weeklyShowTimes={shows} admin={admin} fetchWeekForComedian={fetchWeekForComedian} weekOrder={weekOrder}/>}
      {admin && <Admin shows={shows} setShows={setShows}
      setWeekSchedule={setWeekSchedule} comedian={comedian} weeklyShowTimes={shows} admin={admin} fetchWeekForComedian={fetchWeekForComedian} weekOrder={weekOrder} user={user}/>}
       
     </div>
  ) 
} 
export default Dashboard 