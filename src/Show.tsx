import React from 'react'
import { useEffect, useState } from 'react'

function Show(day: string, time: string, pay: string, currentClub: string, comedian: string) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [showTime, setShowTime] = useState()
  const [showPay, setShowPay] = useState()
  const [clubToSign, setClubToSign] = useState()
  const [availableComedian, setAvailableComedian] = useState(comedian)

  useEffect(() => {
    setDayOfWeek(day.day)
  },[])

  useEffect(() => {
    setShowTime(day.time)
  },[])

  useEffect(() => {
    setShowPay(day.pay)
  },[])

  useEffect(() => {
    setClubToSign(day.currentClub)
  },[])

  // useEffect(() => {
  //   setAvailableComedian(availableComedian)
  // },[])

  return (
    <div className='show'>
      <button onClick={() => setAvailability(!availability)} className={`${availability}`}>{`${dayOfWeek}!! at ${showTime}`}</button>
    </div>
  )

}

export default Show