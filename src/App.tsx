import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Comic } from './interface'
import testComedians from './testData'
import Week from './Week'

function App() {

  const [comedians, setComedians] = useState<Comic[] | []>([])
  const [clubType, setClubType] = useState()

  useEffect(() => {
 
      setComedians(testComedians.testData)
    
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={'https://media.glassdoor.com/sqll/508212/comedy-works-squarelogo-1432024977251.png'} className="App-logo" alt="logo" />
        <p>
          Let us know your availability
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Comedian Sign Up
        </a>
        <button onClick={() => setClubType('Downtown')}>Down Town</button>
        <button onClick={() => setClubType('South')}>South Club</button>
        <Week clubType={clubType}/>
      </header>
    </div>
  );
}

export default App;
