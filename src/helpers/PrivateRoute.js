import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({element}) => {
  const user = JSON.parse(sessionStorage.getItem('user'))
  return user!=null ? <Route element={element} /> : <Navigate to="/login" />
}

export default PrivateRoute;