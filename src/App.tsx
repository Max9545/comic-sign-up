import React, { useEffect, useState } from 'react';
import { Route, Redirect, Routes, Link } from 'react-router-dom'
import './App.css';
import { Comic } from './interface'
import testData from './testData'
import Week from './Week'
import Admin from './Admin'

function App() {

  const [comedian, setComedian] = useState<Comic[] | []>([])
  const [shows, setShows] = useState([])

  useEffect(() => {
      setComedian(testData.testComedians[0])
  },[])

//   useEffect(() => {
//     setShows(testData.testShows)
// },[])  

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
        <Routes>
          <Route exact path='/' element={
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
