import { collection, getDocs, query, doc, setDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from './firebase'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string, setSpecificComicHistoryDowntown: any, setSpecificComicHistorySouth: any, showTime: any, setcomicForHistory: any, date: string, alreadyBooked: any, setAdTrigger: any, adTrigger: any, supportStatus: string}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [comicHistory, setComicHistory] = useState<any[]>([])
  const [otherType, setOtherType] = useState('')
  const [otherName, setOtherName] = useState('')
  const [yes, setYes] = useState('')
  const [trigger, setTrigger] = useState(true)
  const [miscType, setMiscType] = useState('')
  const [bookedShow, setBookedShow] = useState<any>({
      day: props.day,
      headliner: props.headliner,
      time: props.time,
      club: props.club, 
      date: props.date,
      id: props.id,
      comics: {
        // mC: '',
        // a1: '',
        // b1: '',
        // starMC: '',
        // star7: '',
        // yes: '',
      }
  })
  
  useEffect(() => {
    setComics(props.availableComics)
  },[props])

  useEffect(() => {
    showFinalComicHistoryDowntown()
    showFinalComicHistorySouth()
  }, [comicHistory])

  const showFinalComicHistoryDowntown = () => {
    const historyStrings = comicHistory.reduce((acc, show, hisIndex) => {
        Object.entries(show.showsAvailabledowntownHistory).map((singleShow: any) => {
          singleShow.splice(0,1)
          if (!acc.includes(singleShow[0]) && singleShow[0].length > 0) {
            acc.push ({
              key: hisIndex,
              fireOrder: `${singleShow[0][0].fireOrder}`, 
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} ${finalShow.club.charAt(0).toUpperCase() + finalShow.club.slice(1)} ${finalShow.headliner} ${finalShow.time} ${finalShow.day.charAt(0).toUpperCase() + finalShow.day.slice(1)}`}</p></div>
              )
            })
          }
        })
        return acc
    }, [])
    const sorted = historyStrings.sort((a: any, b: any) => {
      return parseInt(a.fireOrder) - parseInt(b.fireOrder)
    })
    props.setSpecificComicHistoryDowntown(historyStrings)
  }

  const showFinalComicHistorySouth = () => {
    const historyStrings = comicHistory.reduce((acc, show, hisIndex) => {

        Object.entries(show.showsAvailablesouthHistory).map((singleShow: any) => {
          singleShow.splice(0,1)
          if (!acc.includes(singleShow[0]) && singleShow[0].length > 0) {
            acc.push ({
              key: hisIndex,
              fireOrder: `${singleShow[0][0].fireOrder}`, 
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} ${finalShow.club.charAt(0).toUpperCase() + finalShow.club.slice(1)} ${finalShow.headliner} ${finalShow.time} ${finalShow.day.charAt(0).toUpperCase() + finalShow.day.slice(1)}`}</p></div>
              )
            })
          }
        })
        return acc
    }, [])
    historyStrings.sort((a: any, b: any) => {
      return parseInt(a.fireOrder) - parseInt(b.fireOrder)
    })
    props.setSpecificComicHistorySouth(historyStrings)
  }

  const displayComicHistory = async (comic: string) => {
    
    props.setcomicForHistory(comic)

    const docRef = query(collection(db, `comedians/comicStorage/${comic}`))

    const doc = await (getDocs(docRef))

    setComicHistory(doc.docs.map(avail => avail.data().comedianInfo))
  }

  const setComedianType = (typeOfComic: string, comic: any) => {

    if (typeOfComic.includes('star')) {
      typeOfComic = '*' + typeOfComic.slice(4)
      console.log(typeOfComic)
    }
    
    console.log(typeOfComic)
    if (bookedShow.comics[typeOfComic.charAt(0).toUpperCase() + typeOfComic.slice(1)] == '') {
      bookedShow.comics[typeOfComic.charAt(0).toUpperCase() + typeOfComic.slice(1)] = comic
      setBookedShow(bookedShow)
    } else if (bookedShow.comics[typeOfComic.charAt(0).toUpperCase() + typeOfComic.slice(1)] === comic) {
        bookedShow.comics[typeOfComic.charAt(0).toUpperCase() + typeOfComic.slice(1)] = ''
        setBookedShow(bookedShow)
    } else if (bookedShow[typeOfComic.charAt(0).toUpperCase() + typeOfComic.slice(1)] !== comic) {
        bookedShow.comics[typeOfComic.charAt(0).toUpperCase() + typeOfComic.slice(1)] = comic
        setBookedShow(bookedShow)
    } 
  }

  const publishShow = async () => {
    const comicArray = Object.keys(bookedShow.comics).map((key, index) => {
      if (bookedShow.comics[key] != '')
      return {type: key, comic: bookedShow.comics[key]}
    }).filter(type => type != undefined)

    setDoc(doc(db, `publishedShows/${props.id}`), {bookedshow: bookedShow, fireOrder: Date.now(), comicArray: comicArray})
    alert('Show published!')
    props.setAdTrigger(!props.adTrigger)
  }

  const removeComic = (comicKey: string) => {
    bookedShow.comics[comicKey] = ''
    setBookedShow(bookedShow)
    setTrigger(!trigger)
  }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, key: string) => {
    event.dataTransfer.setData('text/plain', key)
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const key = event.dataTransfer.getData('text/plain')
    const newData = { ...bookedShow.comics }
    const keys = Object.keys(newData)
    const index = keys.indexOf(key)
    keys.splice(index, 1)
    keys.splice(Number(event.currentTarget.dataset.index), 0, key)
    const orderedData: { [key: string]: string } = {}
    keys.forEach((k) => {
      orderedData[k] = newData[k]
    })
    setBookedShow({...bookedShow, comics: orderedData})
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const editBooked = () => {
    const pos = props.alreadyBooked.filter((booked: any) => booked != undefined)
    if (pos[0]) {
      const childArray = pos[0].props.children.filter((child: any) => child.length)[0]
      const performers = childArray.map((child: { props: any }) => child.props.children)
      performers.map((performer: any) => {
        bookedShow.comics[performer.split(':')[0]] = performer.split(':')[1].slice(1)
        // .replace(/\s+/g, '')
      })
    }
    setBookedShow(bookedShow)
    setTrigger(!trigger)
  }

  const showComics = () => {
    const div = document.getElementById(`available-comics-list-${props.id}`)
    div!.style.display === 'contents' ? div!.style.display = 'none' : div!.style.display = 'contents'
  }

  return (
    <div className={`available-${props.club} avail-box`}>
      {props.alreadyBooked}
      {props.alreadyBooked.filter((show: any) => show != undefined).length > 0 && <button className='edit-show' onClick={() => editBooked()}>Edit Booked</button>}
        {props.supportStatus == 'no-support' && <p className='no-support-booked'>Self Contained</p>}
        <h3>Available {`${props.day} (${props.date}) ${props.headliner} ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}`}</h3>
        <button className='edit-show' onClick={() => showComics()}>See Comics</button>
      {Object.keys(bookedShow.comics).map((key, index) => (
        <div
          className='draggable'
          key={key}
          draggable
          onDragStart={(event) => handleDrag(event, key)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-index={index}
        >
          {bookedShow.comics[key].length > 0 && <div className='potential-booked-comic'>{`${key.includes('Star') ? '*' + key.slice(4) : key.charAt(0).toUpperCase() + key.slice(1)}: ${bookedShow.comics[key]}`}<button className='delete-potential-comic' onClick={() => removeComic(key)}>Delete</button></div>}
        </div>
      ))}
        {(bookedShow.comics.MC || bookedShow.comics['*MC'] || bookedShow.comics.A1 || bookedShow.comics.B1 || bookedShow.comics.Yes || bookedShow.comics['*7']) && <button className='add-show' onClick={() => publishShow()}>Publish Show</button>}  
      <div className='available-comics-list' id={`available-comics-list-${props.id}`}>
        <div>
    </div>
        <div className='comic-type-box'>{props.availableComics.map(comic => 
          <div className='available-comic' onClick={() => displayComicHistory(comic)} key={(comic as { name?: string })?.name}>
            <div>
             
            <p className='comic-avail' key={(comic as { name?: string })?.name}>{`${(comic as { name?: string })?.name}`}</p>
    {(comic as { note?: string })?.note && <p>{`${(comic as { note?: string })?.note}`}</p>}
</div>
            <p className='comic-type' onClick={() => setComedianType('mC', `${(comic as { name?: string })?.name}`)}>MC</p>
            <p className='comic-type' onClick={() => setComedianType('a1', `${(comic as { name?: string })?.name}`)}>A1</p>
            <p className='comic-type' onClick={() => setComedianType('b1', `${(comic as { name?: string })?.name}`)}>B1</p>
            <p className='comic-type' onClick={() => setComedianType('star7', `${(comic as { name?: string })?.name}`)}>*7</p>
            <p className='comic-type starMC' onClick={() => setComedianType('starMC', `${(comic as { name?: string })?.name}`)}>*MC</p>
            <div>
              <input type='text' className='pro-comic-type-input' onChange={(e) => setMiscType(e.target.value)}/>
              <button className='comic-type' onClick={() => setComedianType(miscType, `${(comic as { name?: string })?.name}`)}>Enter Type</button>
            </div>
          </div>)}
          <div className='yes-div'
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                bookedShow.comics.Yes = yes
                setBookedShow(bookedShow)
                setTrigger(!trigger)       
              }
            }}
          >
            {/* <label className='yes-spot'>Yes (Guest):</label>
            <input type='text' className='yes-spot-input' onChange={(event) => setYes(event?.target?.value)}/> */}
            {/* <button className='add-show' onClick={() => {
                bookedShow.comics.Yes = yes
                setBookedShow(bookedShow)
                setTrigger(!trigger)
            }}>Add</button> */}
          </div>
          <div className='other-block'
            onKeyUp={(e) => {
              if (e.key === "Enter" && otherName && otherType) {
                bookedShow.comics[otherType] = otherName
                setBookedShow(bookedShow)
                setTrigger(!trigger)        
              }
            }}
          >
            <label className='other-spot'>Other Type Comics:</label>
            <div className='other-div'>
            <label>Comic Type: </label>
            <input type='text' className='comic-type-input' onChange={(event) => setOtherType(event?.target?.value)}/>
          </div>
          <div className='other-div'>
            <label>Comic Name: </label>
            <input type='text' onChange={(event) => setOtherName(event?.target?.value)}/>
          </div>
            <button className='add-show' onClick={() => {
              if (otherName && otherType) {
                bookedShow.comics[otherType] = otherName
                setBookedShow(bookedShow)
                setTrigger(!trigger)
              }
            }}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowWithAvails