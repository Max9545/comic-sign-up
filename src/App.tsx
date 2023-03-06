import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Login from './Login'
import Reset from './Reset'
import Dashboard from './Dashboard';

function App() {

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
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/dashboard/*' element={<Dashboard/>}/>
        </Routes>
        
      </header>
    </div>
  );
}

export default App;
