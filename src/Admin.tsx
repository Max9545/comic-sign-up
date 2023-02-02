import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { ShowToBook } from './interface'

function Admin(props: {shows: [], setShows: any}) {

  const [newSchedule, setNewSchedule] = useState<ShowToBook[]>([])
  const [showsToAdd, setShowsToAdd] = useState<any[]>([])

  const { register, handleSubmit } = useForm()

  useEffect(() => { 
    displayPotentialShows()
  },[newSchedule])

  const onSubmit = (potentialShow: any) => {
        potentialShow.id = `${potentialShow.date}${potentialShow.time}${potentialShow.headliner}${potentialShow.club}${potentialShow.pay}`
        if (newSchedule.length === 0) {
          newSchedule.push(potentialShow)
        } else {
          const idCheck = newSchedule.map(show => show.id)
          if(!idCheck.includes(potentialShow.id)) {
            newSchedule.push(potentialShow)
          }
        }
  }

  const buildWeek = () => {
    props.setShows(newSchedule)
    localStorage.setItem('new-week', JSON.stringify(newSchedule))

  }
 
  const displayPotentialShows = () => {
    const idCheck = newSchedule.map(show => show.id)
    console.log(idCheck,'idCheck')
    const compId = showsToAdd.map(show => show.props.id)
    console.log(compId, 'compId', showsToAdd)
    if(!compId.some(r => idCheck.indexOf(r) >= 0)) {
      setShowsToAdd(newSchedule.map((newShow, index) => {
        return <Show
                  key={index}
                  id={`${newShow.date}${newShow.time}${newShow.headliner}${newShow.club}${newShow.pay}${newShow.day}`}
                  day={newShow.day}
                  time={newShow.time}
                  pay={newShow.pay}
                  currentClub={newShow.club}
                  availableComedian={{name: 'admin'}}
                  date={newShow.date}
                  headliner={newShow.headliner}
                />
    }))
    }
     
  }

  return (
    <div>
      <p>Build Week</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register('club')}>
          <option value='downtown'>Downtown</option>
          <option value='south'>South</option>
        </select>
        <label>Day</label>
        <input {...register('day')} />
        <label>Time</label>
        <input {...register('time')} />
        <label>Date</label>
        <input {...register('date')}/>
        <label>Headliner</label>
        <input {...register('headliner')}/>
        <label>Pay</label>
        <input {...register('pay')} />
        <label>Add Show</label>
        <input type='submit' value='Add Show' onClick={displayPotentialShows}/>
      </form>
      {props.setShows && <button onClick={buildWeek}>Build Week</button>}
      {showsToAdd}
    </div>
  )
}

export default Admin