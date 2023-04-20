import React from 'react'
import { useEffect, useState } from 'react'
import { Comic } from './interface'

function Show(props: {key: number, day: string, time: string, currentClub: string, availableComedian: Comic, date: string, id: string, headliner: string, availability: boolean, setAllAvailability?: any, availableComics: []}) {

  const [availability, setAvailability] = useState(false)
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [showTime, setShowTime] = useState('')
  const [clubToSign, setClubToSign] = useState('')
  const [comedian, setComedian] = useState<Comic>({
    name: 'admin',
    id: '',
    type: '',
    showsAvailabledowntown: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    },
    showsAvailablesouth: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    },
    showsAvailabledowntownHistory: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    },
    showsAvailablesouthHistory: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    }
  }
  )

  useEffect(() => {
    setDayOfWeek(props.day.toLowerCase())
  },[])

  useEffect(() => {
    setShowTime(props.time) 
  },[])

  useEffect(() => {
    setClubToSign(props.currentClub)
  },[props.currentClub])

  useEffect(() => {
    setComedian(props.availableComedian)
  })

  useEffect(() => {
    setAvailability(props.availability)
  }, [props])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault()
      setAvailability(!availability)
      
      if (!comedian[`showsAvailable${clubToSign}`][dayOfWeek].includes(props.id)) {
        comedian[`showsAvailable${clubToSign}`][dayOfWeek].push(props.id)
        var today = new Date();
        var date = today.getFullYear() + ' - ' + (today.getMonth()+1) + ' - ' + today.getDate()
        var time = today.getHours() + " : " +  String(today.getMinutes()).padStart(2, "0")
        var dateTime = date + ' ' + time
        comedian[`showsAvailable${clubToSign}History`][dayOfWeek].push({
          id: props.id,
          day: dayOfWeek,
          time: props.time,
          club: props.currentClub,
          date: props.date,
          headliner: props.headliner,
          submissionDateTime: dateTime,
          // fireOrder: Date.now()
        })
      } else {
        comedian[`showsAvailable${clubToSign}`][dayOfWeek].splice( comedian[`showsAvailable${clubToSign}`][dayOfWeek].indexOf(props.id))

        comedian[`showsAvailable${clubToSign}History`][dayOfWeek].splice(comedian[`showsAvailable${clubToSign}History`][dayOfWeek].findIndex((showToDelete: { id: string }) => showToDelete.id === props.id))
        
      }
  }

  return (
    <div className='show'>
    {props.headliner && <button onClick={(event) => handleClick(event)} 
      className={`${availability} show-button`}>{`${props.day} on ${props.date} at ${props.time} at the ${props.currentClub.charAt(0).toUpperCase() + props.currentClub.slice(1)} club for ${props.headliner}`}</button>}
  </div>
  )

}

export default Show