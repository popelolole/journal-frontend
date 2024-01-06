import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try{
    const response = await fetch(`https://raven-user-svc.app.cloud.cbh.kth.se/login?username=${username}&password=${password}`, {
      method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });
      if (!response.ok) {
        console.error('Login failed:', response.status, response.statusText);
        return;
      }
      const tokenString = await response.text();

      console.log(tokenString);

      sessionStorage.setItem('token', tokenString);

      let tokenParts = tokenString.split(":")
      let tokenJSON = {"id": tokenParts[0], "username": tokenParts[1], "role": tokenParts[2], "personId": tokenParts[3]};
      sessionStorage.setItem('tokenJSON', JSON.stringify(tokenJSON));

      navigate('/');

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };  

  return (
    <div>
      <h2>Login</h2>
      <form>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
