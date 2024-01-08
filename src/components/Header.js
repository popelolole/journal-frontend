import {React, useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { useAuth } from 'react-oidc-context';
import { jwtDecode } from 'jwt-decode';


const Header = () => {
  const auth = useAuth();

  const [roles, setRoles] = useState([]);
  const [personId, setPersonId] = useState();
  const [userName, setUserName] = useState();

  useEffect(() => {
    const extractInfo = () => {
      if (auth && auth.user && auth.user.access_token) {
        const decodedToken = jwtDecode(auth.user.access_token);
        const realmRoles = decodedToken.realm_access?.roles || [];
        setRoles(realmRoles);
        const personId = decodedToken.person_id;
        setPersonId(personId);
        const username = decodedToken.preferred_username;
        setUserName(username);
      }
    };

    extractInfo();
  }, [auth]);

  return (
    <div className="header">
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {auth.isAuthenticated&&roles.includes("ROLE_PATIENT") ?
            <li className="nav-item">
              <Link to={`/journal/${personId}`} className="nav-link">
                My Journal
              </Link>
            </li>
          :
            null
          }
          {auth.isAuthenticated&&roles.includes("ROLE_DOCTOR") ?
            <li className="nav-item">
              <Link to="/patients" className="nav-link">
                My Patients
              </Link>
            </li>
          :
            null
          }
          {auth.isAuthenticated&&roles.includes("ROLE_DOCTOR") ?
            <li className="nav-item">
              <Link to="/search" className="nav-link">
                Search
              </Link>
            </li>
          :
            null
          }
          <li className="nav-item">
            <Link to="/images" className="nav-link">
              Images
            </Link>
          </li>
        </ul>
      </nav>
      {auth.isAuthenticated?
      <div>
        {userName}
      </div>
      :
      null
      }
      <button className="logout-button" onClick={() => auth.removeUser()}>
        Logout
      </button>
    </div>
  );
};

export default Header;
