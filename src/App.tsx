import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './App.css';
import { Comic, ShowToBook } from './interface'
import testData from './testData'
import Week from './Week'
import Admin from './Admin'
import Login from './Login'

function App() {

  const [comedian, setComedian] = useState<Comic>(testData.testComedians[1])
  const [shows, setShows] = useState<[ShowToBook]>([{
    key: 0, 
    day: '', 
    time: '', 
    pay: '', 
    currentClub: '', 
    availableComedian: {}, 
    date: '', 
    id: '',
    headliner: '',
    club: ''}])

  // useEffect(() => {
  //     // const comedian = new <Comic/>
  //     setComedian(testData.testComedians[0])
  // },[])

  useEffect(() => {
    const toParse = localStorage.getItem('new-week')
    if (toParse !== null) {
      const parsedData = JSON.parse(toParse)
      setShows(parsedData)
    }
    
},[])  

  return (
    <div className="App">
      <header className="App-header">
        <img src={'https://media.glassdoor.com/sqll/508212/comedy-works-squarelogo-1432024977251.png'} className="App-logo" alt="logo" />
        <p>
          Let us know your availability
        </p>
        <p>
          Comedian Sign Up
        </p>
        <Link to={'admin'}>Administration</Link>
        <Link to={'/'}>Comedian Portal</Link>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/comic' element={
            <Week 
            comedian={comedian} 
            weeklyShowTimes={shows}/>}
            />
          <Route path='/admin' element={
            <Admin shows={shows} setShows={setShows}/>
          }/>

        </Routes>
        
      </header>
    </div>
  );
}

export default App;
