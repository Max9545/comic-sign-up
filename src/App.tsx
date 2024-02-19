import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css';
import Login from './Login'
import Reset from './Reset'
import Dashboard from './Dashboard';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img className="header-logo" alt='Comedy Works Logo' src={require('./images/comedyworkslogo(1).png')}/>
        </header>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/reset' element={<Reset/>}/>
          <Route path='/dashboard/*' element={<Dashboard/>}/>
        </Routes>
    </div>
  )
}

export default App
