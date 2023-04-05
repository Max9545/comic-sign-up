import React from 'react'


function ShowWithAvails(props: {headliner: string, time: string, day: string, club: string}) {
  return (
    <div className='available'>
      <h3>{`${props.day} ${props.headliner} at ${props.time} ${props.club}`}</h3>
      <p></p>
    </div>
  )
}

export default ShowWithAvails