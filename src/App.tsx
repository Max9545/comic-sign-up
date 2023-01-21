import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Comic } from './interface'
import testComedians from './testData'
import Week from './Week'

function App() {

  const [comedians, setComedians] = useState<Comic[] | []>([])

  useEffect(() => {
 
      setComedians(testComedians.testData)
    
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={'https://media.glassdoor.com/sqll/508212/comedy-works-squarelogo-1432024977251.png'} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Comedian Sign Up
        </a>
        <Week clubType='Downtown'/>
      </header>
    </div>
  );
}

export default App;
