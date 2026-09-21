import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {

  const reduxToken = useSelector((state) => state.jwt);
  const localToken = localStorage.getItem("token");

  const token = reduxToken || localToken;

  if (token) {
    return children;
  }

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;