import React from 'react'
import { useEffect, useState } from 'react'

function Show(props: {key: number, day: string, time: string, pay: string, currentClub: string, availableComedian: object, date: string, id: string, headliner: string}) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState()
  const [showTime, setShowTime] = useState()
  const [showPay, setShowPay] = useState()
  const [clubToSign, setClubToSign] = useState()
  const [comedian, setComedian] = useState()
  const [date, setDate] = useState()
  const [headliner, setHeadliner] = useState()
  const [id, setId] = useState()

  useEffect(() => {
    setDayOfWeek(props.day.toLowerCase())
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

  useEffect(() => {
    setDate(props.date)
  },[])

  useEffect(() => {
    setHeadliner(props.headliner)
  })

  useEffect(() => {
    console.log(props)
    setId(props.id)
  }, [])

  const handlePay = () => {
    comedian.payAmount += parseFloat(showPay)
  }

  const handleClick = (event) => {
    event.preventDefault()
    console.log(comedian, clubToSign)
      setAvailability(!availability)
      if (!comedian[`showsAvailable${clubToSign}`][dayOfWeek].includes(showTime)) {
        comedian[`showsAvailable${clubToSign}`][dayOfWeek].push(showTime)
        handlePay()
      }
      
      
  }

  return (
    // <div className='show'>
    //   <button onClick={() => {handleClick(event)}} 
    //     className={`${availability}`}>{`${dayOfWeek} on ${date} at ${showTime} at the ${clubToSign} club for ${headliner}`}</button>
    // </div>
    <div className='show'>
    <button onClick={() => {handleClick(event)}} 
      className={`${availability}`}>{`${props.day} on ${props.date} at ${props.time} at the ${props.currentClub} club for ${props.headliner}`}{props.availableComedian.name === 'admin'  && <div>{`Pay:${props.pay}`}</div>}</button>
      
  </div>
  )

}

export default Show