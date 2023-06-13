import { collection, getDocs, query, doc, setDoc, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from './firebase'


function ShowWithAvails(props: {availableComics: [], headliner: string, time: string, day: string, club: string, id: string, setSpecificComicHistoryDowntown: any, setSpecificComicHistorySouth: any, showTime: any, setcomicForHistory: any, date: string, alreadyBooked: any, setAdTrigger: any, adTrigger: any}) {
  
  const [comics, setComics] = useState<any[]>(props.availableComics)
  const [comicHistory, setComicHistory] = useState<any[]>([])
  const [otherType, setOtherType] = useState('')
  const [otherName, setOtherName] = useState('')
  const [yes, setYes] = useState('')
  const [trigger, setTrigger] = useState(true)
  const [bookedShow, setBookedShow] = useState<any>({
      day: props.day,
      headliner: props.headliner,
      time: props.time,
      club: props.club, 
      date: props.date,
      id: props.id,
      comics: {
        mC: '',
        a1: '',
        b1: '',
        starMC: '',
        star7: '',
        yes: '',
        // other: []
      }
  })
  
  useEffect(() => {
    setComics(props.availableComics)
    // showIfAlreadyPublished()
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
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} ${finalShow.club} ${finalShow.headliner} ${finalShow.time} ${finalShow.day}`}</p></div>
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
              showMap: singleShow[0].map((finalShow: { date: string; club: string; headliner: string; time: string; day: string, submissionDateTime: string, id: string}, index: number ) => <div key={`${index}${finalShow.id}`}><p key={index}>{`Submission Date and Time: ${finalShow.submissionDateTime.slice(0, 10)} ${props.showTime(finalShow.submissionDateTime.slice(-5))}`}</p><p>{`Show Signed Up For: ${finalShow.date} ${finalShow.club} ${finalShow.headliner} ${finalShow.time} ${finalShow.day}`}</p></div>
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
    if (bookedShow.comics[typeOfComic] == '') {
      console.log('should create')
      // const newBooking = {...bookedShow, [typeOfComic]: comic}
      bookedShow.comics[typeOfComic] = comic
      setBookedShow(bookedShow)
    } else if (bookedShow.comics[typeOfComic] === comic) {
        console.log('should be empty')
        // const newBooking = {...bookedShow, [typeOfComic]: ''}
        bookedShow.comics[typeOfComic] = ''
        setBookedShow(bookedShow)
    } else if (bookedShow[typeOfComic] !== comic){
      console.log('should replace')
      // const newBooking = {...bookedShow, [typeOfComic]: comic}
      bookedShow.comics[typeOfComic] = comic
      setBookedShow(bookedShow)
    } 
  }

  const publishShow = async () => {
    setDoc(doc(db, `publishedShows/${props.id}`), {bookedshow: bookedShow, fireOrder: Date.now()})
    alert('Show queued!')
    props.setAdTrigger(!props.adTrigger)
    // setBookedShow({...bookedShow, 
    //   comics: {
    //     mC: '',
    //     a1: '',
    //     b1: '',
    //     starMC: '',
    //     star7: '',
    //     yes: '',
    //     other: []
    //   }
    // })  
  }

  // const showIfAlreadyPublished = async () => {
  //   const q = query(collection(db, `publishedShows`))
  //   // where("id", '==', props.id))
  //        const doc = await getDocs(q)
  //        const shows =  doc.docs.map((show: { data: () => any} ) => show.data()) 
  // }

  const handleDrag = (event: React.DragEvent<HTMLDivElement>, key: string) => {
    event.dataTransfer.setData('text/plain', key);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const key = event.dataTransfer.getData('text/plain');
    const newData = { ...bookedShow.comics };
    const keys = Object.keys(newData);
    const index = keys.indexOf(key);
    keys.splice(index, 1);
    keys.splice(Number(event.currentTarget.dataset.index), 0, key);
    const orderedData: { [key: string]: string } = {};
    keys.forEach((k) => {
      orderedData[k] = newData[k];
    });
    setBookedShow({...bookedShow, comics: orderedData});
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };


  return (
    <div className={`available-${props.club} avail-box`}>
      {props.alreadyBooked}
      <div>
        <h3>Available {`${props.day} (${props.date}) ${props.headliner} ${props.time} ${props.club.charAt(0).toUpperCase() + props.club.slice(1)}`}</h3>
        {/* <p>{bookedShow.mC &&`MC: ${bookedShow.mC}`}</p>
        <p>{bookedShow.starMC &&`Star MC: ${bookedShow.starMC}`}</p>
        <p>{bookedShow.b1 &&`B1: ${bookedShow.b1}`}</p>
        <p>{bookedShow.a1 &&`A1: ${bookedShow.a1}`}</p>
        <p>{bookedShow.star7 &&`Star 7: ${bookedShow.star7}`}</p>
        <p>{bookedShow.yes &&`Yes: ${bookedShow.yes}`}</p>
        <div>{bookedShow.other.length > 0 && bookedShow.other.map((comic: { type: string; name: string }, index: string | number | null | undefined) => 
          <div className='other-type-comic' key={index}>
            <p>{`${comic.type}: ${comic.name}`}</p>
            <button onClick={() => {
              const booking = bookedShow
              booking.other.splice(bookedShow.other.findIndex((type: { type: string }) => type.type === comic.type), 1)
              setBookedShow(booking)
              setTrigger(!trigger)
            }} className='delete-comic'>Delete</button>
          </div>
        )}</div> */}
        <div>
      {Object.keys(bookedShow.comics).map((key, index) => (
        <div
          key={key}
          draggable
          onDragStart={(event) => handleDrag(event, key)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-index={index}
        >
          {bookedShow.comics[key].length > 0 && `${key.charAt(0).toUpperCase() + key.slice(1)}: ${bookedShow.comics[key]}`}
        </div>
      ))}
    </div>
        {(bookedShow.comics.mC || bookedShow.comics.starMC || bookedShow.comics.a1 || bookedShow.comics.b1 || bookedShow.comics.yes || bookedShow.comics.star7) && <button className='add-show' onClick={() => publishShow()}>Publish Show</button>}  
        <div className='comic-type-box'>{props.availableComics.map(comic => 
          <div className='available-comic' onClick={() => displayComicHistory(comic)} key={comic}>
            <p className='comic-avail' key={comic}>{`${comic}`}</p>
            <p className='comic-type' onClick={() => setComedianType('mC', comic)}>MC</p>
            <p className='comic-type' onClick={() => setComedianType('a1', comic)}>A1</p>
            <p className='comic-type' onClick={() => setComedianType('b1', comic)}>B1</p>
            <p className='comic-type' onClick={() => setComedianType('star7', comic)}>Star7</p>
            <p className='comic-type starMC' onClick={() => setComedianType('starMC', comic)}>Star MC</p>
          </div>)}
          <div className='yes-div'>
            <label className='yes-spot'>Yes (Guest):</label>
            <input type='text' className='yes-spot-input' onChange={(event) => setYes(event?.target?.value)}/>
            <button className='add-show' onClick={() => {
                console.log('hi')
                bookedShow.comics.yes = yes
                setBookedShow(bookedShow)
                setTrigger(!trigger)
                console.log(bookedShow.comics)
            }}>Add</button>
          </div>
          <div className='other-block'>
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
                // bookedShow.comics.other = [...bookedShow.comics.other, { type: otherType, name: otherName}]
                bookedShow.comics[otherType] = otherName
                setBookedShow(bookedShow)
                setTrigger(!trigger)
                console.log(bookedShow.comics)
              }
            }}>Add</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowWithAvails