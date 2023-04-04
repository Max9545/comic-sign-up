import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { ShowToBook, WeekInter } from './interface'
import { doc, addDoc, collection, query, getDocs, collectionGroup, DocumentData } from "firebase/firestore";
import {db} from './firebase'

function Admin(props: {shows: [ShowToBook], setShows: any, setWeekSchedule: any}) {

  const [newSchedule, setNewSchedule] = useState<ShowToBook[]>([])
  const [showsToAdd, setShowsToAdd] = useState<any[]>([])
  const [day, setDay] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  const [availableDownttownMonday, setAvailableDownttownMonday] = useState<any[]>([])
  const [availableDownttownTuesday, setAvailableDownttownTuesday] = useState<any[]>([])
  const [availableDownttownWednesday, setAvailableDownttownWednesday] = useState<any[]>([])
  const [availableDownttownThursday, setAvailableDownttownThursday] = useState<any[]>([])
  const [availableDownttownFriday, setAvailableDownttownFriday] = useState<any[]>([])
  const [availableDownttownSaturday, setAvailableDownttownSaturday] = useState<any[]>([])
  const [availableDownttownSunday, setAvailableDownttownSunday] = useState<any[]>([])


  const [availableSouthMonday, setAvailableSouthMonday] = useState<any[]>([])
  const [availableSouthTuesday, setAvailableSouthTuesday] = useState<any[]>([])
  const [availableSouthWednesday, setAvailableSouthWednesday] = useState<any[]>([])
  const [availableSouthThursday, setAvailableSouthThursday] = useState<any[]>([])
  const [availableSouthFriday, setAvailableSouthFriday] = useState<any[]>([])
  const [availableSouthSaturday, setAvailableSouthSaturday] = useState<any[]>([])
  const [availableSouthSunday, setAvailableSouthSunday] = useState<any[]>([])
  //object in state for each club
  const [trigger, setTrigger] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    displayPotentialShows()
  }, [newSchedule])

  useEffect(() => {
    viewAllComicsAvailable()
  },[props])

  const deleteShow = (showId: string) => {
    newSchedule.splice(newSchedule.findIndex(show => show.id === showId), 1)
    setNewSchedule(newSchedule)
    displayPotentialShows()
  }

  const onSubmit = (potentialShow: any) => {
        potentialShow.id = `${date}${time}${potentialShow.headliner}${potentialShow.club}${day}`
        potentialShow.day = day
        potentialShow.date = date
        potentialShow.time = time
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
              <button className='delete-show' onClick={() => deleteShow(newShow.id)}>Delete</button>
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

      props.shows.map(show => {
          
              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownMonday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Monday') {
                availableDownttownMonday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownMonday(availableDownttownMonday)
              }

              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownTuesday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Tuesday') {
                availableDownttownTuesday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownTuesday(availableDownttownTuesday)
              }

              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownWednesday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Wednesday') {
                availableDownttownWednesday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownWednesday(availableDownttownWednesday)
              }

              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownThursday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Thursday') {
                availableDownttownThursday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownThursday(availableDownttownThursday)
              }

              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownFriday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Friday') {
                availableDownttownFriday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownFriday(availableDownttownFriday)
              }

              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownSaturday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Saturday') {
                availableDownttownSaturday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownSaturday(availableDownttownSaturday)
              }

              if (comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].includes(show.id) && !availableDownttownSunday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Sunday') {
                availableDownttownSunday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableDownttownSunday(availableDownttownSunday)
              }


              if (comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].includes(show.id) && !availableSouthMonday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Monday') {
                availableSouthMonday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableSouthMonday(availableSouthMonday)
              }

              if (comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].includes(show.id) && !availableSouthTuesday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Tuesday') {
                availableSouthTuesday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableSouthTuesday(availableSouthTuesday)
              }

              if (comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].includes(show.id) && !availableSouthWednesday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Wednesday') {
                availableSouthWednesday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableSouthWednesday(availableSouthWednesday)
              }

              if (comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].includes(show.id) && !availableSouthThursday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Thursday') {
                availableSouthThursday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableSouthThursday(availableSouthThursday)
              }

              if (comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].includes(show.id) && !availableSouthFriday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Friday') {
                availableSouthFriday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableSouthFriday(availableSouthFriday)
              }

              if (comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].includes(show.id) && !availableSouthSaturday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Saturday') {
                availableSouthSaturday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableSouthSaturday(availableSouthSaturday)
              }

              if (comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].includes(show.id) && !availableSouthSunday.includes(`${comedian.comedianInfo.name}: ${show.time}`) && show.day === 'Sunday') {
                availableSouthSunday.push(`${comedian.comedianInfo.name}: ${show.time}`)
                setAvailableSouthSunday(availableSouthSunday)
              }
          })
        setTrigger(!trigger)
      })
    } catch (err) {
      console.error(err) 
      alert("An error occured while fetching comedian data") 
    }  
  }

  const showDay = (numDate: string) => {
    setDate(numDate)
    const dateProto = new Date(numDate).getDay()
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    setDay(daysOfWeek[dateProto])
  }

  const showTime = (rawTime: string) => {
    const numTime = parseInt(rawTime)
    if (numTime === 0) {
      setTime(`12:${rawTime.substring(3)}AM`)
    } else if (numTime > 12) {
      const newNum = numTime - 12
      setTime(`${newNum.toString()}:${rawTime.substring(3)}PM`)
    } else if (numTime == 12) {
      setTime(`${rawTime}PM`)
    } else {
      setTime(`${rawTime}AM`)
    }
  }

  return (
    <div className='admin-form'>
      {/* <button onClick={viewAllComicsAvailable}>View Available Comedians</button> */}
      <p className='admin-build'>Admin Build Week of Upcoming Shows</p>
      <button className='clear-form' onClick={() => reset()}>Clear/Reset Form</button>
      <form className='admin-input' onSubmit={handleSubmit(onSubmit)}>
        <select className='club-select' {...register('club')}>
          <option value='downtown'>Downtown</option>
          <option value='south'>South</option>
        </select>
        <label className='date'>Date:</label>
        <input className='day' {...register('date')} type='date' required onChange={(event) => showDay(event.target.value)}/>
        <div className='day-of-week' >{` which is a ${day}`}</div>
        <div>
        <label>Time: </label>
        <input className='time-input' {...register('time')} type='time' onChange={(event) => showTime(event?.target.value)}  required/>
        </div>
        <div>
        <label>Headliner: </label>
        <input className='headliner-input' {...register('headliner')} required/>
        </div>
        {/* <label className='add-show'>Add Show</label> */}
        <input type='submit' value='Add Show' className='add-show'/>
      </form>
      {props.setShows && <button onClick={buildWeek} className='build-week'>Build Week</button>}
      {showsToAdd}
      <div>
      <h2 className='downtown-available-header'>Downtown Available Comics</h2>
      <section className='available-comics'>
        <div className='available'>Available Downtown Monday: {availableDownttownMonday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Tuesday: {availableDownttownTuesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Wednesday: {availableDownttownWednesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Thursday: {availableDownttownThursday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Friday: {availableDownttownFriday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Saturday: {availableDownttownSaturday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Sunday: {availableDownttownSunday.map(e => <p>{`${e}`}</p>)}</div>
      </section>
      <h2 className='south-available-header'>South Club Available Comics</h2>
      <section className='available-comics'>
        <div className='available'>Available South Monday: {availableSouthMonday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Tuesday: {availableSouthTuesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Wednesday: {availableSouthWednesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Thursday: {availableSouthThursday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Friday: {availableSouthFriday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Saturday: {availableSouthSaturday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Sunday: {availableSouthSunday.map(e => <p>{`${e}`}</p>)}</div>
      </section>
      </div>
    </div>
  )
}

export default Admin