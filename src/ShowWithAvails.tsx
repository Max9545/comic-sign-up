import { collection, getDocs, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from './firebase'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string, setSpecificComicHistoryDowntown: any, setSpecificComicHistorySouth: any, showTime: any, setcomicForHistory: any}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [comicHistory, setComicHistory] = useState<any[]>([])
  
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
              order: `${singleShow[0][0].submissionDateTime}`, 
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} at the ${finalShow.club} club for ${finalShow.headliner} at ${finalShow.time} on ${finalShow.day}`}</p></div>
              )
            })
          }
        })
        return acc
    }, [])
    historyStrings.sort((a: any, b: any) => {
      console.log(a.order.slice(0, 10), 'slice')
      return a.fireOrder > b.fireOrder
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
              order: `${singleShow[0][0].submissionDateTime}`, 
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} at the ${finalShow.club} club for ${finalShow.headliner} at ${finalShow.time} on ${finalShow.day}`}</p></div>
              )
            })
          }
        })
       
        return acc
    }, [])
    historyStrings.sort((a: any, b: any) => {
      return a.fireOrder > b.fireOrder
    })
    props.setSpecificComicHistorySouth(historyStrings)
  }

  const displayComicHistory = async (comic: string) => {
    
    props.setcomicForHistory(comic)

    const docRef = query(collection(db, `comedians/comicStorage/${comic}`))

    const doc = await (getDocs(docRef))

    setComicHistory(doc.docs.map(avail => avail.data().comedianInfo))
  }
    
  return (
    <div className='available'>
      <h3>{`${props.day} ${props.headliner} at ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}:`}</h3>
      <div>{props.availableComics.map(comic => <div className='available-comic' onClick={() => displayComicHistory(comic)} key={comic}><p  key={comic}>{`${comic}`}</p></div>)}</div>
    </div>
  )
}

export default ShowWithAvails