import React from 'react'
import { useEffect, useState } from 'react'

function Show(day: string, time: string) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState()

  useEffect(() => {
    setDayOfWeek(day)
  }, [])

  return (
    <>
      <p>{`${day.day}!! at ${day.time}`}</p>
      <button onClick={() => setAvailability(!availability)}></button>
    </>
  )

}

export default Show