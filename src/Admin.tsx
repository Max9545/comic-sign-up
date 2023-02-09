import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { ShowToBook } from './interface'

function Admin(props: {shows: [], setShows: any}) {

  const [newSchedule, setNewSchedule] = useState<ShowToBook[]>([])
  const [showsToAdd, setShowsToAdd] = useState<any[]>([])

  const { register, handleSubmit, reset } = useForm()

  // useEffect(() => { 
  //   displayPotentialShows()
  // },[newSchedule])

  const deleteShow = (showId: string) => {
    newSchedule.splice(newSchedule.findIndex(show => show.id === showId), 1)
    setNewSchedule(newSchedule)
    displayPotentialShows()
  }

  const onSubmit = (potentialShow: any) => {
        potentialShow.id = `${potentialShow.date}${potentialShow.time}${potentialShow.headliner}${potentialShow.club}${potentialShow.pay}${potentialShow.day}`
        if (newSchedule.length === 0) {
          newSchedule.push(potentialShow)
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
    }
  }

  const displayPotentialShows = () => {setShowsToAdd(newSchedule.map((newShow, index) => {
            return (
            <div>
              <Show
                key={index}
                // speep={newShow.id}
                id={newShow.id}
                day={newShow.day}
                time={newShow.time}
                pay={newShow.pay}
                currentClub={newShow.club}
                availableComedian={{name: 'admin'}}
                date={newShow.date}
                headliner={newShow.headliner}
              />
              <button onClick={() => deleteShow(newShow.id)}>Delete</button>
            </div>
          )
}))}
 
  // const displayPotentialShows = () => {
  //   const idCheck = newSchedule.map(show => show.id)
  //   console.log(idCheck,'idCheck')
  //   const compId = showsToAdd.map(show => show.props.id)
  //   console.log(compId, 'compId', showsToAdd)
  //   if(!compId.some(r => idCheck.indexOf(r) >= 0)) {
  //     setShowsToAdd(newSchedule.map((newShow, index) => {
  //       return <Show
  //                 key={index}
  //                 id={`${newShow.date}${newShow.time}${newShow.headliner}${newShow.club}${newShow.pay}${newShow.day}`}
  //                 day={newShow.day}
  //                 time={newShow.time}
  //                 pay={newShow.pay}
  //                 currentClub={newShow.club}
  //                 availableComedian={{name: 'admin'}}
  //                 date={newShow.date}
  //                 headliner={newShow.headliner}
  //               />
  //   }))
  //   }
     
  // }

  return (
    <div>
      <p>Admin Build Week of Upcoming Shows</p>
      <button onClick={() => reset()}>Clear/Reset Form</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <select {...register('club')}>
          <option value='downtown'>Downtown</option>
          <option value='south'>South</option>
        </select>
        <label>Day</label>
        <input {...register('day')} autoFocus='true' required/>
        <label>Time</label>
        <input {...register('time')} defaultValue='8:00' required/>
        <label>Date</label>
        <input {...register('date')} required/>
        <label>Headliner</label>
        <input {...register('headliner')} required/>
        <label>Pay</label>
        <input {...register('pay')} type='number' required/>
        <label>Add Show</label>
        <input type='submit' value='Add Show'/>
      </form>
      {props.setShows && <button onClick={buildWeek}>Build Week</button>}
      {showsToAdd}
      {/* {showDisplay} */}
    </div>
  )
}

export default Admin