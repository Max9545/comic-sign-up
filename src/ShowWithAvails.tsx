import React, { useEffect, useState } from 'react'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [id, setId] =useState(props.id)
  const [comicStrings, setComicStrings] = useState<any[]>([])
  

   useEffect(() => {
    props.availableComics.splice(0,1)
    setComics(props.availableComics)
  })

  useEffect(() => {
    // const strings = comics.map(comic => comic)
    setComicStrings(comics.map(comic => <p>{`${comic}`}</p>))
  }, [props])


    
  return (
    <div className='available'>
      <h3>{`${props.day} ${props.headliner} at ${props.time} ${props.club} yaya`}</h3>
      {/* <p>{props.availableComics}</p> */}
      <p>{comicStrings}</p>
    </div>
  )
}

export default ShowWithAvails