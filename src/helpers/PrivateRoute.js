import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { jwtDecode } from 'jwt-decode';


const PrivateRoute = ({ authority }) => {
  const auth = useAuth();

	const isLoggedIn = auth.isAuthenticated;

  if(authority){
    const decodedToken = jwtDecode(auth.user.access_token);
    const realmRoles = decodedToken.realm_access?.roles || [];
    return isLoggedIn && realmRoles.includes(authority) ?
      <Outlet /> : <Navigate to="/" />
  }
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />
}

export default PrivateRoute;