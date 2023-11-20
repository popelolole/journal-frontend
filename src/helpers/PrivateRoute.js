import React from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  return user!=null ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute;