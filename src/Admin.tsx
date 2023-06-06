import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { Comic, ShowToBook } from './interface'
import { addDoc, collection, query, getDocs, DocumentData, deleteDoc, doc, where } from "firebase/firestore"
import { db } from './firebase'
import ShowWithAvails from './ShowWithAvails'
import Week from './Week'

function Admin(props: {shows: [ShowToBook], setShows: any, setWeekSchedule: any, comedian: any, weeklyShowTimes: any}) {

  const [newSchedule, setNewSchedule] = useState<ShowToBook[]>([])
  const [showsToAdd, setShowsToAdd] = useState<any[]>([])
  const [day, setDay] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [signedShowsDown, setSignedShowsDown] = useState<any[]>([])
  const [signedShowsSouth, setSignedShowsSouth] = useState<any[]>([])
  const [specificComicHistoryDowntown, setSpecificComicHistoryDowntown] = useState<any[]>([])
  const [specificComicHistorySouth, setSpecificComicHistorySouth] = useState<any[]>([])
  const [comicForHistory, setcomicForHistory] = useState('')
  const [published, setPublished] = useState<any[]>([])
  const [emailList, setEmailList] = useState<any[]>([])
  const [comicEmail, setComicEmail] = useState('')
  const [comedianMask, setComedianMask] = useState<Comic>(props.comedian)
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

  const displayPotentialShows = () => {
    
    if (newSchedule.length > 0) {
      newSchedule.sort((a,b) => {
        if (a.date == b.date) {
          return parseInt(a.time.replaceAll(':','')) - parseInt(b.time.replaceAll(':',''))
        }
        return  parseFloat(a.date.replaceAll('-', '')) - parseFloat(b.date.replaceAll('-', ''))
        })    
    }
    
    setShowsToAdd(newSchedule.map((newShow, index) => {
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
                    email: '',
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
                    },
                    showsAvailabledowntownHistory: {
                      monday: [],
                      tuesday: [],
                      wednesday: [],
                      thursday: [], 
                      friday: [],
                      saturday: [],
                      sunday: []
                    },
                    showsAvailablesouthHistory: {
                      monday: [],
                      tuesday: [],
                      wednesday: [],
                      thursday: [], 
                      friday: [],
                      saturday: [],
                      sunday: []
                    }
                  }
                    
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
      return `12:${rawTime.substring(3)}AM`
    } else if (numTime > 12) {
      const newNum = numTime - 12
      setTime(`${newNum.toString()}:${rawTime.substring(3)}PM`)
      return `${newNum.toString()}:${rawTime.substring(3)}PM`
    } else if (numTime == 12) {
      setTime(`${rawTime}PM`)
      return `${rawTime}PM`
    } else {
      setTime(`${rawTime}AM`)
      return `${rawTime}AM`
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
          availableComics.map((comedian) => {
              
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
            setSpecificComicHistoryDowntown={setSpecificComicHistoryDowntown}
            setSpecificComicHistorySouth={setSpecificComicHistorySouth}
            setcomicForHistory={setcomicForHistory}
            showTime={showTime}
            headliner={finalfForm.headliner}
            time={finalfForm.time}
            day={finalfForm.day}
            club={finalfForm.club}
            id={finalfForm.id}
            availableComics={finalfForm.availableComics}
            date={finalfForm.date} 
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
            key={index}
            showTime={showTime}
            setSpecificComicHistoryDowntown={setSpecificComicHistoryDowntown}
            setSpecificComicHistorySouth={setSpecificComicHistorySouth}
            setcomicForHistory={setcomicForHistory}
            headliner={finalfForm.headliner}
            time={finalfForm.time}
            day={finalfForm.day}
            club={finalfForm.club}
            id={finalfForm.id}
            availableComics={finalfForm.availableComics}
            date={finalfForm.date} 
          />
        })
        setSignedShowsSouth(showFinals)
        })
  }

  const fetchPublishedShows = async () => {
    try {
      const docRef = query(collection(db, `publishedShows`))

      const doc = await (getDocs(docRef))

      const published = doc.docs.map(document => {
        return document.data()
      })

      setPublished(published)

    } catch (err) {
      console.log(err)
    }

    await setComicEmailList()
  }

  const sendEmail = (comicsEmail: any, showsForEmail: string[]) => {

    const emailData = {
      to: `${comicsEmail}`,
      from: 'bregmanmax91@gmail.com',
      subject: 'Comedy Works Upcoming Lineup',
      text: `${showsForEmail.join('\n')}`,
    }
  
    fetch('http://localhost:3001/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message)
      })
      .catch((error) => {
        console.error('Error sending email', error)
      })
  }


  const setComicEmailList = async () => {

    setEmailList([])

    const docRef = query(collection(db, `publishedShows`))

    const doc = await (getDocs(docRef))

    const showList = doc.docs.map(show => show.data().bookedshow)

    showList.map(async show => {
      const nameList = Object.values(show)
      nameList.map(async name => {
        if (typeof(name) === 'string') {
         const q = query(collection(db, 'users'), where("name", '==', name))
         const doc = await getDocs(q)
         if(doc.empty === false && !emailList.includes(doc.docs[0].data().email)) {
           const data = doc.docs[0].data()
           emailList.push(data.email)
           setEmailList(emailList)
         }
        }
       })
      })
  }

  const sendEmails = () => {

    const showsForEmailRaw = published.map(pubShow => {

      const mC = pubShow.bookedshow.mC && `MC: ${pubShow.bookedshow.mC}`
      const starMC = pubShow.bookedshow.starMC && `Star MC: ${pubShow.bookedshow.starMC}`
      const a1 = pubShow.bookedshow.a1 && `A1: ${pubShow.bookedshow.a1}`
      const b1 = pubShow.bookedshow.b1 && `B1: ${pubShow.bookedshow.b1}`
      const star7 = pubShow.bookedshow.star7 && `Star 7: ${pubShow.bookedshow.star7}`
      const yes = pubShow.bookedshow.yes && `Yes: ${pubShow.bookedshow.yes}`
      const other = pubShow.bookedshow.other.map((comic: { name: string,  type: string }) => `${comic.type}: ${comic.name}`).join('\n')

      const arrayLineup = [mC, starMC, star7, a1, b1, yes, other].filter(line => line != '').join('\n')

      const showString = `${pubShow.bookedshow.headliner} ${pubShow.bookedshow.day} ${pubShow.bookedshow.date} ${pubShow.bookedshow.time} ${pubShow.bookedshow.club.charAt(0).toUpperCase() + pubShow.bookedshow.club.slice(1)}

${arrayLineup}
      `
      return showString
    })

    emailList.map(email => sendEmail(email, showsForEmailRaw))
    // alert('Comics have been notified')
  }

  const showPublishedDowntown = () => {
    return published.map((pubShow, index) => {
      if (pubShow.bookedshow.club === 'downtown') {
        return <div className={`published-${pubShow.bookedshow.club}`} key={index}>
              <h3>{pubShow.bookedshow.club.charAt(0).toUpperCase() + pubShow.bookedshow.club.slice(1)} {pubShow.bookedshow.headliner} {pubShow.bookedshow.time} {pubShow.bookedshow.day} {pubShow.bookedshow.date}</h3>
              {pubShow.bookedshow.mC && <p className='published-detail'>MC: {pubShow.bookedshow.mC}</p>}
              {pubShow.bookedshow.starMC && <p className='published-detail'>Star MC: {pubShow.bookedshow.starMC}</p>}
              {pubShow.bookedshow.star7 && <p className='published-detail'>Star 7: {pubShow.bookedshow.star7}</p>}
              {pubShow.bookedshow.b1 && <p className='published-detail'>B1: {pubShow.bookedshow.b1}</p>}
              {pubShow.bookedshow.a1 && <p className='published-detail'>A1: {pubShow.bookedshow.a1}</p>}
              {pubShow.bookedshow.yes && <p className='published-detail'>Yes: {pubShow.bookedshow.yes}</p>}
              {pubShow.bookedshow.other.length > 0 && 
                <div>
                  <h4>Other/s: </h4>{pubShow.bookedshow.other.map((comic: {type: string, name: string}, index: string | number | null | undefined) => 
                  <p className='published-detail' key={index}>{comic.type}: {comic.name}</p>)}
                </div>}
                <button className='delete-show' onClick={() => removePublishedShow(pubShow.bookedshow.id)}>Unpublish</button>   
             </div>
      }
    })
  }

  const showPublishedSouth = () => {
    return published.map((pubShow, index) => {
      if (pubShow.bookedshow.club === 'south') {
        return <div className={`published-${pubShow.bookedshow.club}`} key={index}>
              <h3>{pubShow.bookedshow.club.charAt(0).toUpperCase() + pubShow.bookedshow.club.slice(1)} {pubShow.bookedshow.headliner} {pubShow.bookedshow.time} {pubShow.bookedshow.day} {pubShow.bookedshow.date}</h3>
              {pubShow.bookedshow.mC && <p className='published-detail'>MC: {pubShow.bookedshow.mC}</p>}
              {pubShow.bookedshow.starMC && <p className='published-detail'>Star MC: {pubShow.bookedshow.starMC}</p>}
              {pubShow.bookedshow.star7 && <p className='published-detail'>Star 7: {pubShow.bookedshow.star7}</p>}
              {pubShow.bookedshow.b1 && <p className='published-detail'>B1: {pubShow.bookedshow.b1}</p>}
              {pubShow.bookedshow.a1 && <p className='published-detail'>A1: {pubShow.bookedshow.a1}</p>}
              {pubShow.bookedshow.yes && <p className='published-detail'>Yes: {pubShow.bookedshow.yes}</p>}
              {pubShow.bookedshow.other.length > 0 && 
                <div>
                  <h4>Other/s: </h4>{pubShow.bookedshow.other.map((comic: {type: string, name: string}, index: string | number | null | undefined) => 
                  <p className='published-detail' key={index}>{comic.type}: {comic.name}</p>)}
                </div>}
                <button className='delete-show' onClick={() => removePublishedShow(pubShow.bookedshow.id)}>Unpublish</button>   
             </div>
      }
    })
  }

  const removePublishedShow = async (id: string) => {

    await deleteDoc(doc (db,"publishedShows", id))

    fetchPublishedShows()
    showPublishedDowntown()
    showPublishedSouth()
    await setComicEmailList()
  }

  const maskAsComic = async () => {
    console.log(comicEmail)
    try {
      const docRef = query(collection(db, `comediansForAdmin`), where("comedianInfo.email", "==", comicEmail))
      const doc = await (getDocs(docRef))
      const comic = await doc.docs[0].data().comedianInfo
      console.log(comic)
      setComedianMask({
        name: comic.name,
        id: comic.id,
        type: comic.type,
        email: comicEmail,
        showsAvailabledowntown: comic.showsAvailabledowntown,
        showsAvailablesouth: comic.showsAvailablesouth,
        showsAvailabledowntownHistory: comic.showsAvailabledowntownHistory,
          // {
          //   monday: [],
          //   tuesday: [],
          //   wednesday: [],
          //   thursday: [], 
          //   friday: [],
          //   saturday: [],
          //   sunday: []
          // }
        showsAvailablesouthHistory: comic.showsAvailablesouthHistory
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='admin-form'>
      
      <div className='mask-container'>
        <h3 className='shows-visible-to-comics'>Enter availabilty for comic using their email</h3>
        <input type='text' className='yes-spot' onChange={(e) => setComicEmail(e.target.value)}/>
      <input type='submit' className='submit-mask' onClick={() => maskAsComic()}/>
      </div>
  <h2 className='shows-visible-to-comics'>Current Comedian: {comedianMask.name}</h2>
  <h2 className='shows-visible-to-comics'>Shows Visible To Comics</h2>
      <Week comedian={comedianMask} weeklyShowTimes={props.shows}/>
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
        <input className='time-input' {...register('time')} type='time' onChange={(event) => showTime(event?.target.value)} required/>
        </div>
        <div>
        <label>Headliner: </label>
        <input className='headliner-input' {...register('headliner')} required/>
        </div>
        <input type='submit' value='Add Show' className='add-show'/>
      </form>
      {props.setShows && <button onClick={buildWeek} className='build-week'>Build Week</button>}
      {showsToAdd}
      <div>
        <button className='published-shows' onClick={() => fetchPublishedShows()}>See Queued Shows</button>
        {published.length > 0 && <div id='seen-published'>
        <h2 className='downtown-available-header'>Downtown Bookings</h2>  
        {showPublishedDowntown()}
        <h2 className='south-available-header'>South Bookings</h2>
        {showPublishedSouth()}
        <button className='build-week' onClick={() => sendEmails()}>Email to all comics</button></div>}
        <h2 className='downtown-available-header'>Downtown Available Comics</h2>
        <div>{signedShowsDown.map(availShow => availShow)}</div>
        <h2 className='south-available-header'>South Club Available Comics</h2>
        <div>{signedShowsSouth.map(availShow => availShow)}</div>
      </div>
      {comicForHistory && <h2 className='comic-of-history'>Availability History for {comicForHistory}</h2>}
      {comicForHistory && <h2 className='downtown-available-header'>Downtown Availability History</h2>}
      {specificComicHistoryDowntown.map((show, index) => <div key={index} className='comicHistory-show'>{show.showMap}</div>)}
      {comicForHistory && <h2 className='south-available-header'>South Club Availability History</h2>}
      {specificComicHistorySouth.map((show, index) => <div key={index} className='comicHistory-show'>{show.showMap}</div>)}
    </div>
  )
}

export default Admin