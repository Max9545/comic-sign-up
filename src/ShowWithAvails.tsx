import { collection, getDocs, query, doc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from './firebase'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string, setSpecificComicHistoryDowntown: any, setSpecificComicHistorySouth: any, showTime: any, setcomicForHistory: any, date: string}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [comicHistory, setComicHistory] = useState<any[]>([])
  const [otherType, setOtherType] = useState('')
  const [otherName, setOtherName] = useState('')
  const [trigger, setTrigger] = useState(true)
  const [bookedShow, setBookedShow] = useState<any>({
      day: props.day,
      headliner: props.headliner,
      time: props.time,
      club: props.club, 
      date: props.date,
      id: props.id,
      mC: '',
      a1: '',
      b1: '',
      starMC: '',
      star7: '',
      yes: '',
      other: []
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

  const setComedianType = (typeOfComic: string, comic: any) => {
    if (bookedShow[typeOfComic] == '') {
      const newBooking = {...bookedShow, [typeOfComic]: comic}
      setBookedShow(newBooking)
    } else if (bookedShow[typeOfComic] !== comic){
      const newBooking = {...bookedShow, [typeOfComic]: comic}
      setBookedShow(newBooking)
    } else {
      const newBooking = {...bookedShow, [typeOfComic]: ''}
      setBookedShow(newBooking)
    }
  }

  const publishShow = () => {
    setDoc(doc(db, `publishedShows/${props.id}`), {bookedshow: bookedShow, fireOrder: Date.now()})
    alert('Show saved!')
  }

  return (
    <div className='available'>
      <h3>{`${props.day}(${props.date}) ${props.headliner} at ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}:`}</h3>
      <p>{bookedShow.mC &&`MC: ${bookedShow.mC}`}</p>
      <p>{bookedShow.starMC &&`Star MC: ${bookedShow.starMC}`}</p>
      <p>{bookedShow.b1 &&`B1: ${bookedShow.b1}`}</p>
      <p>{bookedShow.a1 &&`A1: ${bookedShow.a1}`}</p>
      <p>{bookedShow.star7 &&`Star 7: ${bookedShow.star7}`}</p>
      <p>{bookedShow.yes &&`Yes: ${bookedShow.yes}`}</p>
      <div>{bookedShow.other.length > 0 && bookedShow.other.map((comic: { type: string; name: string }, index: string | number | null | undefined) => 
        <div className='other-type-comic' key={index}>
          <p>{`${comic.type}: ${comic.name}`}</p>
          <button onClick={() => {
            const booking = bookedShow
            booking.other.splice(bookedShow.other.findIndex((type: { type: string }) => type.type === comic.type), 1)
            setBookedShow(booking)
            setTrigger(!trigger)
          }} className='delete-comic'>Delete</button>
        </div>
      )}</div>
      {(bookedShow.mC || bookedShow.starMC || bookedShow.a1 || bookedShow.b1 || bookedShow.other.length > 0 || bookedShow.yes || bookedShow.star7) && <button className='add-show' onClick={() => publishShow()}>Publish Show</button>}
      <div className='comic-type-box'>{props.availableComics.map(comic => 
        <div className='available-comic' onClick={() => displayComicHistory(comic)} key={comic}>
          <p className='comic-avail' key={comic}>{`${comic}`}</p>
          <p className='comic-type' onClick={() => setComedianType('mC', comic)}>MC</p>
          <p className='comic-type' onClick={() => setComedianType('a1', comic)}>A1</p>
          <p className='comic-type' onClick={() => setComedianType('b1', comic)}>B1</p>
          <p className='comic-type' onClick={() => setComedianType('star7', comic)}>Star7</p>
          <p className='comic-type starMC' onClick={() => setComedianType('starMC', comic)}>Star MC</p>
          </div>)}
          <div className='yes-div'>
            <label className='yes-spot'>Yes (Guest):</label>
            <input type='text' className='yes-spot-input' onChange={(event) => setBookedShow({...bookedShow, yes: event?.target?.value})}/>
          </div>
          <div className='other-block'>
            <label className='other-spot'>Other Type Comics:</label>
            <div className='other-div'>
            <label>Comic Type: </label>
            <input type='text' className='comic-type-input' onChange={(event) => setOtherType(event?.target?.value)}/>
          </div>
          <div className='other-div'>
            <label>Comic Name: </label>
            <input type='text' onChange={(event) => setOtherName(event?.target?.value)}/>
          </div>
            <button className='add-show' onClick={() => setBookedShow({...bookedShow, other:[...bookedShow.other,{ type: otherType, name: otherName}]})}>Add</button>
          </div>
        </div>
    </div>
  )
}

export default ShowWithAvails