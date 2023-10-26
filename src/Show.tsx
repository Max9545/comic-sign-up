import React from 'react'
import { useEffect, useState } from 'react'
import { Comic } from './interface'

function Show(props: {key: number, day: string, time: string, currentClub: string, availableComedian: Comic, setCurrentComedian: any, date: string, id: string, headliner: string, availability: boolean, setAllAvailability?: any, availableComics: [], supportStatus: string, familyFriendly: any, clean: any}) {

  const [availability, setAvailability] = useState(props.availability)
  const [dayOfWeek, setDayOfWeek] = useState('')
  const [showTime, setShowTime] = useState('')
  const [clubToSign, setClubToSign] = useState('')
  const [comedian, setComedian] = useState<Comic>(props.availableComedian
  //   {
  //   name: 'admin',
  //   id: '',
  //   type: '',
  //   email: '',
  //   downTownShowCount: 0,
  //   southShowCount: 0,
  //   downTownWeekCount: 0,
  //   southWeekCount: 0,
  //   showsAvailabledowntown: {
  //     monday: [],
  //     tuesday: [],
  //     wednesday: [],
  //     thursday: [], 
  //     friday: [],
  //     saturday: [],
  //     sunday: []
  //   },
  //   showsAvailablesouth: {
  //     monday: [],
  //     tuesday: [],
  //     wednesday: [],
  //     thursday: [], 
  //     friday: [],
  //     saturday: [],
  //     sunday: []
  //   },
  //   showsAvailabledowntownHistory: {
  //     monday: [],
  //     tuesday: [],
  //     wednesday: [],
  //     thursday: [], 
  //     friday: [],
  //     saturday: [],
  //     sunday: []
  //   },
  //   showsAvailablesouthHistory: {
  //     monday: [],
  //     tuesday: [],
  //     wednesday: [],
  //     thursday: [], 
  //     friday: [],
  //     saturday: [],
  //     sunday: []
  //   }
  // }
  )

  useEffect(() => {
    setDayOfWeek(props.day.toLowerCase())
  }, [props])

  useEffect(() => {
    setShowTime(props.time) 
  },[])

  useEffect(() => {
    setClubToSign(props.currentClub)
  },[props.currentClub])

  // useEffect(() => {
  //   setComedian(props.availableComedian)
  //   // comedian = props.availableComedian
  //   // console.log(props.availableComedian, comedian)
  // }, [props.availableComedian])

  useEffect(() => {
    // console.log(comedian)
    setComedian(props.availableComedian)
    // console.log(comedian)
  }, [availability, props, clubToSign])

  useEffect(() => {
    // props.availableComics.includes(comedian.name)
    setAvailability(props.availableComics.includes(props.availableComedian.name))
    console.log(props.availability, props.availableComics.includes(comedian.name))
    
  }, [props.availability])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {

        event.preventDefault()
        setAvailability(!availability)
        
        if (!comedian[`showsAvailable${clubToSign}`][dayOfWeek].includes(props.id)) {
          comedian[`showsAvailable${clubToSign}`][dayOfWeek].push(props.id)
          console.log( comedian[`showsAvailable${clubToSign}`][dayOfWeek])
          var today = new Date();
          var date = today.getFullYear() + '-' + (today.getMonth()+1) + '-' + today.getDate()
          var time = today.getHours() + ":" +  String(today.getMinutes()).padStart(2, "0")
          var dateTime = date + ' ' + time
          comedian[`showsAvailable${clubToSign}History`][dayOfWeek].push({
            id: props.id,
            day: dayOfWeek,
            time: props.time,
            club: props.currentClub,
            date: props.date,
            headliner: props.headliner,
            submissionDateTime: dateTime,
            fireOrder: Date.now()
          })
          comedian[`showsAvailable${clubToSign}History`][dayOfWeek] = comedian[`showsAvailable${clubToSign}History`][dayOfWeek].sort((a: { time: string },b: { time: string }) => {
            return parseInt(a.time.replaceAll(':','')) - parseInt(b.time.replaceAll(':',''))
          })
          props.setCurrentComedian(comedian)
        } else {
          console.log(comedian[`showsAvailable${clubToSign}`][dayOfWeek])
          comedian[`showsAvailable${clubToSign}`][dayOfWeek].splice(comedian[`showsAvailable${clubToSign}`][dayOfWeek].indexOf(props.id))
          comedian[`showsAvailable${clubToSign}History`][dayOfWeek].splice(comedian[`showsAvailable${clubToSign}History`][dayOfWeek].findIndex((showToDelete: { id: string }) => showToDelete.id === props.id))
          props.setCurrentComedian(comedian)
        }
      console.log(comedian)
  }

  const createMonth = (dateToConvert: string) => {
    const months = {
      '01': 'JAN',
      '02': 'FEB',
      '03': 'MAR',
      '04': 'APR',
      '05': 'MAY',
      '06': 'JUN',
      '07': 'JUL',
      '08': 'AUG',
      '09': 'SEP',
      10: 'OCT', 
      11: 'NOV',
      12: 'DEC'
    }
    return(months[dateToConvert.slice(5, 7)])
  }

  return (
    <div className='show'>
    {props.headliner && <button onClick={(event) => handleClick(event)} 
      className={`${availability} show-button`}>{`${props.day.toUpperCase().slice(0, 3)} (${createMonth(props.date)}${props.date.slice(7, 10)}) ${props.time} ${props.currentClub == 'south' ? 'SOUTH' : 'DT'} ${props.headliner}`}: 
      <br></br>
      {availability   ? `Available` : `Not Available`}</button>}
  </div>
  )
}

export default Show