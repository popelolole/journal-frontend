import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ authority }) => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  if(authority){
    if(user!=null&&user.authorities.some(authorityItem => authorityItem.authority === authority))
      return <Outlet />
    else
      return <Navigate to="/login" />
  }
  else{
    if(user!=null)
      return <Outlet />
    else
      return <Navigate to="/login" />
  }
}

export default PrivateRoute;