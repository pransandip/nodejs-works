import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // useEffect(() => {
  //   localStorage.setItem('auth-token', 'Hi there');
  // }, []);
  const auth = localStorage.getItem('auth-token');
  return <>{auth ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRoute;
