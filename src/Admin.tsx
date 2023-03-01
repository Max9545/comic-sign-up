import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { ShowToBook, WeekInter } from './interface'
import { doc, addDoc, collection } from "firebase/firestore";
import {db} from './firebase'






function Admin(props: {shows: [ShowToBook], setShows: any}) {

  const [newSchedule, setNewSchedule] = useState<ShowToBook[]>([])
  const [showsToAdd, setShowsToAdd] = useState<any[]>([])

  const { register, handleSubmit, reset } = useForm()

  const deleteShow = (showId: string) => {
    newSchedule.splice(newSchedule.findIndex(show => show.id === showId), 1)
    setNewSchedule(newSchedule)
    displayPotentialShows()
  }

  const onSubmit = (potentialShow: any) => {
        potentialShow.id = `${potentialShow.date}${potentialShow.time}${potentialShow.headliner}${potentialShow.club}${potentialShow.pay}${potentialShow.day}`
        if (newSchedule.length === 0) {
          newSchedule.push(potentialShow)
          // use (prev => […prev, new]) instead-- spread operator
        } else {
          const idCheck = newSchedule.map(show => show.id)
          if(!idCheck.includes(potentialShow.id)) {
            newSchedule.push(potentialShow)
          }
        }
        displayPotentialShows()
  }

  const buildWeek = () => {
    if (newSchedule.length > 0) {
      props.setShows(newSchedule)
      localStorage.setItem('new-week', JSON.stringify(newSchedule))
      addDoc(collection(db, `shows for Date ${new Date()}`), {thisWeek: newSchedule})
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
                pay={newShow.pay}
                currentClub={newShow.club}
                availableComedian={{
                  name: 'admin',
                  id: '',
                  type: '',
                  showsAvailabledowntown: {
                    monday: [{}],
                    tuesday: [{}],
                    wednesday: [{}],
                    thursday: [{}], 
                    friday: [{}],
                    saturday: [{}],
                    sunday: [{}]
                  },
                  showsAvailablesouth: {
                    monday: [{}],
                    tuesday: [{}],
                    wednesday: [{}],
                    thursday: [{}], 
                    friday: [{}],
                    saturday: [{}],
                    sunday: [{}]
                  },
                  payAmount: 0}
                }
                date={newShow.date}
                headliner={newShow.headliner}
              />
              <button onClick={() => deleteShow(newShow.id)}>Delete</button>
            </div>
          )
}))}

  const viewAllComicsAvailable = () => {
    console.log(localStorage)
  }

  return (
    <div>
      <button onClick={viewAllComicsAvailable}>View Available Comedians</button>
      <p>Admin Build Week of Upcoming Shows</p>
      <button onClick={() => reset()}>Clear/Reset Form</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register('club')}>
          <option value='downtown'>Downtown</option>
          <option value='south'>South</option>
        </select>
        <label>Day</label>
        <input {...register('day')} autoFocus={true} required/>
        <label>Time</label>
        <input {...register('time')} defaultValue='8:00' required/>
        <label>Date</label>
        <input {...register('date')} required/>
        <label>Headliner</label>
        <input {...register('headliner')} required/>
        <label>Pay</label>
        <input {...register('pay')} type='number' min='0' required/>
        <label>Add Show</label>
        <input type='submit' value='Add Show'/>
      </form>
      {props.setShows && <button onClick={buildWeek}>Build Week</button>}
      {showsToAdd}
    </div>
  )
}

export default Admin