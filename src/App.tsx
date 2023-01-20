import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Comic } from './interface'
import testComedians from './testData'

function App() {

  const [comedians, setComedians] = useState<Comic[] | []>([])

  useEffect(() => {
 
      setComedians(testComedians.testData)
    
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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
      </header>
    </div>
  );
}

export default App;
