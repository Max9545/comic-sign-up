import React from 'react'
import { useEffect, useState } from 'react'
import { Comic } from './interface'

function Show(props: {key: number, day: string, time: string, pay: string, currentClub: string, availableComedian: Comic, date: string, id: string, headliner: string}) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [showTime, setShowTime] = useState('')
  const [showPay, setShowPay] = useState('')
  const [clubToSign, setClubToSign] = useState('')
  const [comedian, setComedian] = useState<Comic>({
    name: 'admin',
    id: '',
    type: '',
    showsAvailabledowntown: {
      monday: [{}],
      tuesday: [{}],
      wednesday: [{}],
      thursday: [{}], 
      friday: [{}],
      saturday: [{}],
      sunday: [{}]
    },
    showsAvailablesouth: {
      monday: [{}],
      tuesday: [{}],
      wednesday: [{}],
      thursday: [{}], 
      friday: [{}],
      saturday: [{}],
      sunday: [{}]
    },
    payAmount: 0}
  )
  const [date, setDate] = useState('')
  const [headliner, setHeadliner] = useState('')
  const [id, setId] = useState('')

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
    setId(props.id)
  }, [])

  // const handlePay = () => {
  //   comedian.payAmount += parseFloat(showPay)
  // }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      setAvailability(!availability)
      // const comicInter: {[index: string]: any} = {}
      // console.log(comedian[`showsAvailable${clubToSign}`][dayOfWeek])
      if (!comedian[`showsAvailable${clubToSign}`][dayOfWeek].includes(showTime)) {
        comedian[`showsAvailable${clubToSign}`][dayOfWeek].push({showTime: showTime, showPay: showPay})
      }
      
      
  }

  return (
    <div className='show'>
    {props.headliner && <button onClick={(event) => handleClick(event)} 
      className={`${availability}`}>{`${props.day} on ${props.date} at ${props.time} at the ${props.currentClub} club for ${props.headliner}`}{props.availableComedian.name === 'admin'  && <div>{`Pay: $${props.pay}`}</div>}</button>}
      
  </div>
  )

}

export default Show