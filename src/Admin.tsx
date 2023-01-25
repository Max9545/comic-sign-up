import { useState } from 'react'
import { useForm } from 'react-hook-form'

function Admin(shows, setShows) {

  const [newSchedule, setNewSchedule] = useState([])

  const { register, handleSubmit } = useForm()
  const onSubmit = data => {
    newSchedule.push(data)
  }

  return (
    <div>
      <p>Build Week</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Day</label>
        <input {...register('day')} />
        <label>Time</label>
        <input {...register('time')} />
        <label>Pay</label>
        <input {...register('pay')} />
        <label>Add Show</label>
        <input type='submit'/>
      </form>
    </div>
  )
}

export default Admin