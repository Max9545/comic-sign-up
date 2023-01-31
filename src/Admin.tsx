import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 

function Admin(props: {shows, setShows}) {

  const [newSchedule, setNewSchedule] = useState([])
  const [showsToAdd, setShowsToAdd] = useState([])

  const { register, handleSubmit } = useForm()

  // useEffect(() => {
  //   displayPotentialShows()
  // },[newSchedule])

  const onSubmit = potentialShow => {
        potentialShow.id = `${potentialShow.date}${potentialShow.time}${potentialShow.headliner}${potentialShow.club}${potentialShow.pay}`
    // if (newSchedule.map(show => { 
    //   console.log(potentialShow, newSchedule)
    //   if (show.id !== potentialShow.id) {
        if (newSchedule.length === 0) {
          newSchedule.push(potentialShow)
        } else {
          const idCheck = newSchedule.map(show => show.id)
          if(!idCheck.includes(potentialShow.id)) {
            newSchedule.push(potentialShow)
          }
        }
    //   }
    // })) {
    // }
    // const idCheck = newSchedule.map(show => show.id)
    // console.log(idCheck)
    // newSchedule.map(show => {
    //   if (show.id !== potentialShow.id) {
    //     newSchedule.push(potentialShow)
    //   }
    // })
  }

  const buildWeek = () => {
    props.setShows(newSchedule)
    localStorage.setItem('new-week', JSON.stringify(newSchedule))

  }
 
  const displayPotentialShows = () => {
    const idCheck = newSchedule.map(show => show.id)
    console.log(idCheck)
    const compId = showsToAdd.map(show => show.props.id)
    console.log(compId)
    if(!idCheck.some(r => compId.indexOf(r) >= 0)) {
      setShowsToAdd(newSchedule.map(newShow => {
        return <Show
                  key={Date.now()}
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
      <form onSubmit={handleSubmit(onSubmit)} value='Submit Show'>
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