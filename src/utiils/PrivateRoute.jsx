import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { auth } = useContext(AuthContext);
  const token = auth.token || localStorage.getItem('token');

  if (!token) {
    
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
