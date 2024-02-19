// import { initializeApp } from 'firebase-admin/app';
// const app = initializeApp();
// import * as firebase from 'firebase/app';
import { useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import Show from './Show' 
import { Comic, ShowToBook } from './interface'
import { addDoc, collection, query, getDocs, DocumentData, deleteDoc, doc, where, getFirestore, setDoc, updateDoc, orderBy, limit } from "firebase/firestore"
import { db } from './firebase'
import ShowWithAvails from './ShowWithAvails'
import Week from './Week'
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, updateCurrentUser, deleteUser, updateProfile } from "firebase/auth"
import ComediansGrid from './ComediansGrid'
import { preProcessFile } from 'typescript'
const auth = getAuth();


function Admin(props: {shows: [ShowToBook], setShows: any, setWeekSchedule: any, weekSchedule: any, comedian: any, weeklyShowTimes: any, admin: boolean, fetchWeekForComedian: any, weekOrder: string, user: any, comedians: any }) {

  const [newSchedule, setNewSchedule] = useState<any[]>([])
  const [showsToAddDowntown, setShowsToAddDowntown] = useState<any[]>([])
  const [showsToAddSouth, setShowsToAddSouth] = useState<any[]>([])
  const [day, setDay] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [type, setType] = useState('')
  const [downtownShowsGrid, setDownTownShowsGrid] = useState([])
  const [newComicType, setNewComicType] = useState('')
  const [signedShowsDown, setSignedShowsDown] = useState<any[]>([])
  const [signedShowsSouth, setSignedShowsSouth] = useState<any[]>([])
  const [specificComicHistoryDowntown, setSpecificComicHistoryDowntown] = useState<any[]>([])
  const [specificComicHistorySouth, setSpecificComicHistorySouth] = useState<any[]>([])
  const [comicForHistory, setcomicForHistory] = useState('')
  const [showsForEmailRawString, setShowsForEmailRawString] = useState('')
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
  const [inactiveBool, setInactiveBool] = useState(false)
  const [proEmails, setProEmails] = useState<string[]>([])
  const [outOfTownEmails, setOutOfTownEmails] = useState<string[]>([])
  const [almostFamousEmails, setAlmostFamousEmails] = useState<string[]>([])
  const [inactiveEmails, setInactiveEmails] = useState<string[]>([])
  const [emailListWithNoInactive, setEmailListWithNoInactive] = useState([])
  const [emailWithNoAlmostFamous, setEmailWithNoAlmostFamous] = useState()
  const [createNewComicPassword, setCreateNewComicPassword] = useState('')
  const [createNewComicName, setCreateNewComicName] = useState('')
  const [createNewComicAddress, setCreateNewComicAddress] = useState('')
  const [createNewComicPhone, setCreateNewComicPhone] = useState('')
  const [createNewComicClean, setCreateNewComicClean] = useState(false)
  const [createNewComicFamFriendly, setCreateNewComicFamFriendly] = useState(false)
  const [weekVisibility, setWeekVisibility] = useState(false)
  const [comicToDelete, setComicToDelete] = useState('')
  const [buildShowVisible, setBuildShowVisible] = useState(false)
  const [comicBuildVisible, setComicBuildVisible] = useState(false)
  const [enterAvailabilityForComic, setEnterAvailabilityForComic] = useState(false)
  const [emailComics, setEmailComics] = useState(false)
  const [comicProfiles, setComicProfiles] = useState(false)
  const [downtownLong, setDowntownLong] = useState(false)
  const [southLong, setSouthLong] = useState(false)
  const [almostFamous, setAlmostFamous] = useState(true)
  const [profiles, setProfiles] = useState<DocumentData[]>([])
  const [searchQuery, setSearchQuery] = useState('');
  const [publishedShows, setPublishedShows] = useState<DocumentData[]>([])
  const [publishedVisible, setPublishedVisible] = useState(false)
  const [prosEmailBool, setProsEmailBool] = useState<boolean>(false);
const [almostFamousEmailBool, setAlmostFamousEmailBool] = useState<boolean>(false);
const [outOfTownersEmailBool, setOutOfTownersEmailBool] = useState<boolean>(false);

  
  const [gridVisible, setGridVisible] = useState(true)
  const [selectedButtons, setSelectedButtons] = useState({
    availabiltyForComics: false,
    buildShows: false,
    createNewComic: false,
    changeComicType: false,
    emailComics: false,
    downtownLong: false,
    southLong: false,
    gridVisible: true,
    comicProfiles: false,
    publishedVisible: false
  });

  

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    setComicEmailList()
  }, [])

  // useEffect(() => {
  //   console.log('pro emails state', proEmails);
  // }, [proEmails]);
  
  // useEffect(() => {
  //   console.log('outOfTownEmails', outOfTownEmails);
  // }, [outOfTownEmails]);
  
  // useEffect(() => {
  //   console.log('almostFamousEmails', almostFamousEmails);
  // }, [almostFamousEmails]);
  
  // useEffect(() => {
  //   console.log('inactiveEmails', inactiveEmails);
  // }, [inactiveEmails]);
  

  useEffect(() => {
    const fetchData = async () => {
      const docRef = query(collection(db, 'publishedShows'));
      const docSnap = await getDocs(docRef);
      if (!docSnap.empty) {
        const data = docSnap.docs.map(doc => doc.data());
        setPublishedShows(data); // Ensure data is treated as DocumentData[]

      }
    };

    fetchData();
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

  useEffect(() => {
    const fetchData = async () => {
      const docRef = query(collection(db, 'users'));
      const docSnap = await getDocs(docRef);
      if (!docSnap.empty) {
        const data = docSnap.docs.map(doc => doc.data());
        setProfiles(data); // Ensure data is treated as DocumentData[]

      }
    };

    fetchData();
  }, [comicProfiles])

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
                    familyFriendly={newShow.familyFriendly === 'familyFriendly'}
                    clean={newShow.clean === 'clean'}
                    availableComedian={{
                      name: 'admin',
                      id: '',
                      type: '',
                      email: '',
                      downTownShowCount: 0,
                      southShowCount: 0,
                      downTownWeekCount: 0,
                      southWeekCount: 0,
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
                  {newShow.supportStatus === 'no-support' && props.admin && <p className='no-support'>Self <br></br> Contained</p>}
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
              familyFriendly={newShow.familyFriendly === 'familyFriendly'}
              clean={newShow.clean === 'clean'}
              availableComedian={{
                name: 'admin',
                id: '',
                type: '',
                email: '',
                downTownShowCount: 0,
                southShowCount: 0,
                downTownWeekCount: 0,
                southWeekCount: 0,
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
            {newShow.supportStatus === 'no-support' && props.admin && <p className='no-support'>Self <br></br> Contained</p>}
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
        
          comedian.comedianInfo.showsAvailabledowntown[`${show.day.toLowerCase()}`].map((downTownShow: string, index: any) => {
            if (show.id == downTownShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
              availabeComedians.push({name: comedian.comedianInfo.name, note: comedian.note, id: index})
              show.availableComics = availabeComedians
            }
          })
        })
        // @ts-ignore
        setDownTownShowsGrid(downtownShows)
        const showFinals = downtownShows.map((finalForm, index) => {

        const alreadyBooked = published.map(show => {
          if (show.bookedshow.id == finalForm.id) {
            return <div className={`published-${show.bookedshow.club}`} key={index}>
          <h3>Booked {show.bookedshow.day} {`(${show.bookedshow.date})`} {show.bookedshow.headliner} {show.bookedshow.time} {show.bookedshow.club.charAt(0).toUpperCase() + show.bookedshow.club.slice(1)}</h3>
          {show.comicArray.map((comic: { type: any; comic: string }, pinDext: any) =>  <p key={pinDext} >{comic.type && `${comic.type.includes('Star') ? '*' + comic.type.slice(4) : comic.type.charAt(0).toUpperCase() + comic.type.slice(1)}: ${comic.comic}`}</p>)}
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
      
      comedian.comedianInfo.showsAvailablesouth[`${show.day.toLowerCase()}`].map((southShow: string, index: any) => {
        if (show.id == southShow && !availabeComedians.includes(comedian.comedianInfo.name)) {
          availabeComedians.push({name: comedian.comedianInfo.name, note: comedian.note, id:index})
          show.availableComics = availabeComedians
        }
      })
    })

         

    const showFinals = southShows.map((finalForm, index) => {

    const alreadyBooked = published.map((show) => {
      if (show.bookedshow.id == finalForm.id) {
        return <div className={`published-${show.bookedshow.club}`} key={index}>
      <h3>Booked {show.bookedshow.day} {`(${show.bookedshow.date})`} {show.bookedshow.headliner} {show.bookedshow.time} {show.bookedshow.club.charAt(0).toUpperCase() + show.bookedshow.club.slice(1)}</h3>

      {show.comicArray.map((comic: { type: any; comic: string }, pinDext: any) =>  <p key={`${pinDext}`} >{comic.type && `${comic.type.includes('Star') ? '*' + comic.type.slice(4) : comic.type.charAt(0).toUpperCase() + comic.type.slice(1)}: ${comic.comic}`}</p>)}
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

  const sendEmail = async (comicsEmail: any, showsForEmail: any) => {

    // const emailData = {
    //   to: `${comicsEmail}`,
    //   from: 'bregmanmax91@gmail.com',
    //   subject: 'Comedy Works Upcoming Lineup',
    //   text: `${showsForEmail}`,
    // }
  
    // fetch('http://localhost:3001/send-email', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(emailData),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data.message)
    //   })
    //   .catch((error) => {
    //     console.error('Error sending email', error)
    //   })
    try {
      const response = await fetch('https://comicsignuptestmail.comedyworks.com/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': 'http://localhost:3000', 
        },
        body: JSON.stringify({email: comicsEmail, message: `${showsForEmail}`}),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Email sent successfully:', data);
      } else {
        console.error('Error sending email:', response);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }


  const setComicEmailList = async () => {

    setEmailList([])

    const docRef = query(collection(db, `users`))

    const doc = await (getDocs(docRef))

    // const emails = doc.docs.map(user => user.data().email)

    // setEmailList(emails)
    // setEmailListWithOutTowners([])

    const pros = doc.docs.filter(comic =>  comic.data().type == 'pro').map((comic: any ) => comic.data().email)

    console.log(pros)

    setProEmails(pros)
    console.log('pro emails state', pros)

    const outOfTown = doc.docs.filter(comic =>  comic.data().type == 'OutOfTown').map((comic: any ) => comic.data().email)

    console.log(outOfTown)

    setOutOfTownEmails(outOfTown)
    console.log('outOfTownEmails', outOfTownEmails)

    const almostFamous = doc.docs.filter(comic =>  comic.data().type == 'AlmostFamous').map((comic: any ) => comic.data().email)

    console.log(almostFamous)
    setAlmostFamousEmails(almostFamous)

console.log('almostFamousEmails', almostFamousEmails)
    const inactive = doc.docs.filter(comic =>  comic.data().type == 'Inactive').map((comic: any ) => comic.data().email)

    console.log(inactive)
    setInactiveEmails(inactive)
    console.log('inactiveEmails', inactiveEmails)

    // const withoutOutTowners = doc.docs.filter(comic =>  comic.data().type != 'OutOfTown')

    // const withoutOutTownersOrInactive = doc.docs.filter(comic =>  comic.data().type != 'OutOfTown' && comic.data().type != 'Inactive')
    // const emailsWithoutOutTowners = withoutOutTowners.map((comic: any ) => comic.data().email)

    // setEmailListWithOutTowners(emailsWithoutOutTowners)

    // @ts-ignore
    // setEmailListWithNoInactiveOrOutTown(withoutOutTownersOrInactive)
    // // const docRefOut = query(collection(db, `users`), where('type', '!=', 'outOfTown'))
    // const withoutOutInactive = doc.docs.filter(comic =>  comic.data().type !='Inactive').map((comic: any ) => comic.data().email)
    // // @ts-ignore
    // setEmailListWithNoInactive(withoutOutInactive)
    // // const docOut = await (getDocs(docRefOut))


    // const withoutOutAlmostFamous = doc.docs.filter(comic =>  comic.data().type !='AlmostFamous').map((comic: any ) => comic.data().email)
    // // @ts-ignore
    // setEmailWithNoAlmostFamous(withoutOutAlmostFamous)
    // // const emailsOut = docOut.docs.map(user => user.data().email)

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

  const sendEmails = async () => {
    const emailList: string[] = [];
    if (prosEmailBool) emailList.push(...proEmails);
    if (almostFamousEmailBool) emailList.push(...almostFamousEmails);
    if (outOfTownersEmailBool) emailList.push(...outOfTownEmails);
    if (inactiveBool) emailList.push(...inactiveEmails);

    console.log("Email list:", emailList);

    const fetchData = async () => {
        const docRef = query(collection(db, 'publishedShows'));
        const docSnap = await getDocs(docRef);
        if (!docSnap.empty) {
            const data = docSnap.docs.map(doc => doc.data());
            setPublished(data); // Ensure data is treated as DocumentData[]

            console.log(data);

            // Process logic dependent on 'published' state here
            const showsForEmailRawDowntown = data.map(pubShow => {
                if (pubShow.bookedshow.club === 'downtown') {
                    const arrayLineup = pubShow.comicArray.map((comic: { type: string, comic: string }) => `${comic.type.charAt(0).toUpperCase() + comic.type.slice(1)} ${comic.comic}`).filter((line: string) => line != '').join('\n').replace(/(^[ \t]*\n)/gm, "");
                    const showString = `${pubShow.bookedshow.headliner} ${pubShow.bookedshow.day} ${pubShow.bookedshow.date} ${pubShow.bookedshow.time} ${pubShow.bookedshow.club.charAt(0).toUpperCase() + pubShow.bookedshow.club.slice(1)}\n\n${arrayLineup}\n`;
                    return `${showString}`;
                }
            });

            const showsForEmailRawSouth = data.map(pubShow => {
                if (pubShow.bookedshow.club === 'south') {
                    const arrayLineup = pubShow.comicArray.map((comic: { type: string, comic: string }) => `${comic.type.charAt(0).toUpperCase() + comic.type.slice(1)} ${comic.comic}`).filter((line: string) => line != '').join('\n').replace(/(^[ \t]*\n)/gm, "");
                    const showString = `${pubShow.bookedshow.headliner} ${pubShow.bookedshow.day} ${pubShow.bookedshow.date} ${pubShow.bookedshow.time} ${pubShow.bookedshow.club.charAt(0).toUpperCase() + pubShow.bookedshow.club.slice(1)}\n\n${arrayLineup}\n`;
                    return `${showString}`;
                }
            });

            const showsForEmailDowntown = `Downtown Shows----------------\n${showsForEmailRawDowntown}`.replace(/,/g, '');
            const showsForEmailSouth = `South Shows----------------\n${showsForEmailRawSouth}`.replace(/,/g, '');

            const showsForEmailRaw = `Below is the schedule for the following shows. Please be aware of which club you are to perform in.\n\n${showsForEmailDowntown}\n\n${showsForEmailSouth}`;

            // Update showsForEmailRawString state
            setShowsForEmailRawString(showsForEmailRaw);
            console.log(showsForEmailRawString);

            // Once showsForEmailRawString is set, send emails
            emailList.forEach(async email => {
                try {
                  console.log(email, showsForEmailRaw)
                    const response = await fetch('https://comicsignuptestmail.comedyworks.com/sendMail', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // 'Access-Control-Allow-Origin': 'http://localhost:3000', 
                        },
                        body: JSON.stringify({ email: 'bregmanmax91@gmail.com', message: showsForEmailRaw }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Email sent successfully:', data);
                    } else {
                        console.error('Error sending email:', response);
                    }
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            });

            alert('Comics have been notified');
        }
    };

    await fetchData();
};

  

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
        downTownShowCount: comic.downTownShowCount,
        southShowCount: comic.southShowCount,
        downTownWeekCount: comic.downTownWeekCount,
        southWeekCount: comic.southWeekCount,
        showsAvailabledowntown: comic.showsAvailabledowntown,
        showsAvailablesouth: comic.showsAvailablesouth,
        showsAvailabledowntownHistory: comic.showsAvailabledowntownHistory,
        showsAvailablesouthHistory: comic.showsAvailablesouthHistory
      })
    } catch (err) {
      const docRef = query(collection(db, `users`), where(searchType, "==", comicSearch))
      if (docRef.converter == null) {
        return alert('Comedian does not exist or incorrect name has been entered')
      }
      const doc = await (getDocs(docRef))
      const comic = await doc.docs[0].data()
      setComedianMask({
        name: comic.name,
        id: comic.uid,
        type: comic.type,
        email: comic.email,
        downTownShowCount: comic.downTownShowCount,
        southShowCount: comic.southShowCount,
        downTownWeekCount: comic.downTownWeekCount,
        southWeekCount: comic.southWeekCount,
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
   
    comedianMask.type = type
    const db = getFirestore()
    const q = query(collection(db, "users"), where("uid", "==", comedianMask?.id)) 
    const docUser = await getDocs(q)
    const data = docUser.docs[0].data()
    data.type = type
    updateDoc(doc(db, `users/${comedianMask?.id}`), {...data, type: type})
    
    // const docRef = query(collection(db, `comedians/comicStorage/${comedianMask.name}`), orderBy('fireOrder', 'desc'), limit(1))
    const docRef = query(collection(db, `comediansForAdmin`), where("comedianInfo.id", "==", comedianMask.id))
    const docTwo = await (getDocs(docRef))
    updateDoc(doc(db, `comediansForAdmin/${comedianMask.id}`), {"comedianInfo.type": comedianMask.type})
    alert(`${comedianMask.name} is now filed as ${type}`) 
    setAdTrigger(!adTrigger)
  }

  const createNewComic = async () => {

    if (createNewComicName && createNewComicEmail && createNewComicPassword && createNewComicAddress && createNewComicPhone) {
      createUserWithEmailAndPassword(auth, createNewComicEmail, createNewComicPassword)
      .then(async (userCredential) => {
        await updateProfile(userCredential.user, {displayName: createNewComicName})
        await updateCurrentUser(auth, props.user)
        setDoc(doc(db, `users/${userCredential.user.uid}`), {
          email: userCredential.user.email, 
          uid: userCredential.user.uid, 
          type: newComicType || 'pro', 
          allowed: true, name:  
          createNewComicName, 
          admin: newComicType === 'admin', 
          address: createNewComicAddress, 
          clean: createNewComicClean, 
          famFriendly: createNewComicFamFriendly,
          phone: createNewComicPhone,
          downTownShowCount: 0,
          southShowCount: 0,
          downTownWeekCount: 0,
          southWeekCount: 0,
        })
        await updateCurrentUser(auth, props.user)
        setDoc(doc(db, `comediansForAdmin/${userCredential.user.uid}`), {comedianInfo: {
          name: createNewComicName,
          id: userCredential.user.uid,
          type: newComicType || 'pro',
          admin: newComicType === 'admin',
          email: userCredential.user.email,
          address: createNewComicAddress,
          clean: createNewComicClean,
          famFriendly: createNewComicFamFriendly,
          phone: createNewComicPhone,
          downTownShowCount: 0,
          southShowCount: 0,
          downTownWeekCount: 0,
          southWeekCount: 0,
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
        }, fireOrder: Date.now()})
        alert(`${createNewComicName} at ${userCredential.user.email} has been added`)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Comic not added due to error: ${errorMessage}`)
      })
    } else {
      alert("Email, name, password, address, and phone number are needed to submit a new comic. If unknown enter 'N/A' for now.")
    }

    try {
      const response = await fetch('https://comicsignuptestmail.comedyworks.com/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': 'http://localhost:3000', 
        },
        body: JSON.stringify({email: createNewComicEmail, message: `Hello ${createNewComicName}, this is an email to inviting you to use https://comicsignuptest.comedyworks.com in order to give the club your weekly availability. Your login username is this email you provided the club and your initial password is 
        ${createNewComicPassword} 
and you will need to change your password after your first login to something that is private and known only to you.

The rules for submitting your availability remain the same. Your last availability submitted by Tuesday at 5PM is what will be used to book the shows. 
               
You will receive confirmation emails to this email address each time you submit your availability. The schedule each week will be emailed as well. 
        
        `}),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Email sent successfully:', data);
      } else {
        console.error('Error sending email:', response);
      }
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  const deleteComic = async () => {
    
    const searchPhrase = comicToDelete.includes('@') ? 'email' : 'name'

    const confirmation = window.confirm(`Are you sure you want to remove ${comicToDelete}\'s access to the site?`)
    if (confirmation) {
      const db = getFirestore()
      const q = query(collection(db, "users"), where(`${searchPhrase}`, "==", comicToDelete)) 
      const docUser = await getDocs(q)
      const data = docUser.docs[0].data()
      updateDoc(doc(db, `users/${data.uid}`), {allowed: false})
      alert(`${comicToDelete} is no longer allowed access`)
    }
  }

  // const gatherStats = async () => {

  //   console.log('down',comedianMask.downTownShowCount, 'south', comedianMask.southShowCount)

    // const comediansRef = collection(db, `comedians/comicStorage/${comedianMask.name}`)
    // // const shows = query(comediansRef, where("name", "==", `${comedianMask.name}`))
    // const docShows = await getDocs(comediansRef)
    // const downTownShows: any[] = []
    // const data = docShows.docs.map(show => {

    //   downTownShows.push(show)

    // console.log(Object.values(show.data().comedianInfo.showsAvailabledowntown), ' yes')
    // })
    // console.log(downTownShows)
  // }
  const toggleWeekVisibility = () => {
    setWeekVisibility(!weekVisibility);
  };

  const toggleBuildShowVisible = () => {
    setBuildShowVisible(!buildShowVisible);
  };

  const toggleComicBuildVisible = () => {
    setComicBuildVisible(!comicBuildVisible);
  };

  const toggleEnterAvailabilityForComic = () => {
    setEnterAvailabilityForComic(!enterAvailabilityForComic);
  };

  const toggleEmailComics = () => {
    setEmailComics(!emailComics);
  };

  const toggleComicProfiles = () => {
    setComicProfiles(!comicProfiles);
  };

  const toggledowntownLong = () => {
    setDowntownLong(!downtownLong);
  };

  const toggleSouthLong = () => {
    setSouthLong(!southLong);
  };
  const toggleGridVisible = () => {
    setGridVisible(!gridVisible);
  };

  const togglePublishedVisible = () => {
    setPublishedVisible(!publishedVisible);
  };

  const handleButtonClick = (buttonName: string) => {
    setSelectedButtons(prevState => ({
      ...prevState,
      [buttonName]: !prevState[buttonName]
    }));

    // Add your button click logic here
    if (buttonName === 'availabiltyForComics') {
      // Logic for the "Enter Availabilty For Comics" button
      toggleWeekVisibility(); // Assuming this function toggles visibility
    } else if (buttonName === 'gridVisible') {
      // Logic for the "Build Shows" button
      toggleGridVisible(); // Assuming this function toggles visibility
    }else if (buttonName === 'buildShows') {
      // Logic for the "Build Shows" button
      toggleBuildShowVisible(); // Assuming this function toggles visibility
    } else if (buttonName === 'createNewComic') {
      // Logic for the "Create New Comic" button
      toggleComicBuildVisible(); // Assuming this function toggles visibility
    } else if (buttonName === 'changeComicType') {
      // Logic for the "Change Comic Type" button
      toggleEnterAvailabilityForComic(); // Assuming this function toggles visibility
    } else if (buttonName === 'emailComics') {
      // Logic for the "Change Comic Type" button
      toggleEmailComics(); // Assuming this function toggles visibility
    } else if (buttonName === 'downtownLong') {
      // Logic for the "Change Comic Type" button
      toggledowntownLong(); // Assuming this function toggles visibility
    } else if (buttonName === 'southLong') {
      // Logic for the "Change Comic Type" button
      toggleSouthLong(); // Assuming this function toggles visibility
    } else if (buttonName === 'comicProfiles') {
      // Logic for the "Change Comic Type" button
      toggleComicProfiles(); // Assuming this function toggles visibility
    } else if (buttonName === 'publishedVisible') {
      // Logic for the "Change Comic Type" button
      togglePublishedVisible(); // Assuming this function toggles visibility
    } 
  };

    const displayProfiles = (listToUse: string) => {

      if (listToUse === 'all') {
        return profiles.map(profile => {
          console.log(profile)
          return <div className='profile'>
                    <div className='profile-contact-info'>
                      <h1 className='profile-headers'>{profile.name}</h1>
                      <h3 className='profile-headers'>{profile.email}</h3>
                      <h4 className='profile-headers'>{profile.phone}</h4>
                    </div>
                    <div className='profile-type'>
                      <h2 className='profile-headers'>{profile.type === 'pro' ? 'Pro' : profile.type === 'AlmostFamous' ? 'Almost Famous' : profile.type === 'OutOfTown' ? 'Out of Town Pro' : 'Inactive'}</h2>
                      <h4 className='profile-headers'>Clean: {profile.clean ? 'True' : 'False'}</h4>
                      <h4 className='profile-headers'>Family Friendly: {profile.famFriendly ? 'True' : 'False'}</h4>
                      <h5 className='profile-headers'>Allowed: {profile.allowed ? 'True' : 'False'}</h5>
                      </div>
                      <div className='profile-stats'>
                        <p className='profile-headers'>Downtown Show Sign Up Count: {profile.downTownShowCount}</p>
                        <p className='profile-headers'>South Show Sign Up Count: {profile.southShowCount}</p>
                        <p className='profile-headers'>Down Town Weeks Submitted: {profile.downTownWeekCount}</p>
                        <p className='profile-headers'>South Weeks Submitted: {profile.southWeekCount}</p>
                      
                    </div>
                  </div>
        })
      } else if (listToUse === 'filtered') {
        return filteredProfiles.map(profile => {
          console.log(profile)
          return <div className='profile'>
                    <div className='profile-contact-info'>
                      <h1 className='profile-headers'>{profile.name}</h1>
                      <h3 className='profile-headers'>{profile.email}</h3>
                      <h4 className='profile-headers'>{profile.phone}</h4>
                    </div>
                    <div className='profile-type'>
                      <h2 className='profile-headers'>{profile.type === 'pro' ? 'Pro' : profile.type === 'AlmostFamous' ? 'Almost Famous' : profile.type === 'OutOfTown' ? 'Out of Town Pro' : 'Inactive'}</h2>
                      <h4 className='profile-headers'>Clean: {profile.clean ? 'True' : 'False'}</h4>
                      <h4 className='profile-headers'>Family Friendly: {profile.famFriendly ? 'True' : 'False'}</h4>
                      <h5 className='profile-headers'>Allowed: {profile.allowed ? 'True' : 'False'}</h5>
                      </div>
                      <div className='profile-stats'>
                        <p className='profile-headers'>Downtown Show Sign Up Count: {profile.downTownShowCount}</p>
                        <p className='profile-headers'>South Show Sign Up Count: {profile.southShowCount}</p>
                        <p className='profile-headers'>Down Town Weeks Submitted: {profile.downTownWeekCount}</p>
                        <p className='profile-headers'>South Weeks Submitted: {profile.southWeekCount}</p>
                      
                    </div>
                  </div>
        })
      }

      
    }



// allowed
// true
// (boolean)




// downTownShowCount
// 0
// (number)


// downTownWeekCount
// 0
// (number)



// southShowCount
// 0
// (number)


// southWeekCount
// 0
// (number)

const handleSearch = (event: { target: { value: React.SetStateAction<string> } }) => {
  setSearchQuery(event.target.value);
};

const filteredProfiles = profiles.filter(profile => {
  return Object.values(profile).some(value =>
    typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase())
  );
});


const filteredPublishedShows = publishedShows.filter(show => {
  // Helper function to check if a value contains the search query
  const containsQuery = (value: string) =>
    typeof value === 'string' && value.toLowerCase().includes(searchQuery.toLowerCase());

  // Function to search through nested objects recursively
  const searchObject = (obj: DocumentData) => {
    for (const key in obj) {
      if (key === 'availableComics') continue; // Skip searching the availableComics array
      const value = obj[key];
      if (containsQuery(value)) {
        return true; // Found a match
      }
      if (Array.isArray(value)) {
        // Search through array elements
        if (value.some(item => typeof item === 'object' && searchObject(item))) {
          return true; // Found a match
        }
      } else if (typeof value === 'object') {
        // Recursively search through nested objects
        if (searchObject(value)) {
          return true; // Found a match
        }
      }
    }
    return false; // No match found
  };

  // Check if the show matches the search query
  const match = searchObject(show);
  return match;
});




  const displayBookedShows = (type: string) => {
    if (type == 'all') {
      return publishedShows.map(show => {
        return <div className='profile' key={show.bookedshow.id}>
        <div className='profile-contact-info'>
          <h2 className='profile-headers'>{show.bookedshow.headliner} {show.bookedshow.date}</h2>
          <h3 className='profile-headers'>{show.bookedshow.time} {show.bookedshow.day} {show.bookedshow.club.charAt(0).toUpperCase() + show.bookedshow.club.slice(1)}</h3>
          {/* <h4 className='profile-headers'>{show.bookedshow.date}</h4> */}
          <h4 className='profile-headers'>{show.time}</h4>
        </div>
    
    
        <div className='profile-contact-info'>
          <h2 className='profile-headers'>Comics</h2>
          {show.comicArray.map((comic: { comic: string, type: string }) => {
            return <>
            <p>{comic.comic}: {comic.type}</p>
            </>
          })}
          </div>
    
    
        <div className='profile-stats'>
          {/* <h2 className='profile-headers'>Day: {show.bookedshow.day}</h2> */}
          <h4 className='profile-headers'>Clean: {show.bookedshow.clean ? 'True' : 'False'}</h4>
          <h4 className='profile-headers'>Family Friendly: {show.bookedshow.familyFriendly ? 'True' : 'False'}</h4>
          <h4 className='profile-headers'>Needed Support: {show.bookedshow.supportStatus ? 'True' : 'False'}</h4>
          {/* Add other relevant show details */} 
        </div>
      </div>
      })  
    } else {
      return filteredPublishedShows.map(show => {
        return <div className='profile' key={show.bookedshow.id}>
        <div className='profile-contact-info'>
          <h2 className='profile-headers'>{show.bookedshow.headliner} {show.bookedshow.date}</h2>
          <h3 className='profile-headers'>{show.bookedshow.time}  {show.bookedshow.day} {show.bookedshow.club.charAt(0).toUpperCase() + show.bookedshow.club.slice(1)}</h3>
          {/* <h4 className='profile-headers'>{show.bookedshow.date}</h4> */}
          <h4 className='profile-headers'>{show.time}</h4>
        </div>
    
    
        <div className='profile-contact-info'>
          <h2 className='profile-headers'>Comics</h2>
          {show.comicArray.map((comic: { comic: string, type: string }) => {
            return <>
            <p>{comic.comic}: {comic.type}</p>
            </>
          })}
          </div>
    
    
        <div className='profile-stats'>
          {/* <h2 className='profile-headers'>Day: {show.bookedshow.day}</h2> */}
          <h4 className='profile-headers'>Clean: {show.bookedshow.clean ? 'True' : 'False'}</h4>
          <h4 className='profile-headers'>Family Friendly: {show.bookedshow.familyFriendly ? 'True' : 'False'}</h4>
          {/* Add other relevant show details */} 
        </div>
      </div>
      })
    }
  

  } 
  
  

  return (
    <div className='admin-container'>
      <div className="sidebar">
      <button 
          className={selectedButtons.gridVisible ? 'highlighted' : ''}
          onClick={() => handleButtonClick('gridVisible')}
        >
        Grid Availability Sheet
        </button>
      <button 
          className={selectedButtons.downtownLong ? 'highlighted' : ''}
          onClick={() => handleButtonClick('downtownLong')}
        >
          Book Downtown Long Form
        </button>
        <button 
          className={selectedButtons.southLong ? 'highlighted' : ''}
          onClick={() => handleButtonClick('southLong')}
        >
          Book South Long Form
        </button>
        <button 
          className={selectedButtons.emailComics ? 'highlighted' : ''}
          onClick={() => handleButtonClick('emailComics')}
        >
          Email Booked Shows To Comics
        </button>
        <button 
          className={selectedButtons.availabiltyForComics ? 'highlighted' : ''}
          onClick={() => handleButtonClick('availabiltyForComics')}
        >
          Comic View and Enter Availabilty For Comic
        </button>
        <button 
          className={selectedButtons.buildShows ? 'highlighted' : ''}
          onClick={() => handleButtonClick('buildShows')}
        >
          Build Shows
        </button>
        <button 
          className={selectedButtons.createNewComic ? 'highlighted' : ''}
          onClick={() => handleButtonClick('createNewComic')}
        >
          Create New Comic/Delete Comic
        </button>
        
        <button 
          className={selectedButtons.changeComicType ? 'highlighted' : ''}
          onClick={() => handleButtonClick('changeComicType')}
        >
          Change Comic Type
        </button>
        <button 
          className={selectedButtons.comicProfiles ? 'highlighted' : ''}
          onClick={() => handleButtonClick('comicProfiles')}
        >
          User Profiles
        </button>
        <button 
          className={selectedButtons.publishedVisible ? 'highlighted' : ''}
          onClick={() => handleButtonClick('publishedVisible')}
        >
          Booked Show History
        </button>
      </div>
        <div className='admin-form'>
      {/* @ts-ignore */}
      {gridVisible && <ComediansGrid comedians={props.comedians} shows={props.shows} />}
      {enterAvailabilityForComic && <><div className='mask-container'
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              maskAsComic()
            }
          } }
        >
          <h3 className='shows-visible-to-comics'>Enter availabilty for comic using their name or email</h3>
          <input type='text' className='yes-spot' onChange={(e) => {
            setComicSearch(e.target.value)
          } } />
          <input type='submit' className='submit-mask' onClick={() => maskAsComic()} />

        </div>
          <h2 className='shows-visible-to-comics'>Current Comedian: {comedianMask.name}</h2>
    {comedianMask.downTownShowCount > 0 &&  <div className='shows-visible-to-comics'>{`Total Downtown Show Signups: ${comedianMask.downTownShowCount}`}</div>}
    {comedianMask.southShowCount > 0 && <div className='shows-visible-to-comics'>{`Total South Show Signups: ${comedianMask.southShowCount}`}</div>}
    {comedianMask.downTownWeekCount > 0 && <div className='shows-visible-to-comics'>{`Total Downtown Week Signups: ${comedianMask.downTownWeekCount}`}</div>}
    {comedianMask.southWeekCount > 0 && <div className='shows-visible-to-comics'>{`Total South Week Signups: ${comedianMask.southWeekCount}`}</div>}
    <div className='shows-visible-to-comics'>
    <h3 className='change-type-header'>{`Comic Type: ${comedianMask.type.charAt(0).toUpperCase() + comedianMask.type.slice(1) || props.comedian.type.charAt(0).toUpperCase() + props.comedian.type.slice(1)}`}</h3>
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
      <input type='radio' id='outOfTown' name='type' value='outOfTown'onClick={() => {setType('OutOfTown')}}/>
      <label htmlFor='outOfTown' >Out of Town Pro</label>
    </div>
    <div>
      <input type='radio' id='almostFamous' name='type' value='almostFamous'onClick={() => {setType('AlmostFamous')}}/>
      <label htmlFor='almostFamous' >Almost Famous</label>
    </div>
    <div>
      <input type='radio' id='inactive' name='type' value='inactive'onClick={() => {setType('Inactive')}}/>
      <label htmlFor='inactive' >Inactive</label>
    </div>
      <button className='edit-show' onClick={() => changeComedianType()}>Submit Change of Type</button>
    </div>
  </div></>}
  {/* <h2 className='shows-visible-to-comics' onClick={() => toggleWeekVisibility()}>Shows Visible To Comics</h2> */}
      {weekVisibility && <>
        {/* <h2 className='shows-visible-to-comics'>Enter Availabilty For a Comic</h2> */}
      <div className='mask-container'
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              maskAsComic()
            }
          } }
        >
          <h3 className='shows-visible-to-comics'>Enter availabilty for comic using their name or email</h3>
          <input type='text' className='yes-spot' onChange={(e) => {
            setComicSearch(e.target.value)
          } } />
          <input type='submit' className='submit-mask' onClick={() => maskAsComic()} />

        </div>
          <h2 className='shows-visible-to-comics'>Current Comedian: {comedianMask.name}</h2>
    {comedianMask.downTownShowCount > 0 &&  <div className='shows-visible-to-comics'>{`Total Downtown Show Signups: ${comedianMask.downTownShowCount}`}</div>}
    {comedianMask.southShowCount > 0 && <div className='shows-visible-to-comics'>{`Total South Show Signups: ${comedianMask.southShowCount}`}</div>}
    {comedianMask.downTownWeekCount > 0 && <div className='shows-visible-to-comics'>{`Total Downtown Week Signups: ${comedianMask.downTownWeekCount}`}</div>}
    {comedianMask.southWeekCount > 0 && <div className='shows-visible-to-comics'>{`Total South Week Signups: ${comedianMask.southWeekCount}`}</div>}
    <div className='shows-visible-to-comics'>
    <h3 className='change-type-header'>{`Comic Type: ${comedianMask.type.charAt(0).toUpperCase() + comedianMask.type.slice(1) || props.comedian.type.charAt(0).toUpperCase() + props.comedian.type.slice(1)}`}</h3>
    {/* <div
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
      <input type='radio' id='outOfTown' name='type' value='outOfTown'onClick={() => {setType('OutOfTown')}}/>
      <label htmlFor='outOfTown' >Out of Town Pro</label>
    </div>
    <div>
      <input type='radio' id='almostFamous' name='type' value='almostFamous'onClick={() => {setType('AlmostFamous')}}/>
      <label htmlFor='almostFamous' >Almost Famous</label>
    </div>
    <div>
      <input type='radio' id='inactive' name='type' value='inactive'onClick={() => {setType('Inactive')}}/>
      <label htmlFor='inactive' >Inactive</label>
    </div>
      <button className='edit-show' onClick={() => changeComedianType()}>Submit Change of Type</button>
    </div> */}
  </div><Week comedian={comedianMask} weeklyShowTimes={props.shows} admin={props.admin} fetchWeekForComedian={props.fetchWeekForComedian} weekOrder={props.weekOrder}/></>}
      {/* <p className='admin-build' onClick={() => toggleBuildShowVisible()}>Admin: Build Week of Upcoming Shows</p> */}
      { buildShowVisible && <>
        <p className='admin-build'>Admin: Build Week of Upcoming Shows</p>
      <button className='clear-form' onClick={() => {
        reset()
        maskAsComic()
      } }>Clear/Reset Form</button><form className='admin-input' onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor='club-select'>CHOOSE CLUB:</label>
          <select className='club-select' {...register('club')}>
            <option value='downtown'>Downtown</option>
            <option value='south'>South</option>
          </select>
          <label className='date'>Date:</label>
          <input className='day' {...register('date')} type='date' required onChange={(event) => showDay(event.target.value)} />
          <div className='day-of-week'>{` which is a ${day}`}</div>
          <div>
            <label>Time: </label>
            <input className='time-input' {...register('time')} type='time' onChange={(event) => showTime(event?.target.value)} required />
          </div>
          <div>
            <label>Headliner: </label>
            <input className='headliner-input' id='headliner-input' {...register('headliner')} required />
          </div>
          <select className='club-select' {...register('supportStatus')}>
            <option value='support'>Support Is Needed</option>
            <option value='no-support'>No Support Needed</option>
          </select>
          <br></br>
          <select className='club-select' {...register('clean')}>
            <option value='not-clean'>Not Clean</option>
            <option value='clean'>Clean</option>
          </select>
          <select className='club-select' {...register('familyFriendly')}>
            <option value='not-familyFriendly'>Not Family Friendly</option>
            <option value='familyFriendly'>Family Friendly</option>
          </select>
          <br></br>
          <input type='submit' value='Queue Show' className='add-show' />
        </form>
        <div className='add-build'>
          <button onClick={() => addToWeek()} className='build-week'>Add Show to Week</button>
          {props.setShows && <button onClick={buildWeek} className='build-week'>Build Week</button>}
        </div>
     {showsToAddDowntown.length > 0 && <h2 className='downtown-available-header'>Downtown</h2>}
      {showsToAddDowntown}
      {showsToAddSouth.length > 0 && <h2 className='south-available-header'>South</h2>}
      {showsToAddSouth}</>}
       
        {/* <h2 className='admin-build' onClick={() => toggleComicBuildVisible()}>Create New Comic/Delete Comic</h2> */}
        {comicBuildVisible && <div>
          <h2 className='admin-build'>Create New Comic/Delete Comic</h2>
          <div className='create-new-comic'
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            createNewComic()        
          }
        }}
      >
          <label> New Comic Email
            <br></br>
            <input type='text' required onChange={e => setCreateNewComicEmail(e.target.value.trim())}/>
          </label>
          <label> New Comic Name
            <br></br>
            <input type='text' required onChange={e => setCreateNewComicName(e.target.value)}/>
          </label>
          <label className='new-comic-password'> New Comic Password
            <br></br>
            <input type='text' required onChange={e => setCreateNewComicPassword(e.target.value)}/>
          </label>
          <label className='new-comic-address'> New Comic Address
            <br></br>
            <input type='text' required onChange={e => setCreateNewComicAddress(e.target.value)}/>
          </label>
          <label className='new-comic-phone'> New Comic Phone
            <br></br>
            <input type='text' required onChange={e => setCreateNewComicPhone(e.target.value)} maxLength={14}/>
          </label>
          <div className='create-new-comic-type-box'>
            <div>
              <input type='radio' id='new-pro' name='new-comic-type' value='pro' onClick={() => setNewComicType('pro')} defaultChecked/>
              <label htmlFor='new-pro'>Pro</label>
            </div>
            <div>
              <input type='radio' id='new-outOfTown' name='new-comic-type' value='outOfTown'onClick={() => {setNewComicType('OutOfTown')}}/>
              <label htmlFor='new-outOfTown'>Out of Town Pro</label>
            </div>
            <div>
              <input type='radio' id='new-almostFamous' name='new-comic-type' value='almostFamous'onClick={() => {setNewComicType('AlmostFamous')}}/>
              <label htmlFor='new-almostFamous'>Almost Famous</label>
            </div>
            <div>
              <input type='radio' id='new-admin' name='new-comic-type' value='admin'onClick={() => {setNewComicType('admin')}}/>
              <label htmlFor='new-admin'>Administrator</label>
            </div>
          </div>
          <div>
            <label htmlFor="clean">Can Comic Do Clean?</label>
            <input type="radio" id="clean-true" name="clean" value="cleanTrue" className='create-comic-radio-label' onClick={(e) => setCreateNewComicClean(true)} />
            <label className='create-comic-radio-label'>True</label>
            <input type="radio" id="clean-false" name="clean" value="false" onClick={(e) => setCreateNewComicClean(false)} defaultChecked/>
            <label className='create-comic-radio-label'>False</label>
          </div>

          <div>
            <label htmlFor="famFriendly">Can Comic Do Family Friendly?</label>
            <input type="radio" id="famFriendly-true" name="famFriendly" value="famFriendlyTrue" className='create-comic-radio-label' onClick={(e) => setCreateNewComicFamFriendly(true)} />
            <label className='create-comic-radio-label'>True</label>
            <input type="radio" id="famFriendly-false" name="famFriendly" value="false" onClick={(e) => setCreateNewComicFamFriendly(false)} defaultChecked/>
            <label className='create-comic-radio-label'>False</label>
          </div>
          <button value='Create Comic Profile' onClick={() => createNewComic()} className='create-comic-button'>
            Create Comic Profile
          </button>
        </div>
        <div className='create-new-comic'
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              deleteComic()        
            }
          }}
        >
          <label> Comic To Delete (By Name or Email)
            <br></br>
            <input type='text' onChange={e => setComicToDelete(e.target.value)}/>
          </label>
          <button onClick={() => deleteComic()} className='create-comic-button'>Delete Comic Profile</button>
        </div>
        </div>}
          {emailComics && <><button className='published-shows' onClick={() => sendEmails()}>Email Schedule to the Following Types</button><br></br>
          <label className='out-of-town'>Include Pros<input type="checkbox"
           className='out-of-town-checkbox'
            onChange={() => setProsEmailBool(!prosEmailBool)}/></label>
          <label className='out-of-town'>Include Almost Famous<input type="checkbox"
           className='out-of-town-checkbox'
            onChange={() => setAlmostFamousEmailBool(!almostFamousEmailBool)}/></label>
          <label className='out-of-town'>Include Out of Town Pros<input type="checkbox" className='out-of-town-checkbox' defaultChecked={outOfTowners}
            onChange={() => setOutOfTownersEmailBool(!outOfTownersEmailBool)} /></label>
            <label className='out-of-town'>Include Inactive<input type="checkbox" className='out-of-town-checkbox'
            onChange={() => setInactiveBool(!inactiveBool)} /></label>
            
            
            </>}
        {downtownLong && <><h2 className='downtown-available-header'>Downtown Available Comics</h2>
          <div>{signedShowsDown.map(availShow => availShow)}</div></>}
        {southLong && <><h2 className='south-available-header'>South Club Available Comics</h2>
          <div>{signedShowsSouth.map(availShow => availShow)}</div></>}
      {comicProfiles && <>
          <input
          type="text"
          placeholder="Search profiles..."
          value={searchQuery}
          onChange={handleSearch}
          className='profile-search'
        />
        {searchQuery ? <div>{displayProfiles('filtered')}</div> : <div>{displayProfiles('all')}</div>}
      </>}
      {publishedVisible && <>
        {publishedShows && <>
          <input
          type="text"
          placeholder="Search Booked Shows..."
          value={searchQuery}
          onChange={handleSearch}
          className='profile-search'
          />
          {searchQuery ? <div>{displayBookedShows('filtered')}</div> : <div>{displayBookedShows('all')}</div>}
        </>}
      </>}
      {/* {comicForHistory && <h2 className='comic-of-history'>Availability History for {comicForHistory}</h2>}
      {comicForHistory && <h2 className='downtown-available-header'>Downtown Availability History</h2>} */}
      {/* {specificComicHistoryDowntown.map((show, index) => <div key={index} className='comicHistory-show'>{show.showMap}</div>)} */}
      {/* {comicForHistory && <h2 className='south-available-header'>South Club Availability History</h2>} */}  
      {/* {specificComicHistorySouth.map((show, index) => <div key={index} className='comicHistory-show'>{show.showMap}</div>)} */}
    </div>
    </div>
  )
}

export default Admin