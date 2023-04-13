import { stringify } from 'querystring'
import React, { useEffect, useState } from 'react'
import { set } from 'react-hook-form'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [id, setId] =useState(props.id)
  const [comicStrings, setComicStrings] = useState<any[]>([])
  
  useEffect(() => {
    setComics(props.availableComics)
  },[props])
    
  return (
    <div className='available'>
      <h3>{`${props.day} ${props.headliner} at ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}:`}</h3>
      <div>{props.availableComics.map(comic => <p key={comic}>{`${comic}`}</p>)}</div>
    </div>
  )
}

export default ShowWithAvails