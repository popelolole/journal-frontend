// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = (/*{ onLogout }*/) => {
  return (
    <div className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/my-journal" className="nav-link">
              My Journal
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/messages" className="nav-link">
              Messages
            </Link>
          </li>
        </ul>
      </nav>
      <button className="logout-button" /*onClick={onLogout}*/>
        Logout
      </button>
    </div>
  );
};

export default Header;
