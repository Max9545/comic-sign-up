import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'
import { Comic, ShowToBook } from './interface'



function Week(props: {comedian: Comic, weeklyShowTimes: [ShowToBook]}) {

  const [shows, setShows] = useState<ShowToBook[]>([])
  const [currentComedian, setCurrentComedian] = useState<Comic>({
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
  const [showComponents, setShowComponents] = useState<any[]>([])

  useEffect(() => {
    setCurrentComedian(props.comedian)
  },[currentComedian])

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  },[])

  useEffect(() => {
    
    if(shows.length > 0) {
      const showElements = props.weeklyShowTimes.map((show, index) => { 
        return <div key={index}>
                  <Show
                      key={index}
                      id={`${show.date}${show.time}${show.headliner}${show.currentClub}${show.pay}${show.day}`}
                      day={show.day}
                      time={show.time}
                      pay={show.pay}
                      currentClub={show.club}
                      availableComedian={currentComedian}
                      date={show.date}
                      headliner={show.headliner}
                  />
              </div>
          
      })
      setShowComponents(showElements)
    }
  }, [shows, currentComedian])


  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    localStorage.setItem(JSON.stringify(`${currentComedian.name}'s availability`), JSON.stringify(currentComedian))
  }

    return (
      <>
        <form className='show-container' onSubmit={submitForm}>
          {showComponents}
          <button type="submit" className='submit-btn'>
          Submit Availability
          </button>
        </form>
      </>
    )
}

export default Week