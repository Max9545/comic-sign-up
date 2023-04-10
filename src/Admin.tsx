import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { ShowToBook, WeekInter } from './interface'
import { doc, addDoc, collection, query, getDocs, collectionGroup, DocumentData } from "firebase/firestore";
import {db} from './firebase'
import ShowWithAvails from './ShowWithAvails'

function Admin(props: {shows: [ShowToBook], setShows: any, setWeekSchedule: any}) {

  const [newSchedule, setNewSchedule] = useState<ShowToBook[]>([])
  const [showsToAdd, setShowsToAdd] = useState<any[]>([])
  const [day, setDay] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [signedShowsDown, setSignedShowsDown] = useState<any[]>([])
  const [signedShowsSouth, setSignedShowsSouth] = useState<any[]>([])
  const [trigger, setTrigger] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    displayPotentialShows()
  }, [newSchedule])

  // useEffect(() => {
  //   const downtownShows = props.shows.filter(show => show.club === 'downtown')

  //   setSignedShowsDown(downtownShows.map(show => {
  //     // console.log(show)
  //     if (show.club === 'downtown') {
  //       return <ShowWithAvails
  //             headliner={show.headliner}
  //             time={show.time}
  //             day={show.day}
  //             club={show.club}
  //             id={show.id}
  //             availableComics={[]} 
  //           />} 
  //   }))
  // },[])

  // useEffect(() => {
  //   const southShows = props.shows.filter(show => show.club === 'south')
  //   setSignedShowsSouth(southShows.map(show => {
  //     // console.log(show)
  //     // if (show.club === 'south') {
  //       return <ShowWithAvails
  //             headliner={show.headliner}
  //             time={show.time}
  //             day={show.day}
  //             club={show.club}
  //             id={show.id}
  //             availableComics={[]} 
  //           />}
  //   // }
  //   ))
  // },[])

  useEffect(() => {
    viewAllComicsAvailableSouth()
    viewAllComicsAvailableDowntown()
  }, [props])

  // useEffect(() => {
  //   viewAllComicsAvailableSouth()
  // }, [signedShowsSouth])

  const deleteShow = (showId: string) => {
    newSchedule.splice(newSchedule.findIndex(show => show.id === showId), 1)
    setNewSchedule(newSchedule)
    displayPotentialShows()
  }

  const onSubmit = (potentialShow: any) => {
        potentialShow.id = `${date}${time}${potentialShow.headliner}${potentialShow.club}${day}`
        potentialShow.day = day
        potentialShow.date = date
        potentialShow.time = time
        potentialShow.availableComics= []
        props.setWeekSchedule(potentialShow.week)
          const idCheck = newSchedule.map(show => show.id)
          if(!idCheck.includes(potentialShow.id)) {
            setNewSchedule([...newSchedule, potentialShow])
          }
        displayPotentialShows()
  }

  const buildWeek = () => {
    if (newSchedule.length > 0) {
      props.setShows(newSchedule)
      addDoc(collection(db, `shows for week`), {fireOrder: Date.now(), thisWeek: newSchedule})
      setNewSchedule([])
      setShowsToAdd([])
    }
  }

  const displayPotentialShows = () => {setShowsToAdd(newSchedule.map((newShow, index) => {
            return (
            <div key={index}>
              <Show
                key={index}
                id={newShow.id}
                day={newShow.day}
                time={newShow.time}
                currentClub={newShow.club}
                availableComedian={{
                  name: 'admin',
                  id: '',
                  type: '',
                  showsAvailabledowntown: {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [], 
                    friday: [],
                    saturday: [],
                    sunday: []
                  },
                  showsAvailablesouth: {
                    monday: [],
                    tuesday: [],
                    wednesday: [],
                    thursday: [], 
                    friday: [],
                    saturday: [],
                    sunday: []
                  }}
                }
                date={newShow.date}
                headliner={newShow.headliner}
                availability={false}
                availableComics={newShow.availableComics}
              />
              <button className='delete-show' onClick={() => deleteShow(newShow.id)}>Delete</button>
            </div>
          )
}))}

  const showDay = (numDate: string) => {
    setDate(numDate)
    const dateProto = new Date(numDate).getDay()
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    setDay(daysOfWeek[dateProto])
  }

  const showTime = (rawTime: string) => {
    const numTime = parseInt(rawTime)
    if (numTime === 0) {
      setTime(`12:${rawTime.substring(3)}AM`)
    } else if (numTime > 12) {
      const newNum = numTime - 12
      setTime(`${newNum.toString()}:${rawTime.substring(3)}PM`)
    } else if (numTime == 12) {
      setTime(`${rawTime}PM`)
    } else {
      setTime(`${rawTime}AM`)
    }
  }

  const viewAllComicsAvailableDowntown = async () => {

    const downtownShows = props.shows.filter(show => show.club === 'downtown')

    const docRef = query(collectionGroup(db, `comedians`))
    const doc = await (getDocs(docRef))
    
      const availableComics: DocumentData[] = []
      
      doc.docs.forEach(comic => availableComics.push(comic.data()))

      console.log(availableComics)
      downtownShows.map(show => {
          const availabeComedians: any[] = []
          availableComics.map((comedian, index) => {
              
                comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].map((downTownShow: string) => {
                  console.log(show, comedian)
                  if (show.id == downTownShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
                    console.log('success!!!!!!!!')
                    availabeComedians.push(comedian.comedianInfo.name)
                    console.log(availabeComedians, show.day)
                    // setTrigger(!trigger)
                    show.availableComics = availabeComedians
                  }
                })
          })
          console.log(availabeComedians, show)
          // show.availableComics = availabeComedians
          // setTrigger(!trigger)
          const showFinals = downtownShows.map(finalfForm => {
            console.log(finalfForm)
            return <ShowWithAvails
            headliner={finalfForm.headliner}
            time={finalfForm.time}
            day={finalfForm.day}
            club={finalfForm.club}
            id={finalfForm.id}
            availableComics={finalfForm.availableComics} 
          />
        })
        setSignedShowsDown(showFinals)
        })
  }

  const viewAllComicsAvailableSouth = async () => {

    const southShows = props.shows.filter(show => show.club === 'south')

    const docRef = query(collectionGroup(db, `comedians`))
    const doc = await (getDocs(docRef))
    
      const availableComics: DocumentData[] = []
      
      doc.docs.forEach(comic => availableComics.push(comic.data()))

      console.log(availableComics)
      southShows.map(show => {
          const availabeComedians: any[] = []
          availableComics.map((comedian, index) => {
              
                comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].map((southShow: string) => {
                  console.log(show, comedian)
                  if (show.id == southShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
                    console.log('success!!!!!!!!')
                    availabeComedians.push(comedian.comedianInfo.name)
                    console.log(availabeComedians, show.day)
                    // setTrigger(!trigger)
                    show.availableComics = availabeComedians
                  }
                })
          })
          console.log(availabeComedians, show)
          // show.availableComics = availabeComedians
          // setTrigger(!trigger)
          const showFinals = southShows.map(finalfForm => {
            console.log(finalfForm)
            return <ShowWithAvails
            headliner={finalfForm.headliner}
            time={finalfForm.time}
            day={finalfForm.day}
            club={finalfForm.club}
            id={finalfForm.id}
            availableComics={finalfForm.availableComics} 
          />
        })
        setSignedShowsSouth(showFinals)
        })
  }

  return (
    <div className='admin-form'>
      {/* <button onClick={viewAllComicsAvailable}>View Available Comedians</button> */}
      <p className='admin-build'>Admin: Build Week of Upcoming Shows</p>
      <button className='clear-form' onClick={() => reset()}>Clear/Reset Form</button>
      <form className='admin-input' onSubmit={handleSubmit(onSubmit)}>
        <select className='club-select' {...register('club')}>
          <option value='downtown'>Downtown</option>
          <option value='south'>South</option>
        </select>
        <label className='date'>Date:</label>
        <input className='day' {...register('date')} type='date' required onChange={(event) => showDay(event.target.value)}/>
        <div className='day-of-week' >{` which is a ${day}`}</div>
        <div>
        <label>Time: </label>
        <input className='time-input' {...register('time')} type='time' onChange={(event) => showTime(event?.target.value)}  required/>
        </div>
        <div>
        <label>Headliner: </label>
        <input className='headliner-input' {...register('headliner')} required/>
        </div>
        {/* <label className='add-show'>Add Show</label> */}
        <input type='submit' value='Add Show' className='add-show'/>
      </form>
      {props.setShows && <button onClick={buildWeek} className='build-week'>Build Week</button>}
      {showsToAdd}
      <div>
      <h2 className='downtown-available-header'>Downtown Available Comics</h2>
      <div>{signedShowsDown.map(availShow => availShow)}</div>
      <h2 className='south-available-header'>South Club Available Comics</h2>
      <div>{signedShowsSouth.map(availShow => availShow)}</div>
      {/* <section className='available-comics'>
        <div className='available'>Available Downtown Monday: {availableDownttownMonday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Tuesday: {availableDownttownTuesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Wednesday: {availableDownttownWednesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Thursday: {availableDownttownThursday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Friday: {availableDownttownFriday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Saturday: {availableDownttownSaturday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available Downtown Sunday: {availableDownttownSunday.map(e => <p>{`${e}`}</p>)}</div>
      </section>
      <h2 className='south-available-header'>South Club Available Comics</h2>
      <section className='available-comics'>
        <div className='available'>Available South Monday: {availableSouthMonday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Tuesday: {availableSouthTuesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Wednesday: {availableSouthWednesday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Thursday: {availableSouthThursday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Friday: {availableSouthFriday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Saturday: {availableSouthSaturday.map(e => <p>{`${e}`}</p>)}</div>
        <div className='available'>Available South Sunday: {availableSouthSunday.map(e => <p>{`${e}`}</p>)}</div> */}
      {/* </section> */}
      </div>
    </div>
  )
}

export default Admin