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
        <img className="header-logo" src={'https://nts.comedyworks.com/uploads/images/comedyworkslogo.png'}/>
        </header>
        <p className='comedian-signup'> 
          Comedian Sign Up
        </p>
        <p className='available-example'>This red color means you are AVAILABLE to be booked for the this show</p>
        <p className='not-available-example'>This blue color means you are NOT available to be booked for this show</p>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/dashboard/*' element={<Dashboard/>}/>
        </Routes>
        
      
    </div>
  );
}

export default App;
