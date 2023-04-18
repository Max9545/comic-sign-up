import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { ShowToBook, WeekInter } from './interface'
import { doc, addDoc, collection, query, getDocs, collectionGroup, DocumentData, where } from "firebase/firestore";
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
  // const [trigger, setTrigger] = useState(true)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    displayPotentialShows()
  }, [newSchedule])

  useEffect(() => {
    viewAllComicsAvailableSouth()
    viewAllComicsAvailableDowntown()
  }, [props])

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
            <div key={index + 1}>
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

    const docRef = query(collection(db, `comediansForAdmin`))
    const doc = await (getDocs(docRef))
    
      const availableComics: DocumentData[] = []
      
      doc.docs.forEach(comic => availableComics.push(comic.data()))

      downtownShows.map(show => {
          const availabeComedians: any[] = []
          availableComics.map((comedian, index) => {
              
                comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].map((downTownShow: string) => {
                  if (show.id == downTownShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
                    availabeComedians.push(comedian.comedianInfo.name)
                    show.availableComics = availabeComedians
                  }
                })
          })
          const showFinals = downtownShows.map((finalfForm, index) => {
            return <ShowWithAvails
            key={index}
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

    const docRef = query(collection(db, `comediansForAdmin`))
    const doc = await (getDocs(docRef))
    
      const availableComics: DocumentData[] = []
      
      doc.docs.forEach(comic => availableComics.push(comic.data()))
      southShows.map(show => {
          const availabeComedians: any[] = []
          availableComics.map((comedian) => {
              
                comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].map((southShow: string) => {
                  if (show.id == southShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
                    availabeComedians.push(comedian.comedianInfo.name)
                    show.availableComics = availabeComedians
                  }
                })
          })
          const showFinals = southShows.map((finalfForm, index) => {
            return <ShowWithAvails
            headliner={finalfForm.headliner}
            time={finalfForm.time}
            day={finalfForm.day}
            club={finalfForm.club}
            id={finalfForm.id}
            availableComics={finalfForm.availableComics} 
            key={index}
          />
        })
        setSignedShowsSouth(showFinals)
        })
  }

  return (
    <div className='admin-form'>
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
      </div>
    </div>
  )
}

export default Admin