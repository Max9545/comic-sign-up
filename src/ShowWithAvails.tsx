import { collection, getDocs, query } from 'firebase/firestore'
import { type } from 'os'
import React, { useEffect, useState } from 'react'
import { db } from './firebase'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string, setSpecificComicHistoryDowntown: any, setSpecificComicHistorySouth: any, showTime: any, setcomicForHistory: any, date: string}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [comicHistory, setComicHistory] = useState<any[]>([])
  const [bookedShow, setBookedShow] = useState<any>({
    show: {
      day: '',
      headliner: '',
      time: '',
      club: '', 
      date: '',
      mC: '',
      a1: '',
      b1: '',
      starMC: '',
      star7: '',
      yes: ''
    },
    typeOfComic: '',
    comic: ''
  })
  
  useEffect(() => {
    setComics(props.availableComics)
  },[props])

  useEffect(() => {
    showFinalComicHistoryDowntown()
    showFinalComicHistorySouth()
  }, [comicHistory])

  const showFinalComicHistoryDowntown = () => {
    const historyStrings = comicHistory.reduce((acc, show, hisIndex) => {
        Object.entries(show.showsAvailabledowntownHistory).map((singleShow: any) => {
          singleShow.splice(0,1)
          if (!acc.includes(singleShow[0]) && singleShow[0].length > 0) {
            acc.push ({
              key: hisIndex,
              fireOrder: `${singleShow[0][0].fireOrder}`, 
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} at the ${finalShow.club} club for ${finalShow.headliner} at ${finalShow.time} on ${finalShow.day}`}</p></div>
              )
            })
          }
        })
        return acc
    }, [])
    const sorted = historyStrings.sort((a: any, b: any) => {
      return parseInt(a.fireOrder) - parseInt(b.fireOrder)
    })
    props.setSpecificComicHistoryDowntown(historyStrings)
  }

  const showFinalComicHistorySouth = () => {
    const historyStrings = comicHistory.reduce((acc, show, hisIndex) => {

        Object.entries(show.showsAvailablesouthHistory).map((singleShow: any) => {
          singleShow.splice(0,1)
          if (!acc.includes(singleShow[0]) && singleShow[0].length > 0) {
            acc.push ({
              key: hisIndex,
              fireOrder: `${singleShow[0][0].fireOrder}`, 
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} at the ${finalShow.club} club for ${finalShow.headliner} at ${finalShow.time} on ${finalShow.day}`}</p></div>
              )
            })
          }
        })
       
        return acc
    }, [])
    historyStrings.sort((a: any, b: any) => {
      return parseInt(a.fireOrder) - parseInt(b.fireOrder)
    })
    props.setSpecificComicHistorySouth(historyStrings)
  }

  const displayComicHistory = async (comic: string) => {
    
    props.setcomicForHistory(comic)

    const docRef = query(collection(db, `comedians/comicStorage/${comic}`))

    const doc = await (getDocs(docRef))

    setComicHistory(doc.docs.map(avail => avail.data().comedianInfo))
  }

  const setComedianType = (show: { day: string; headliner: string; time: string, club: string, date: string }, typeOfComic: string, comic: any) => {
    console.log(show, typeOfComic, comic)
    const newBooking = {...bookedShow, [typeOfComic]: comic}
    // newBooking[typeOfComic] = comic
    // if(newBookings.findIndex(bookedShow => `${bookedShow.date}${bookedShow.time}` === `${show.date}${show.time}`)!= -1) {
    //   newBookings.splice(newBookings.findIndex(bookedShow => `${bookedShow.date}${bookedShow.time}` === `${show.date}${show.time}`), 1 , {show: show, typeOfComic: typeOfComic, comic: comic})
    // } else {
      // newBookings.push({show: show, typeOfComic: typeOfComic, comic: comic})
    // }
    setBookedShow(newBooking)
  }
    
  return (
    <div className='available'>
      <h3>{`${props.day}(${props.date}) ${props.headliner} at ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}:`}</h3>
      <p>{bookedShow.mC &&`MC: ${bookedShow.mC}`}</p>
      <p>{bookedShow.b1 &&`B1: ${bookedShow.b1}`}</p>
      <p>{bookedShow.a1 &&`A1: ${bookedShow.a1}`}</p>
      <p>{bookedShow.star7 &&`Star 7: ${bookedShow.star7}`}</p>
      <p>{bookedShow.starMC &&`Star MC: ${bookedShow.starMC}`}</p>
      <div className='comic-type-box'>{props.availableComics.map(comic => 
        <div className='available-comic' onClick={() => displayComicHistory(comic)} key={comic}>
          <p className='comic-avail' key={comic}>{`${comic}`}</p>
          <p className='comic-type' onClick={() => setComedianType({day: props.day, headliner: props.headliner, time: props.time, club: props.club, date: props.date}, 'mC', comic)}>MC</p>
          <p className='comic-type' onClick={() => setComedianType({day: props.day, headliner: props.headliner, time: props.time, club: props.club, date: props.date}, 'a1', comic)}>A1</p>
          <p className='comic-type' onClick={() => setComedianType({day: props.day, headliner: props.headliner, time: props.time, club: props.club, date: props.date}, 'b1', comic)}>B1</p>
          <p className='comic-type' onClick={() => setComedianType({day: props.day, headliner: props.headliner, time: props.time, club: props.club, date: props.date}, 'star7', comic)}>Star7</p>
          <p className='comic-type' onClick={() => setComedianType({day: props.day, headliner: props.headliner, time: props.time, club: props.club, date: props.date}, 'starMC', comic)}>StarMC</p>
          <label className='yes-spot'>Yes:</label>
          <input type='text' className='yes-spot-input'></input>
          </div>)}
        </div>
    </div>
  )
}

export default ShowWithAvails