import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.js';

const WelcomePage = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  return (
    <div>
      {user!=null ?
      <Header />
      :
      null
      }
      <h1>Medicinal Journal Application</h1>
      {user==null ?
      <Link to="/login">
        <button>Go to Login</button>
      </Link>
      :
      null
      }
    </div>
  );
};

export default WelcomePage;