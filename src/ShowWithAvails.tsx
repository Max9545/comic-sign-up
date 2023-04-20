import { collection, getDocs, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from './firebase'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string, setSpecificComicHistoryDowntown: any}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [comicHistory, setComicHistory] = useState<any[]>([])
  
  useEffect(() => {
    setComics(props.availableComics)
  },[props])

  useEffect(() => {
    showFinalComicHistory()
  }, [comicHistory])

  const showFinalComicHistory = () => {
    const historyStrings = comicHistory.reduce((acc, show, hisIndex) => {
      console.log(show)
      // for (var key in show.showsAvailabledowntownHistory) {
        console.log(Object.entries(show.showsAvailabledowntownHistory))
        Object.entries(show.showsAvailabledowntownHistory).map((singleShow: any) => {
          singleShow.splice(0,1)
          console.log(singleShow)
          if (!acc.includes(singleShow[0]) && singleShow[0].length > 0) {
            // console.log(singleShow[0][0].submissionDateTime)
            acc.push ({
              key: hisIndex,
              order: `${singleShow[0][0].submissionDateTime}`, 
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time:${finalShow.submissionDateTime}`}</p><p>{`${finalShow.date} at the ${finalShow.club} club for ${finalShow.headliner} at ${finalShow.time} on ${finalShow.day}`}</p></div>
              )
            })
          }
        })
       
        return acc
      // }
    }, [])
    console.log(historyStrings)
    historyStrings.sort((a: any, b: any) => {
      console.log(a.order, b)
      return a.order > b.order
    })
    props.setSpecificComicHistoryDowntown(historyStrings)
  }

  const displayComicHistory = async (comic: string) => {
    
    const docRef = query(collection(db, `comedians/comicStorage/${comic}`))

    const doc = await (getDocs(docRef))

    // const comicHistory = doc.docs.map(avail => avail.data().comedianInfo)
    setComicHistory(doc.docs.map(avail => avail.data().comedianInfo))
    console.log(comicHistory)

    
    
  }
    
  return (
    <div className='available'>
      <h3>{`${props.day} ${props.headliner} at ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}:`}</h3>
      <div>{props.availableComics.map(comic => <div className='available-comic' onClick={() => displayComicHistory(comic)} key={comic}><p  key={comic}>{`${comic}`}</p></div>)}</div>
    </div>
  )
}

export default ShowWithAvails