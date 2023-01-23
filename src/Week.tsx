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
  })

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  })

  useEffect(() => {
    // const newShows = props.weeklyShowTimes.map(show => { 
      // return <div>
                // <Show
                //     day={show.day}
                //     time={show.time}
                // />
            {/* </div> */}
    
    // const completedShows = newShows.map(show => { 
    //   return <>
    //             <Show
    //                 day={show.day}
    //                 time={show.time}
    //             />
    //         </>
        
    // })
    if(shows) {
      console.log(props.weeklyShowTimes)
      const showElements = props.weeklyShowTimes.map(show => { 
        return <div>
                  <Show
                      day={show.day}
                      time={show.time}
                  />
              </div>
          
      })
      console.log(showElements)
      setShowComponents(showElements)
    }
  }, [shows])

  // const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   console.log(document.getElementsByClassName('show'))
  // }

    return (
      <>
        <h1>{`Sign up for ${club}`}</h1>
        <button onClick={() => setClub('Downtown')}>Down Town</button>
        <button onClick={() => setClub('South')}>South Club</button>
        <form className='show-container' 
        
        // onSubmit={submitForm}
        >
          {/* <Show 
          day='monday' 
          time='7:30'
          pay={25}
          />
          <Show 
          day='tuesday' 
          time='6:00'
          pay={40}
          />
          <Show 
          day='tuesday' 
          time='8:00'
          pay={40}
          />
          <Show 
          day='wednesday' 
          time='7:30'
          pay={40}
          />
          <Show 
          day='thursday' 
          time='7:30'
          pay={50}
          />
          <Show 
          day='friday' 
          time='7:30'
          pay={50}
          />
          <Show 
          day='friday' 
          time='9:30'
          pay={40}
          />
          <Show 
          day='saturday' 
          time='7:30'
          pay={40}
          />
          <Show 
          day='saturday' 
          time='9:30'
          pay={50}
          />
          <Show 
          day='sunday' 
          time='5:30'
          pay={60}
          /> */}
          {showComponents}
          <button className='submit'>Submit Availability</button>
        </form>
      </>
    )
}

export default Week