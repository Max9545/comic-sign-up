import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'
import { Comic, ShowToBook } from './interface'
import { setDoc, doc, addDoc, collection } from 'firebase/firestore'
import { db } from './firebase'

function Week(props: {comedian: Comic, weeklyShowTimes: [ShowToBook]}) {

  const [shows, setShows] = useState<ShowToBook[]>([])
  const [currentComedian, setCurrentComedian] = useState(props.comedian)
  const [allAvailablity, setAllAvailability] = useState(false)

  useEffect(() => {
    setCurrentComedian(props.comedian)
  }, [props])

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  }, [props.weeklyShowTimes])

  useEffect(() => {
    showShows()
  }, [props])


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
                      availability={show.availableComics.includes(props.comedian.name)}
                      setAllAvailability={setAllAvailability}
                      availableComics={show.availableComics}
                  />
              </div>
          
        })
      }
    }

  const submitForm = (event: any) => {

    event.preventDefault()
    setDoc(doc(db, `comediansForAdmin/${currentComedian.id}`), {comedianInfo: currentComedian, fireOrder: Date.now()})
    addDoc(collection(db, `comedians/comicStorage/${currentComedian.name}`), {
      comedianInfo: currentComedian, 
      fireOrder: Date.now()})
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
    alert('Availability Submitted!! Check your email and phone for verification of your latest availabilty')
    setTimeout(() => {
      window.location.reload()
    }, 500)
  }

    return (
      <>
      <section className='show-container'>
        {}
        {showShows()}
        <button onClick={submitForm}type="submit" className='submit-btn'>
        Submit Availability
        </button>
        </section>
      </>
    )
}

export default Week