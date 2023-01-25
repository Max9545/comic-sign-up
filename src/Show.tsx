import React from 'react'
import { useEffect, useState } from 'react'

function Show(props: {day: string, time: string, pay: string, currentClub: string, availableComedian: string}) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [showTime, setShowTime] = useState()
  const [showPay, setShowPay] = useState()
  const [clubToSign, setClubToSign] = useState()
  const [comedian, setComedian] = useState()

  useEffect(() => {
    setDayOfWeek(props.day)
  },[])

  useEffect(() => {
    setShowTime(props.time)
  },[])

  useEffect(() => {
    setShowPay(props.pay)
  },[])

  useEffect(() => {
    setClubToSign(props.currentClub)
  },[props.currentClub])

  useEffect(() => {
    setComedian(props.availableComedian)
  })

  useEffect(() => {
    setAvailability(availability)
  },[])

  return (
    <div className='show'>
      <button onClick={() => {
        event?.preventDefault()
        setAvailability(!availability)
        // comedian[dayOfWeek].push(showTime)
      }} 
        className={`${availability}`}>{`${dayOfWeek}!! at ${showTime}`}</button>
    </div>
  )

}

export default Show