import { collection, getDocs, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from './firebase'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  
  useEffect(() => {
    setComics(props.availableComics)
  },[props])

  const displayComicHistory = async (comic: string) => {
    
    const docRef = query(collection(db, `comedians/comicStorage/${comic}`))
    const doc = await (getDocs(docRef))
    const comicHistory = await doc.docs.map(avail => avail.data().comedianInfo)
    
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