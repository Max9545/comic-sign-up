import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'
import { Comic, ShowToBook } from './interface'



function Week(props: {comedian: Comic, weeklyShowTimes: [ShowToBook]}) {

  const [shows, setShows] = useState([])
  const [currentComedian, setCurrentComedian] = useState()
  const [showComponents, setShowComponents] = useState()

  useEffect(() => {
    setCurrentComedian(props.comedian)
  },[currentComedian])

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  },[shows])

  useEffect(() => {
    
    if(shows.length > 0) {
      const showElements = props.weeklyShowTimes.map((show, index) => { 
        return <div>
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
    console.log(currentComedian)
    // localStorage.removeItem(`${currentComedian.name}'s availability`)
    localStorage.setItem(JSON.stringify(`${currentComedian.name}'s availability`), JSON.stringify(currentComedian))
  }

    return (
      <>
        <form className='show-container' 
              onSubmit={submitForm}
        >
          {showComponents}
          <button 
            type="submit" 
            className='submit-btn'
          >Submit Availability</button>
        </form>
      </>
    )
}

export default Week