import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { ShowToBook, WeekInter } from './interface'
import { doc, addDoc, collection, query, getDocs, collectionGroup, DocumentData } from "firebase/firestore";
import {db} from './firebase'

function Admin(props: {shows: [ShowToBook], setShows: any, setWeekSchedule: any}) {

  const [newSchedule, setNewSchedule] = useState<ShowToBook[]>(props.shows)
  const [showsToAdd, setShowsToAdd] = useState<any[]>([])
  const [day, setDay] = useState('')
  const [availableDownttownFriday, setAvailableDownttownFriday] = useState<any[]>([])
  const [availableDownttownSaturday, setAvailableDownttownSaturday] = useState<any[]>([])
  const [availableDownttownSunday, setAvailableDownttownSunday] = useState<any[]>([])
  const [trigger, setTrigger] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    displayPotentialShows()
  }, [newSchedule])

  useEffect(() => {
    viewAllComicsAvailable()
  })

  const deleteShow = (showId: string) => {
    newSchedule.splice(newSchedule.findIndex(show => show.id === showId), 1)
    setNewSchedule(newSchedule)
    displayPotentialShows()
  }

  const onSubmit = (potentialShow: any) => {
        potentialShow.id = `${potentialShow.date}${potentialShow.time}${potentialShow.headliner}${potentialShow.club}${day}`
        potentialShow.day = day
        props.setWeekSchedule(potentialShow.week)
          const idCheck = newSchedule.map(show => show.id)
          if(!idCheck.includes(potentialShow.id)) {
            setNewSchedule([...newSchedule, potentialShow])
          }
        displayPotentialShows()
  }

  const buildWeek = () => {
    if (newSchedule.length > 0) {
      props.setShows(newSchedule)
      addDoc(collection(db, `shows for week`), {fireOrder: Date.now(), thisWeek: newSchedule})
      setNewSchedule([])
      setShowsToAdd([])
    }
  }

  const displayPotentialShows = () => {setShowsToAdd(newSchedule.map((newShow, index) => {
            return (
            <div key={index}>
              <Show
                key={index}
                id={newShow.id}
                day={newShow.day}
                time={newShow.time}
                currentClub={newShow.club}
                availableComedian={{
                  name: 'admin',
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
                  }}
                }
                date={newShow.date}
                headliner={newShow.headliner}
                availability={false}
              />
              <button onClick={() => deleteShow(newShow.id)}>Delete</button>
            </div>
          )
}))}

  const viewAllComicsAvailable = async () => {

    try {
      const docRef = query(collectionGroup(db, `comedians`))
      const doc = await (getDocs(docRef))
    
      const availableComics: DocumentData[] = []
      
      doc.docs.forEach(comic => availableComics.push(comic.data()))


      availableComics.map((comedian, index) => {

       console.log(availableComics)
      //  const tempProps = props.shows
      //  tempProps.splice(0,1)
      props.shows.map(show => {
          
          console.log(comedian.comedianInfo.showsAvailabledowntown[show.day.toLowerCase()], index, 'show:', show.id)
              // console.log(comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`][index])
              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownFriday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Friday') {
                availableDownttownFriday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownFriday(availableDownttownFriday)
                console.log('success!!!', show, comedian, availableDownttownFriday)
      
              }

              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownSaturday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Saturday') {
                availableDownttownSaturday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownSaturday(availableDownttownSaturday)
                
                console.log('success!!!', show, comedian, availableDownttownSaturday)
              }
              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownSunday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Sunday') {
                availableDownttownSunday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownSunday(availableDownttownSunday)
              }
          // return {
          //   day: show.day,
          //   time: show.time
            // }
          })
        setTrigger(!trigger)
        // return comedian.comedianInfo
        // return {
        //   comedian: comedian.comedianInfo.name,
        //   downtown: Object.entries(comedian.comedianInfo.showsAvailabledowntown),
        //   south: comedian.comedianInfo.showsAvailablesouth
        // }
      })
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching comedian data") 
    }  
  }

  const showDay = (numDate: string) => {
    
    const dateProto = new Date(numDate).getDay()
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    setDay(daysOfWeek[dateProto])
  }

  return (
    <div className='admin-form'>
      <button onClick={viewAllComicsAvailable}>View Available Comedians</button>
      <section className='downtown-available-comics'>
      <div className='available'>Available Downtown Friday: {availableDownttownFriday.map(e => <p>{`${e}, `}</p>)}</div>
      <div>Available Downtown Saturday: {availableDownttownSaturday.map(e => <p>{`${e}, `}</p>)}</div>
      <div>Available Downtown Sunday: {availableDownttownSunday.map(e => <p>{`${e}, `}</p>)}</div>
      </section>
      <p>Admin Build Week of Upcoming Shows</p>
      <button onClick={() => reset()}>Clear/Reset Form</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register('club')}>
          <option value='downtown'>Downtown</option>
          <option value='south'>South</option>
        </select>
        <label>Date</label>
        <input {...register('date')} type='date' required onChange={(event) => showDay(event.target.value)}/>
        <div>{` which is a ${day}`}</div>
        <label>Time</label>
        <input {...register('time')} type='time' required/>
        <label>Headliner</label>
        <input {...register('headliner')} required/>
        <label>Add Show</label>
        <input type='submit' value='Add Show'/>
      </form>
      {props.setShows && <button onClick={buildWeek}>Build Week</button>}
      {showsToAdd}
    </div>
  )
}

export default Admin