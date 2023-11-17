import './App.css';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './Login.js';
import WelcomePage from './WelcomePage.js';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path = "/" element = {<WelcomePage />} />
          <Route path = "/login" element = {<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
