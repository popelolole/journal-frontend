import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login.js';
import WelcomePage from './pages/WelcomePage.js';
import { useState } from 'react';

const getUser = () => {
  return JSON.parse(sessionStorage.getItem('user'));
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path = "/" element = {<WelcomePage />} />
          <Route path = "/login" element = {getUser() == null ? <Login /> : <WelcomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
