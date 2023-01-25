import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Week from './Week'

function Admin(props: {shows, setShows}) {

  const [newSchedule, setNewSchedule] = useState([])

  const { register, handleSubmit } = useForm()
  const onSubmit = data => {
    newSchedule.push(data)
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
        <label>Pay</label>
        <input {...register('pay')} />
        <label>Add Show</label>
        <input type='submit'/>
      </form>
      {props.setShows && <button onClick={() => props.setShows(newSchedule)}>Build Week</button>}
    </div>
  )
}

export default Admin