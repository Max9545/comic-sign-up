import React, { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom'
import './App.css';
import { Comic, ShowToBook, WeekInter } from './interface'
import testData from './testData'
import Week from './Week'
import Admin from './Admin'

function App() {

  const [comedian, setComedian] = useState<Comic | {}>({})
  const [shows, setShows] = useState<ShowToBook[]>([])

  useEffect(() => {
      setComedian(testData.testComedians[0])
  },[])

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
        <Link to={'/'}>Comedians</Link>
        <Routes>
          <Route path='/' element={
            <Week 
            comedian={comedian} 
            weeklyShowTimes={shows}/>}
            />
          <Route exact path='/admin' element={
            <Admin shows={shows} setShows={setShows}/>
          }/>

        </Routes>
        
      </header>
    </div>
  );
}

export default App;
