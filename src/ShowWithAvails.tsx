import { stringify } from 'querystring'
import React, { useEffect, useState } from 'react'
import { set } from 'react-hook-form'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [id, setId] =useState(props.id)
  const [comicStrings, setComicStrings] = useState<any[]>([])
  
  useEffect(() => {
    setComics(props.availableComics)
    console.log(comics)
  },[props])

  //  useEffect(() => {
  //   // props.availableComics.splice(0,1)
  //   // setComics(props.availableComics)
  //   setComicStrings(comics.map(comic => <p>{`${comic}`}</p>))
  //   console.log(comicStrings)
  //   console.log(comics)
  // }, [comics])

  // useEffect(() => {
  //   // const strings = comics.map(comic => comic)
  //   setComicStrings(comics.map(comic => <p>{`${comic}`}</p>))
  // }, [props])


    
  return (
    <div className='available'>
      <h3>{`${props.day} ${props.headliner} at ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}:`}</h3>
      {/* <p>{props.availableComics}</p> */}
      <p>{props.availableComics.map(comic => <p>{`${comic}`}</p>)}</p>
      {/* 
      <p>{comics.map(comic => <p>{comic}</p>)}</p>
      <p>{comicStrings.map(comic => <p>{`${comic}`}</p>)}</p>
      <p>{comics[0]}</p>
      <p>{comicStrings[0]}</p>
      <p>{comics}</p>*/}
      {/* <p>{comicStrings}</p>  */}
    </div>
  )
}

export default ShowWithAvails