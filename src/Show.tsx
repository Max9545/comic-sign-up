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

  // handlePay() = () => {

  // }

  const handleClick = () => {
      setAvailability(!availability)
      if (!comedian[`showsAvailable${clubToSign}`][dayOfWeek].includes(showTime)) {
        comedian[`showsAvailable${clubToSign}`][dayOfWeek].push(showTime)
      }
      
      event?.preventDefault()
  }

  return (
    <div className='show'>
      <button onClick={() => {handleClick()}} 
        className={`${availability}`}>{`${dayOfWeek}!! at ${showTime}`}</button>
    </div>
  )

}

export default Show