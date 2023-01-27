import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Week from './Week'

function Admin(props: {shows, setShows}) {

  const [newSchedule, setNewSchedule] = useState([])

  const { register, handleSubmit } = useForm()
  const onSubmit = data => {
    newSchedule.push(data)
  }

  const buildWeek = () => {
    props.setShows(newSchedule)
    localStorage.setItem('new-week', JSON.stringify(newSchedule))

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
        <input type='submit' value='Add Show'/>
      </form>
      {props.setShows && <button onClick={buildWeek}>Build Week</button>}
    </div>
  )
}

export default Admin