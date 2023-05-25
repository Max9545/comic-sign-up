import React from 'react'
import { useEffect, useState } from 'react'
import Show from './Show'
import { Comic, ShowToBook } from './interface'
import { setDoc, doc, addDoc, collection, query, getDocs, orderBy, limit } from 'firebase/firestore'
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

    const sendConfirmationEmail = async () => {

      console.log(currentComedian)

      const docRef = query(collection(db, `comedians/comicStorage/${currentComedian.name}`), orderBy('fireOrder', 'desc'), limit(1))

      const doc = await (getDocs(docRef))


      console.log(doc.docs[0].data())

      const comicHistory = doc.docs[0].data().comedianInfo

      const downtownArrays = Object.keys(comicHistory.showsAvailabledowntownHistory).map(day => {
        // console.log(currentComedian.showsAvailabledowntown)
        return currentComedian.showsAvailabledowntownHistory[day].map((show: any) => `${show.day} ${show.date} ${show.club} ${show.headliner} ${show.time}`)
      })

       downtownArrays.map(show => {
        if (show[0] != undefined) {
          return show.order = parseInt(show[0].replaceAll('-','').replace(/\D/g,''))
        }
      }).filter(show => show != undefined)
      
      const sortedDown = downtownArrays.sort((a,b) => a.order - b.order)

      const downtownString = sortedDown.map(day => {
        if (day != '') {
          return `${day.toString()}`
        }
      }).join('\n').replaceAll(',', '\n').replace(/(^[ \t]*\n)/gm, "")

      console.log(downtownString)
     
      

  
      // const emailData = {
      //   to: `${props.comedian.email}`,
      //   from: 'bregmanmax91@gmail.com',
      //   subject: 'This week\'s lineup at Comedy Works',
      //   text: `${showsForEmail.join('\n')}`,
      // }
    
      // fetch('http://localhost:3001/send-email', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(emailData),
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log(data.message)
      //   })
      //   .catch((error) => {
      //     console.error('Error sending email', error)
      //   })
    }

  const submitForm = (event: any) => {

    event.preventDefault()
    
    setDoc(doc(db, `comediansForAdmin/${currentComedian.id}`), {comedianInfo: currentComedian, fireOrder: Date.now()})
    addDoc(collection(db, `comedians/comicStorage/${currentComedian.name}`), {
      comedianInfo: currentComedian, 
      fireOrder: Date.now()})
    // currentComedian.showsAvailabledowntown = {
    //   monday: [],
    //   tuesday: [],
    //   wednesday: [],
    //   thursday: [], 
    //   friday: [],
    //   saturday: [],
    //   sunday: []
    // }
    // currentComedian.showsAvailablesouth = {
    //   monday: [],
    //   tuesday: [],
    //   wednesday: [],
    //   thursday: [], 
    //   friday: [],
    //   saturday: [],
    //   sunday: []
    // } 
    sendConfirmationEmail()
    alert('Availability Submitted!! Check your email for verification of your latest availabilty')

    
    // setTimeout(() => {
    //   window.location.reload()
    // }, 500)
  }

    return (
        <section className='show-container'>
          {showShows()}
          <button onClick={submitForm}type="submit" className='submit-btn'>
          Submit Availability
          </button>
        </section>
    )
}

export default Week