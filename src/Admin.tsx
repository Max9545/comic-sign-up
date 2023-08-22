import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { Comic, ShowToBook } from './interface'
import { addDoc, collection, query, getDocs, DocumentData, deleteDoc, doc, where, getFirestore, setDoc, updateDoc } from "firebase/firestore"
import { db } from './firebase'
import ShowWithAvails from './ShowWithAvails'
import Week from './Week'
// import { getAuth, createUser } from 'firebase/auth'
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, updateCurrentUser } from "firebase/auth"
const auth = getAuth();


function Admin(props: {shows: [ShowToBook], setShows: any, setWeekSchedule: any, comedian: any, weeklyShowTimes: any, admin: boolean, fetchWeekForComedian: any, weekOrder: string, user: any}) {

  const [newSchedule, setNewSchedule] = useState<any[]>([])
  const [showsToAddDowntown, setShowsToAddDowntown] = useState<any[]>([])
  const [showsToAddSouth, setShowsToAddSouth] = useState<any[]>([])
  const [day, setDay] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('')
  const [signedShowsDown, setSignedShowsDown] = useState<any[]>([])
  const [signedShowsSouth, setSignedShowsSouth] = useState<any[]>([])
  const [specificComicHistoryDowntown, setSpecificComicHistoryDowntown] = useState<any[]>([])
  const [specificComicHistorySouth, setSpecificComicHistorySouth] = useState<any[]>([])
  const [comicForHistory, setcomicForHistory] = useState('')
  const [published, setPublished] = useState<any[]>([])
  const [emailList, setEmailList] = useState<any[]>([])
  const [emailListWithOutTowners, setEmailListWithOutTowners] = useState<any[]>([])
  // const [comicEmail, setComicEmail] = useState('')
  const [comicSearch, setComicSearch] = useState('')
  const [comedianMask, setComedianMask] = useState<Comic>(props.comedian)
  const [outOfTowners, setOutOfTowners] = useState(false)
  const [adTrigger, setAdTrigger] = useState(true)
  const [potentialShow, setPotentialShow] = useState({id:''})
  const [createNewComicEmail, setCreateNewComicEmail] = useState('')
  const [createNewComicPassword, setCreateNewComicPassword] = useState('')
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    setComicEmailList()
  }, [])

  useEffect(() => {
    displayPotentialShows()
  }, [newSchedule])

  useEffect(() => {
    viewAllComicsAvailableSouth()
    viewAllComicsAvailableDowntown()
    fetchPublishedShows()
  }, [props, adTrigger])

  useEffect(() => {
    viewAllComicsAvailableSouth()
    viewAllComicsAvailableDowntown()
  }, [published])

  

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
            setPotentialShow(potentialShow)
          }
        displayPotentialShows()
  }

  const buildWeek = () => {
    if (newSchedule.length > 0) {
      props.setShows(newSchedule)
      addDoc(collection(db, `shows for week`), {fireOrder: Date.now(), thisWeek: newSchedule})
      setNewSchedule([])
      setShowsToAddDowntown([])
      setShowsToAddSouth([])
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
    
    setShowsToAddDowntown(newSchedule.map((newShow, index) => {
            if (newShow.club == 'downtown') {

              return (
                <div key={index + 1}>
                  <Show
                    key={index}
                    id={newShow.id}
                    day={newShow.day}
                    time={newShow.time}
                    currentClub={newShow.club}
                    supportStatus={newShow.support}
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
            }
    }).filter(show => show != undefined))

    setShowsToAddSouth(newSchedule.map((newShow, index) => {
      if (newShow.club == 'south') {

        return (
          <div key={index + 1}>
            <Show
              key={index}
              id={newShow.id}
              day={newShow.day}
              time={newShow.time}
              currentClub={newShow.club}
              supportStatus={newShow.support}
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
      }
    }
  ).filter(show => show != undefined))
}

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

          const showFinals = downtownShows.map((finalForm, index) => {

            const alreadyBooked = published.map(show => {
              if (show.bookedshow.id == finalForm.id) {
                return <div className={`published-${show.bookedshow.club}`} key={index}>
              <h3>Booked {show.bookedshow.day} {`(${show.bookedshow.date})`} {show.bookedshow.headliner} {show.bookedshow.time} {show.bookedshow.club.charAt(0).toUpperCase() + show.bookedshow.club.slice(1)}</h3>
              {show.comicArray.map((comic: { type: string; comic: string }, pinDext: any) =>  <p key={pinDext} >{`${comic.type.charAt(0).toUpperCase() + comic.type.slice(1)}: ${comic.comic}`}</p>)}
                <button className='delete-show' onClick={() => removePublishedShow(show.bookedshow.id)}>Unpublish</button>   
             </div>
              }
            })

            
            return <ShowWithAvails
            key={index}
            setSpecificComicHistoryDowntown={setSpecificComicHistoryDowntown}
            setSpecificComicHistorySouth={setSpecificComicHistorySouth}
            setcomicForHistory={setcomicForHistory}
            showTime={showTime}
            headliner={finalForm.headliner}
            time={finalForm.time}
            day={finalForm.day}
            club={finalForm.club}
            id={finalForm.id}
            availableComics={finalForm.availableComics}
            date={finalForm.date}
            alreadyBooked={alreadyBooked} 
            setAdTrigger={setAdTrigger}
            adTrigger={adTrigger}
            supportStatus={finalForm.supportStatus}
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

         

          const showFinals = southShows.map((finalForm, index) => {

            const alreadyBooked = published.map((show) => {
              if (show.bookedshow.id == finalForm.id) {
                return <div className={`published-${show.bookedshow.club}`} key={index}>
              <h3>Booked {show.bookedshow.day} {`(${show.bookedshow.date})`} {show.bookedshow.headliner} {show.bookedshow.time} {show.bookedshow.club.charAt(0).toUpperCase() + show.bookedshow.club.slice(1)}</h3>

              {show.comicArray.map((comic: { type: string; comic: string }, pinDext: any) =>  <p key={`${pinDext}`} >{`${comic.type.charAt(0).toUpperCase() + comic.type.slice(1)}: ${comic.comic}`}</p>)}
                <button className='delete-show' onClick={() => removePublishedShow(show.bookedshow.id)}>Unpublish</button>   
             </div>
              }
            })

            
            return <ShowWithAvails
            key={index}
            setSpecificComicHistoryDowntown={setSpecificComicHistoryDowntown}
            setSpecificComicHistorySouth={setSpecificComicHistorySouth}
            setcomicForHistory={setcomicForHistory}
            showTime={showTime}
            headliner={finalForm.headliner}
            time={finalForm.time}
            day={finalForm.day}
            club={finalForm.club}
            id={finalForm.id}
            availableComics={finalForm.availableComics}
            date={finalForm.date}
            alreadyBooked={alreadyBooked} 
            setAdTrigger={setAdTrigger}
            adTrigger={adTrigger}
            supportStatus={finalForm.supportStatus}
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
  }

  const sendEmail = (comicsEmail: any, showsForEmail: any) => {

    const emailData = {
      to: `${comicsEmail}`,
      from: 'bregmanmax91@gmail.com',
      subject: 'Comedy Works Upcoming Lineup',
      text: `${showsForEmail}`,
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

    const docRef = query(collection(db, `users`))

    const doc = await (getDocs(docRef))

    const emails = doc.docs.map(user => user.data().email)

    setEmailList(emails)

    setEmailListWithOutTowners([])

    const withoutOutTowners = doc.docs.filter(comic =>  comic.data().type != 'outOfTown')

    const emailsWithoutOutTowners = withoutOutTowners.map((comic: any ) => comic.data().email)

    setEmailListWithOutTowners(emailsWithoutOutTowners)
    // const docRefOut = query(collection(db, `users`), where('type', '!=', 'outOfTown'))

    // const docOut = await (getDocs(docRefOut))

    // const emailsOut = docOut.docs.map(user => user.data().email)

    // setEmailListWithOutTowners(emailsOut)
    // console.log(emailListWithOutTowners, emailList)
    // const showList = doc.docs.map(show => show.data().bookedshow)
    // showList.map(async show => {
    //   const nameList = Object.values(show)
    //   nameList.map(async name => {
    //     if (typeof(name) === 'string') {
    //      const q = query(collection(db, 'users'), where("name", '==', name))
    //      const doc = await getDocs(q)
    //      if(doc.empty === false && !emailList.includes(doc.docs[0].data().email)) {
    //        const data = doc.docs[0].data()
    //        emailList.push(data.email)
    //        setEmailList(emailList)
    //      }
    //     }
    //    })
    //   })
  }

  const sendEmails = () => {
    
    const showsForEmailRawDowntown = published.map(pubShow => {

      // const mC = pubShow.bookedshow.comics.mC && `MC: ${pubShow.bookedshow.comics.mC}`
      // const starMC = pubShow.bookedshow.comics.starMC && `Star MC: ${pubShow.bookedshow.comics.starMC}`
      // const a1 = pubShow.bookedshow.comics.a1 && `A1: ${pubShow.bookedshow.comics.a1}`
      // const b1 = pubShow.bookedshow.comics.b1 && `B1: ${pubShow.bookedshow.comics.b1}`
      // const star7 = pubShow.bookedshow.comics.star7 && `Star 7: ${pubShow.bookedshow.comics.star7}`
      // const yes = pubShow.bookedshow.comics.yes && `Yes: ${pubShow.bookedshow.comics.yes}`
      // const other = pubShow.bookedshow.comics.other.map((comic: { name: string,  type: string }) => `${comic.type}: ${comic.name}`).join('\n')
      
      // const arrayLineup = [mC, starMC, star7, a1, b1, yes].filter(line => line != '').join('\n')
      // const arrayLineup = Object.keys(pubShow.bookedshow.comics).map((key, index) => {
      //   if (pubShow.bookedshow.comics[key] != '') {

      //     return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${pubShow.bookedshow.comics[key]}`
      //   }
      // }
      
      //   //  `${pubShow.comics[key].charAt(0).toUpperCase() + pubShow.comics[key].slice(1)}: ${pubShow.comics[key]}`
  
      // ).filter(line => line != '').join('\n').replace(/(^[ \t]*\n)/gm, "")
      if (pubShow.bookedshow.club === 'downtown') {
        const arrayLineup = pubShow.comicArray.map((comic: { type: string, comic: string }) => `${comic.type.charAt(0).toUpperCase() + comic.type.slice(1)}: ${comic.comic}`).filter((line: string) => line != '').join('\n').replace(/(^[ \t]*\n)/gm, "")
  
        const showString = `${pubShow.bookedshow.headliner} ${pubShow.bookedshow.day} ${pubShow.bookedshow.date} ${pubShow.bookedshow.time} ${pubShow.bookedshow.club.charAt(0).toUpperCase() + pubShow.bookedshow.club.slice(1)}
  
${arrayLineup}
        `
      return `
${showString}`
      }

      })

      const showsForEmailRawSouth = published.map(pubShow => {

       
        if (pubShow.bookedshow.club === 'south') {
          const arrayLineup = pubShow.comicArray.map((comic: { type: string, comic: string }) => `${comic.type.charAt(0).toUpperCase() + comic.type.slice(1)}: ${comic.comic}`).filter((line: string) => line != '').join('\n').replace(/(^[ \t]*\n)/gm, "")
    
          const showString = `${pubShow.bookedshow.headliner} ${pubShow.bookedshow.day} ${pubShow.bookedshow.date} ${pubShow.bookedshow.time} ${pubShow.bookedshow.club.charAt(0).toUpperCase() + pubShow.bookedshow.club.slice(1)}
    
${arrayLineup}
          `
        return `
${showString}`
        }
  
        })

    const showsForEmailDowntown = `Downtown Shows----------------
${showsForEmailRawDowntown}`.replace(/,/g, '')

    const showsForEmailSouth = `South Shows----------------
${showsForEmailRawSouth}`.replace(/,/g, '')

    const showsForEmailRaw = `${showsForEmailDowntown}


${showsForEmailSouth}`

    if (outOfTowners) {
      emailList.map(email => sendEmail(email, showsForEmailRaw))
    } else {
      emailListWithOutTowners.map(email => sendEmail(email, showsForEmailRaw))
    }
    alert('Comics have been notified')
  }

  const removePublishedShow = async (id: string) => {

    await deleteDoc(doc (db,"publishedShows", id))
    fetchPublishedShows()
    setAdTrigger(!adTrigger)
  }

  const maskAsComic = async () => {

    const searchType = comicSearch.includes('@') ? 'email' : 'name'

    try {
      const docRef = query(collection(db, `comediansForAdmin`), where(`comedianInfo.${searchType}`, "==", comicSearch))
      const doc = await (getDocs(docRef))
      const comic = await doc.docs[0].data().comedianInfo
      setComedianMask({
        name: comic.name,
        id: comic.id,
        type: comic.type,
        email: comic.email,
        showsAvailabledowntown: comic.showsAvailabledowntown,
        showsAvailablesouth: comic.showsAvailablesouth,
        showsAvailabledowntownHistory: comic.showsAvailabledowntownHistory,
        showsAvailablesouthHistory: comic.showsAvailablesouthHistory
      })
    } catch (err) {
      const docRef = query(collection(db, `users`), where("name", "==", comicSearch))
      if (docRef.converter == null) {
        return alert('Comedian does not exist or incorrect name has been Entered')
      }
      const doc = await (getDocs(docRef))
      const comic = await doc.docs[0].data()
      setComedianMask({
        name: comic.name,
        id: comic.uid,
        type: comic.type,
        email: comic.email,
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
      })
      
      console.log(err)
    }
  }

  const addToWeek = () => {
    const idCheck = props.shows.map(show => show.id)
    if(!idCheck.includes(potentialShow?.id) ) {
      setNewSchedule([...props.shows, ...newSchedule])
      addDoc(collection(db, `shows for week`), {fireOrder: Date.now(), thisWeek: props.shows})
      fetchPublishedShows()
      reset()
    }
  }

  const changeComedianType = async () => {
   
      const db = getFirestore()
      const q = query(collection(db, "users"), where("uid", "==", comedianMask?.id)) 
      const docUser = await getDocs(q)
      const data = docUser.docs[0].data()
      data.type = type
      updateDoc(doc(db, `users/${comedianMask?.id}`), {...data, type: type})
      alert(`${comedianMask.name} is now filed as ${type}`)
  }

  const createNewComic = () => {

    createUserWithEmailAndPassword(auth, createNewComicEmail, createNewComicPassword)
    .then((userCredential) => {
      updateCurrentUser(auth, props.user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    })
  }

  return (
    <div className='admin-form'>
      <div className='mask-container'
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          maskAsComic()        
        }
      }}
      >
        <h3 className='shows-visible-to-comics'>Enter availabilty for comic using their name or email</h3>
        <input type='text' className='yes-spot' onChange={(e) => {
          setComicSearch(e.target.value)
          }}/>
      <input type='submit' className='submit-mask' onClick={() => maskAsComic()}/>
      </div>
  <h2 className='shows-visible-to-comics'>Current Comedian: {comedianMask.name}</h2>
  <div className='shows-visible-to-comics'>
  <h3 className='change-type-header'>{`Comic Type: ${type.charAt(0).toUpperCase() + type.slice(1) || props.comedian.type.charAt(0).toUpperCase() + props.comedian.type.slice(1)}`}</h3>
  <div
    onKeyUp={(e) => {
      if (e.key === "Enter" && type != '') {
        changeComedianType()  
        setAdTrigger(!adTrigger)      
      }
    }}
  >
    <div>
        <input type='radio' id='pro-radio' name='type' value='pro' onClick={() => setType('pro')}/>
        <label htmlFor='pro-radio'>Pro</label>
      </div>
      <div>
        <input type='radio' id='outOfTown' name='type' value='outOfTown'onClick={() => {
          if (type != '') {
            setType('OutOfTown')
          }
        }}/>
        <label htmlFor='outOfTown' >Out of Town Pro</label>
      </div>
      <button className='edit-show' onClick={() => changeComedianType()}>Submit Change of Type</button>
    </div>
  </div>
  <h2 className='shows-visible-to-comics'>Shows Visible To Comics</h2>
      <Week comedian={comedianMask} weeklyShowTimes={props.shows} admin={props.admin} fetchWeekForComedian={props.fetchWeekForComedian} weekOrder={props.weekOrder}/>
      <p className='admin-build'>Admin: Build Week of Upcoming Shows</p>
      <button className='clear-form' onClick={() => {
        reset()
        maskAsComic()
        }}>Clear/Reset Form</button>
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
        <input className='headliner-input' id='headliner-input'{...register('headliner')} required/>
        </div>
        <select className='club-select' {...register('supportStatus')}>
          <option value='support'>Support Is Needed</option>
          <option value='no-support'>No Support Needed</option>
        </select>
        <br></br>
        <input type='submit' value='Queue Show' className='add-show'/>
      </form>
     <div className='add-build'>
      <button onClick={() => addToWeek()} className='build-week'>Add Show to Week</button>
     {props.setShows && <button onClick={buildWeek} className='build-week'>Build Week</button>}
     </div>
     {showsToAddDowntown.length > 0 && <h2 className='downtown-available-header'>Downtown</h2>}
      {showsToAddDowntown}
      {showsToAddSouth.length > 0 && <h2 className='south-available-header'>South</h2>}
      {showsToAddSouth}
      <div>
      <div className='create-new-comic'>
          <label> New Comic Email
          <br></br>
            <input type='text' onChange={e => setCreateNewComicEmail(e.target.value)}/>
          </label>
          <label> New Comic Password
          <br></br>
            <input type='text' onChange={e => setCreateNewComicPassword(e.target.value)}/>
          </label>
          <button onClick={() => createNewComic()} className='create-comic-button'>Create Comic Profile</button>
        </div>
          <button className='published-shows' onClick={() => sendEmails()}>Email Schedule to Pros and Almost Famous</button> 
          <br></br>
          <label className='out-of-town'>Include Out of Town Pros<input type="checkbox" className='out-of-town-checkbox' defaultChecked={outOfTowners}
          onChange={() => setOutOfTowners(!outOfTowners)}/></label>
        {/* <button className='published-shows' onClick={() => fetchPublishedShows()}>See Queued Shows Page</button> */}
        {/* {published.length > 0 && <div id='seen-published'>
        <h2 className='downtown-available-header'>Downtown Bookings</h2>  
        {showPublishedDowntown()}
        <h2 className='south-available-header'>South Bookings</h2>
        {showPublishedSouth()} */}
        {/* <button className='build-week' onClick={() => sendEmails()}>Email to all comics</button></div>} */}
        
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