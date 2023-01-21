import React from 'react'
import { useEffect, useState } from 'react'



function Week(clubType: string, weeklyShowTimes: []) {

  const [days, setDays] = useState([])
  const [club, setClub] = useState()

  useEffect(() => {
    setClub(clubType.clubType)
  })

  useEffect(() => {
    setDays()
  })

    return (
      <>
        <h1>{`Sign up for ${club}`}</h1>

      </>
    )
}

export default Week