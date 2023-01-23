import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'



function Week(props: {comedian: object, weeklyShowTimes: []}) {

  const [shows, setShows] = useState([])
  // const [club, setClub] = useState()
  const [currentComedian, setCurrentComedian] = useState()
  const [club, setClub] = useState('shows, first choose a club')
  const [showComponents, setShowComponents] = useState()

  useEffect(() => {
    setCurrentComedian(props.comedian)
  },[currentComedian])

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  },[club])

  useEffect(() => {
    
    if(shows) {
      const showElements = props.weeklyShowTimes.map(show => { 
        return <div>
                  <Show
                      day={show.day}
                      time={show.time}
                      pay={show.pay}
                      currentClub={club}
                      availableComedian={currentComedian}
                  />
              </div>
          
      })
      console.log(showElements)
      setShowComponents(showElements)
    }
  }, [shows, club])


  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log(document.getElementsByClassName('show'))
  }

    return (
      <>
        <h1>{`Sign up for ${club}`}</h1>
        <button onClick={() => setClub('Downtown')}>Down Town</button>
        <button onClick={() => setClub('South')}>South Club</button>
        <form className='show-container' 
        
        // onSubmit={submitForm}
        >
          {showComponents}
          <button className='submit'>Submit Availability</button>
        </form>
      </>
    )
}

export default Week