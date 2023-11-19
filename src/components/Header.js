import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    window.location.reload(true);
  }

  return (
    <div className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {user&&user.authorities.some(authorityItem => authorityItem.authority === "ROLE_PATIENT") ?
            <li className="nav-item">
              <Link to={`/journal/${user.person.id}`} className="nav-link">
                My Journal
              </Link>
            </li>
          :
            null
          }
          <li className="nav-item">
            <Link to="/messages" className="nav-link">
              Messages
            </Link>
          </li>
          {user&&user.authorities.some(authorityItem => authorityItem.authority === "ROLE_DOCTOR") ?
            <li className="nav-item">
              <Link to="/patients" className="nav-link">
                My Patients
              </Link>
            </li>
          :
            null
          }
        </ul>
      </nav>
      {user?
      <div>
        Welcome, {user.username}
      </div>
      :
      null
      }
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
