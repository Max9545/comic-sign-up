import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'



function Week(props: {comedian: object, weeklyShowTimes: []}) {

  const [shows, setShows] = useState([])
  const [currentComedian, setCurrentComedian] = useState()
  // const [club, setClub] = useState('shows, first choose a club')
  // const [club, setClub] = useState()
  const [showComponents, setShowComponents] = useState()

  useEffect(() => {
    setCurrentComedian(props.comedian)
  },[currentComedian])

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  },[shows])

  useEffect(() => {
    
    if(shows.length > 0) {
      const showElements = props.weeklyShowTimes.map(show => { 
        return <div>
                  <Show
                      day={show.day}
                      time={show.time}
                      pay={show.pay}
                      currentClub={show.club}
                      availableComedian={currentComedian}
                  />
              </div>
          
      })
      setShowComponents(showElements)
    }
  }, [shows, currentComedian])


  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(currentComedian)

    localStorage.setItem(JSON.stringify(`${currentComedian.name}'s availability`), JSON.stringify(currentComedian))

    // showComponents.forEach(show => show.availability = false)
  }

    return (
      <>
        {/* <h1>{`Sign up for ${club}`}</h1> */}
        {/* <button onClick={() => setClub('Downtown')}>Down Town</button>
        <button onClick={() => setClub('South')}>South Club</button> */}
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