import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PublicRoute = () => {
  const { auth } = useContext(AuthContext);

  if (auth.token) {
    
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PublicRoute;
