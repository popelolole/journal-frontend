import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.js';
import { useAuth } from 'react-oidc-context';

const WelcomePage = () => {
  const auth = useAuth();
  //const user = JSON.parse(sessionStorage.getItem('tokenJSON'));
  return (
    <div>
      {auth.isAuthenticated ?
      <Header />
      :
      null
      }
      <h1>Medicinal Journal Application</h1>
      {!auth.isAuthenticated ?
      <button onClick={() => auth.signinRedirect()}>
        Log in
      </button>
      :
      null
      }
    </div>
  );
};

export default WelcomePage;