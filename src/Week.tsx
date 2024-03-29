  import React from 'react'
  import { useEffect, useState } from 'react'
  import Show from './Show'
  import { Comic, ShowToBook } from './interface'
  import { setDoc, doc, addDoc, collection, query, getDocs, orderBy, limit, deleteDoc, where, updateDoc } from 'firebase/firestore'
  import { db } from './firebase'

  function Week(props: {comedian: Comic, weeklyShowTimes: [ShowToBook], admin: boolean, fetchWeekForComedian: any, weekOrder: string}) {

    const [shows, setShows] = useState<any[]>([])
    const [currentComedian, setCurrentComedian] = useState(props.comedian)
    const [allAvailablity, setAllAvailability] = useState(false)
    // const [comicNote, setComicNote] = useState('')
    let comicNote = ''
    // useEffect(() => {
    //   setCurrentComedian(props.comedian)
    // }, [props])

    // useEffect(() => {
    //   setShows(props.weeklyShowTimes)
    // })

    useEffect(() => {
      showDowntownShows()
      showSouthShows()
    }, [props])

    useEffect(() => {
      setCurrentComedian(props.comedian);
    }, [props]);

    useEffect(() => {
      setShows(props.weeklyShowTimes);
    }, [props]);


    const removePotentialShow = async (id: string) => {

      if (window.confirm("Are you Sure you want to delete this published show?")) {
        shows.splice(shows.indexOf(shows.find((show) => show.id === id)), 1)
        addDoc(collection(db, `shows for week`), {fireOrder: Date.now(), thisWeek: shows})
        props.fetchWeekForComedian()
      }
    }

    const showDowntownShows = () => {
      if(shows.length > 0) {
        return props.weeklyShowTimes.map((show, index) => { 
          if (show.club === 'downtown') {
            return <div key={index} className='show-div'>
                    {show.supportStatus === 'no-support' && props.admin && <p className='no-support'>Self <br></br> Contained</p>}
                    <Show
                        key={index}
                        id={show.id}
                        day={show.day}
                        time={show.time}
                        currentClub={show.club}
                        availableComedian={currentComedian}
                        date={show.date}
                        headliner={show.headliner}
                        availability={show.availableComics.includes(props.comedian.name) || show.availableComics.some((comic: { name: string }) => comic.name === props.comedian.name)
                        }
                        setAllAvailability={setAllAvailability}
                        availableComics={show.availableComics}
                        supportStatus={show.supportStatus}
                        clean={show.clean === 'clean'}
                        familyFriendly={show.familyFriendly === 'familyFriendly'}
                    />
                    
                    {props.admin && <button className='edit-published' onClick={() => removePotentialShow(show.id)}>Delete</button>}
                </div>
          } 
          })
        }
      }

      const showSouthShows = () => {
        if(shows.length > 0) {
          return props.weeklyShowTimes.map((show, index) => { 
            if (show.club === 'south') {
              return <div key={index} className='show-div'>
                      {show.supportStatus === 'no-support' && props.admin && <p className='no-support'>Self <br></br> Contained</p>}  
                      <Show
                          key={index}
                          id={show.id}
                          day={show.day}
                          time={show.time}
                          currentClub={show.club}
                          availableComedian={currentComedian}
                          date={show.date}
                          headliner={show.headliner}
                          availability={show.availableComics.includes(props.comedian.name) || show.availableComics.some((comic: { name: string }) => comic.name === props.comedian.name)
                        }                          
                          setAllAvailability={setAllAvailability}
                          availableComics={show.availableComics}
                          supportStatus={show.supportStatus}
                          familyFriendly={show.familyFriendly === 'familyFriendly'}
                          clean={show.clean === 'clean'}
                      />
                      
                      {props.admin && <button className='edit-published' onClick={() => removePotentialShow(show.id)}>Delete</button>}
                  </div>
            } 
            })
          }
        }

      const sendConfirmationEmail = async () => {

        const docRef = query(collection(db, `comedians/comicStorage/${currentComedian.name}`), orderBy('fireOrder', 'desc'), limit(1))

        const doc = await (getDocs(docRef))

        const comicHistory = doc.docs[0].data().comedianInfo

        const downtownArrays = Object.keys(comicHistory.showsAvailabledowntownHistory).map(day => {
          return currentComedian.showsAvailabledowntownHistory[day].map((show: any) => `${show.day.charAt(0).toUpperCase() + show.day.slice(1)} ${show.date} ${show.headliner} ${show.time} ${show.club.charAt(0).toUpperCase() + show.club.slice(1)}`)
        })

        downtownArrays.map(show => {
          if (show[0] != undefined) {
            return show.order = parseInt(show[0].replaceAll('-','').replace(/\D/g,''))
          }
        })

        const filteredDown = downtownArrays.filter(show => show[0] != undefined)

        const sortedDown = filteredDown.sort((a,b) => {
          return a.order - b.order
        })

        const downtownString = sortedDown.map(day => {
          if (day != '') {
            return `${day.toString()}`
          }
        }).join('\n').replaceAll(',', '\n').replace(/(^[ \t]*\n)/gm, "")
    
        const southArrays = Object.keys(comicHistory.showsAvailablesouthHistory).map(day => {
          return currentComedian.showsAvailablesouthHistory[day].map((show: any) => `${show.day.charAt(0).toUpperCase() + show.day.slice(1)} ${show.date} ${show.headliner} ${show.time} ${show.club.charAt(0).toUpperCase() + show.club.slice(1)}`)
        })

        southArrays.map(show => {
          if (show[0] != undefined) {
            return show.order = parseInt(show[0].replaceAll('-','').replace(/\D/g,''))
          }
        })

        const filteredSouth = southArrays.filter(show => show[0] != undefined)

        const sortedSouth = filteredSouth.sort((a,b) => {
          return a.order - b.order
        })

        const southString = sortedSouth.map(day => {
          if (day != '') {
            return `${day.toString()}`
          }
        }).join('\n').replaceAll(',', '\n').replace(/(^[ \t]*\n)/gm, "")

console.log(downtownString, southString)
  //       const emailData = {
  //         to: `${props.comedian.email}`,
  //         from: 'bregmanmax91@gmail.com',
  //         subject: 'Comedy Works availability you submitted',
  //         text: `Downtown: 
  // ${downtownString}

  // South:  
  // ${southString}`,
  //       }
        // fetch('https://comicsignuptestmail.comedyworks.com/w')
        // // .then((response) => response.json())
        // .then((data) => {
        //   console.log(data)
        // })


        // fetch('https://comicsignuptestmail.comedyworks.com/sendMail', {
        //   method: 'POST',
        //   // mode: 'no-cors',
        //   headers: {
        //     'Content-Type': 'application/json',
        //     // 'X-Requested-With': 'XMLHttpRequest',
        //     // 'Access-Control-Allow-Origin': '*'
        //   },
        
        //   body: JSON.stringify({email: props.comedian.email, message: `Downtown: 
        //   ${downtownString}
          
        //   South: 
        //   ${southString}`}),
        // })
        //   // .then((response) => console.log(response))
          
        //   .then((data) => {
        //     console.log(data) 
        //     console.log(data.json())
        //     console.log(currentComedian.email)
        //   })
        //   .catch((error) => {
        //     console.error('Error sending email', error, 'Hel;p')
        const getCurrentDayAndTime = () => {
          const now = new Date();
          const date = now.toLocaleDateString('en-US');
          const day = now.toLocaleDateString('en-US', { weekday: 'long' });
          const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          
          return `${day} ${date} at: ${time}`;
        };
        
        //   })
        try {
          const response = await fetch('https://comicsignuptestmail.comedyworks.com/sendMail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'Access-Control-Allow-Origin': 'http://localhost:3000', 
            },
            body: JSON.stringify({ email: props.comedian.email, sender: 'confirm', message: `Here is the availabilty you submitted ${getCurrentDayAndTime()}:

Downtown: 
${downtownString} 


South: 
${southString}
            
Comic's Note: ${comicNote}` }),
          });
      
          if (response.ok) {
            const data = await response.json();
            console.log('Email sent successfully:', data);
            console.log(currentComedian.email);
          } else {
            console.error('Error sending email:', response);
          }
        } catch (error) {
          console.error('Error sending email:', error);
        }
      }

    const submitForm = async (event: any) => {

      event.preventDefault()

      const downTownShowCount = Object.keys(currentComedian.showsAvailabledowntown).map(day => currentComedian.showsAvailabledowntown[day].map((show: any) => show)).flat().length
      
      const southShowCount = Object.keys(currentComedian.showsAvailablesouth).map(day => currentComedian.showsAvailablesouth[day].map((show: any) => show)).flat().length

      currentComedian.downTownShowCount += downTownShowCount
      currentComedian.southShowCount += southShowCount

      currentComedian.downTownWeekCount += 1
      currentComedian.southWeekCount += 1


console.log(currentComedian.uid, currentComedian.downTownWeekCount)
      const showRef = doc(db, "users", currentComedian.uid || currentComedian.id);
      // Set the "capital" field of the city 'DC'
      console.log(showRef)
      await updateDoc(showRef, {
        downTownShowCount: currentComedian.downTownShowCount,
        southShowCount: currentComedian.southShowCount,
        downTownWeekCount: currentComedian.downTownWeekCount,
        southWeekCount: currentComedian.southWeekCount,
      });
console.log(comicNote)
      setDoc(doc(db, `comediansForAdmin/${currentComedian.id || currentComedian.uid}`), {comedianInfo: currentComedian, fireOrder: Date.now(), note: comicNote || ''})
      addDoc(collection(db, `comedians/comicStorage/${currentComedian.name}`), {
        comedianInfo: currentComedian, 
        fireOrder: Date.now(), note: comicNote})
    
      
      
      console.log(currentComedian.downTownShowCount, currentComedian.southShowCount)
      
      sendConfirmationEmail()
      alert('Availability Submitted!! Check your email for verification of your latest availabilty')
    }

      return (
          <section className='show-container'>
            <div className='week-container'>
              <div>
                <h1 className='downtown-available-header'>Downtown</h1>
                {showDowntownShows()}
              </div>
              <div>
              <h1 className='south-available-header'>South</h1>
              {showSouthShows()}
              </div>
            </div>
            <p className='comic-note-label'>Add Additional Note Below</p>
            <br></br>
            <input type='text' className='comic-note' onChange={(e) => {
            comicNote = (e.target.value)
            }}/>
            <br></br>
            <button onClick={submitForm}type="submit" className='submit-btn'>
            Submit Availability
            </button>
            
          </section>
      )
  }

  export default Week



