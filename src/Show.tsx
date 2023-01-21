import React from 'react'
import { useEffect, useState } from 'react'

function Show(day: string, time: string) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState()

  useEffect(() => {
    setDayOfWeek(day)
  }, [])

  return (
    <div classname='show'>
      <button onClick={() => setAvailability(!availability)} className={`${availability}`}>{`${day.day}!! at ${day.time}`}</button>
    </div>
  )

}

export default Show