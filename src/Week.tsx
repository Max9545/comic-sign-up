import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'
import { Comic, ShowToBook } from './interface'
import { setDoc, doc } from 'firebase/firestore'
import { db } from './firebase'



function Week(props: {comedian: Comic, weeklyShowTimes: [ShowToBook]}) {

  const [shows, setShows] = useState<ShowToBook[]>([])
  const [currentComedian, setCurrentComedian] = useState(props.comedian)
  // useState<Comic>({
  //   name: 'admin',
  //   id: '',
  //   type: '',
    // showsAvailabledowntown: {
    //   monday: [{}],
    //   tuesday: [{}],
    //   wednesday: [{}],
    //   thursday: [{}], 
    //   friday: [{}],
    //   saturday: [{}],
    //   sunday: [{}]
    // },
  //   showsAvailablesouth: {
  //     monday: [{}],
  //     tuesday: [{}],
  //     wednesday: [{}],
  //     thursday: [{}], 
  //     friday: [{}],
  //     saturday: [{}],
  //     sunday: [{}]
  //   },
  //   payAmount: 0}
  // )
  const [showComponents, setShowComponents] = useState<any[]>([])

  useEffect(() => {
    setCurrentComedian(props.comedian)
  })

  useEffect(() => {
    setShows(props.weeklyShowTimes)
  }, [props.weeklyShowTimes])

  useEffect(() => {
    showShows()
    // if(shows.length > 0) {
    //   const showElements = props.weeklyShowTimes.map((show, index) => { 
    //     return <div key={index}>
    //               <Show
    //                   key={index}
    //                   id={`${show.date}${show.time}${show.headliner}${show.currentClub}${show.pay}${show.day}`}
    //                   day={show.day}
    //                   time={show.time}
    //                   pay={show.pay}
    //                   currentClub={show.club}
    //                   availableComedian={currentComedian}
    //                   date={show.date}
    //                   headliner={show.headliner}
    //               />
    //           </div>
          
    //   })
    //   setShowComponents(showElements)
    // }
  }, [shows, currentComedian])


  const showShows = () => {
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
                      availability={false}
                  />
              </div>
          
      })
      console.log('showShows', showElements[1])
      setShowComponents(showElements)
      console.log(showComponents[1])
    }
  }

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setDoc(doc(db, `comedians/${currentComedian.id}`), {comedianInfo: currentComedian, fireOrder: Date.now()})
    // addDoc(collection(db, `users/comedians/${currentComedian.name}`), currentComedian)
    currentComedian.showsAvailabledowntown = {
      monday: [{}],
      tuesday: [{}],
      wednesday: [{}],
      thursday: [{}], 
      friday: [{}],
      saturday: [{}],
      sunday: [{}]
    }
    currentComedian.showsAvailablesouth = {
      monday: [{}],
      tuesday: [{}],
      wednesday: [{}],
      thursday: [{}], 
      friday: [{}],
      saturday: [{}],
      sunday: [{}]
    } 
    showShows()
    alert('Availability Submitted!!')
    // localStorage.setItem(JSON.stringify(`${currentComedian.name}'s availability`), JSON.stringify(currentComedian))
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