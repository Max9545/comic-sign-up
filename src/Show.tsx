import React from 'react'
import { useEffect, useState } from 'react'

function Show(day: string, time: string) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [showTime, setShowTime] = useState()

  useEffect(() => {
    setDayOfWeek(day.day)
    console.log(day)
  },[])

  useEffect(() => {
    setShowTime(day.time)
    console.log(time)
  },[])

  return (
    <div className='show'>
      <button onClick={() => setAvailability(!availability)} className={`${availability}`}>{`${dayOfWeek}!! at ${showTime}`}</button>
    </div>
  )

}

export default Show