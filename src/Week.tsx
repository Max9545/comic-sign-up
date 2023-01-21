import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'



function Week(clubType: string, weeklyShowTimes: []) {

  const [days, setDays] = useState([])
  const [club, setClub] = useState()

  useEffect(() => {
    setClub(clubType.clubType)
  })

  // useEffect(() => {
  //   setDays()
  // })

    return (
      <>
        <h1>{`Sign up for ${club}`}</h1>
        <Show 
        day='monday' 
        time='7:30'
        pay={25}
        />
        <Show 
        day='tuesday' 
        time='6:00'
        pay={40}
        />
        <Show 
        day='tuesday' 
        time='8:00'
        pay={40}
        />
        <Show 
        day='wednesday' 
        time='7:30'
        pay={40}
        />
        <Show 
        day='thursday' 
        time='7:30'
        pay={50}
        />
        <Show 
        day='friday' 
        time='7:30'
        pay={50}
        />
        <Show 
        day='friday' 
        time='9:30'
        pay={40}
        />
        <Show 
        day='saturday' 
        time='7:30'
        pay={40}
        />
        <Show 
        day='saturday' 
        time='9:30'
        pay={50}
        />
        <Show 
        day='sunday' 
        time='5:30'
        pay={60}
        />
      </>
    )
}

export default Week