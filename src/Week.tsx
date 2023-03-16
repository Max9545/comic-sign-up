import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'
import { Comic, ShowToBook } from './interface'
import { setDoc, doc } from 'firebase/firestore'
import { db, logout, auth } from './firebase'
import { redirect } from 'react-router-dom'



function Week(props: {comedian: Comic, weeklyShowTimes: [ShowToBook]}) {

  const [shows, setShows] = useState<ShowToBook[]>([])
  const [currentComedian, setCurrentComedian] = useState(props.comedian)
  const [allAvailablity, setAllAvailability] = useState(false)
  // const [showComponents, setShowComponents] = useState<any[]>([])

  useEffect(() => {
    setCurrentComedian(props.comedian)
  })

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  }, [props.weeklyShowTimes])

  useEffect(() => {
    showShows()
  }, [shows, currentComedian])


  const showShows = () => {
    if(shows.length > 0) {
      return props.weeklyShowTimes.map((show, index) => { 
        return <div key={index}>
                  <Show
                      key={index}
                      id={show.id}
                      day={show.day}
                      time={show.time}
                      currentClub={show.club}
                      availableComedian={currentComedian}
                      date={show.date}
                      headliner={show.headliner}
                      availability={false}
                      setAllAvailability={setAllAvailability}
                  />
              </div>
          
      })
    }
  }

  const submitForm = (event: any) => {

    event.preventDefault()
    setDoc(doc(db, `comedians/${currentComedian.id}`), {comedianInfo: currentComedian, fireOrder: Date.now()})
    currentComedian.showsAvailabledowntown = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    }
    currentComedian.showsAvailablesouth = {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [], 
      friday: [],
      saturday: [],
      sunday: []
    } 
    alert('Availability Submitted!! ANd you are now logged out')
    logout()
  }

    return (
      <>
      <section className='show-container'>
          {showShows()}
          <button onClick={submitForm}type="submit" className='submit-btn'>
          Submit Availability
          </button>
        </section>
      </>
    )
}

export default Week