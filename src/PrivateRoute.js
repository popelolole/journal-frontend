import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({children, user}) => {
  return user!=null ? children : <Navigate to="/login" />
}