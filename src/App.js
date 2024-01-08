import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './components/Login.js';
import WelcomePage from './pages/WelcomePage.js';
import PrivateRoute from './helpers/PrivateRoute.js';
import JournalPage from './pages/JournalPage.js';
import PatientsPage from './pages/PatientsPage.js';
import MessagePage from './pages/MessagePage.js';
import { useState } from 'react';
import SearchPage from './pages/SearchPage.js';
import ImagePage from './pages/ImagePage.js';

const getUser = () => {
  return JSON.parse(sessionStorage.getItem('tokenJSON'));
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path = "/" element = {<WelcomePage />} />
          <Route element = {<PrivateRoute />}>
            <Route path = "/journal/:patientId" element = {<JournalPage />} />
            <Route path = "/messages/:personId/:name" element = {<MessagePage />} />
            <Route path = "/images" element = {<ImagePage />} />
            <Route element = {<PrivateRoute authority = "ROLE_DOCTOR" />} >
              <Route path = "/patients" element = {<PatientsPage />} />
              <Route path = "/search" element = {<SearchPage />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
