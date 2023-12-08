import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const user = JSON.parse(sessionStorage.getItem('tokenJSON'));

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenJSON');
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
          {user&&user.role === "ROLE_DOCTOR" ?
            <li className="nav-item">
              <Link to="/search" className="nav-link">
                Search
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
