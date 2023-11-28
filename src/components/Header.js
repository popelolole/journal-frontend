import React from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const user = JSON.parse(sessionStorage.getItem('tokenJSON'));
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenJSON');
    window.location.reload(true);
  }
  console.log(user);
  console.log(user.role);

  return (
    <div className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {user&&user.role === "ROLE_PATIENT" ?
            <li className="nav-item">
              <Link to={`/journal/${user.personId}`} className="nav-link">
                My Journal
              </Link>
            </li>
          :
            null
          }
          {user&&user.role === "ROLE_DOCTOR" ?
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
        {user.username}
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
