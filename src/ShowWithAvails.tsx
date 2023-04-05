import React, { useEffect, useState } from 'react'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string}) {
  
  const [comics, setComics] = useState<any[]>([])
  const [id, setId] =useState(props.id)
  

   useEffect(() => {
    props.availableComics.splice(0,1)
    setComics(props.availableComics)
  },[props])


    
  return (
    <div className='available'>
      <h3>{`${props.day} ${props.headliner} at ${props.time} ${props.club}`}</h3>
      <p>{comics.length > 0 && comics.map(comic => comic)}</p>
    </div>
  )
}

export default ShowWithAvails