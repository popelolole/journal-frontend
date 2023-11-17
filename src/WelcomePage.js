// WelcomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header.js';

const WelcomePage = () => {
  return (
    <div>
      <Header />
      <h1>Medicinal Journal Application</h1>
      <p>This is an epic journal app made by epic cool elias abraham lincoln</p>
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
    </div>
  );
};

export default WelcomePage;