import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // No token → user can access login/register
  if (!token) {
    return children;
  }

  try {
    const decodedToken = jwtDecode(token);

    // Token expired
    if (!decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return children;
    }

    // User already logged in → send to correct dashboard
    if (decodedToken.role === "STUDENT") {
      return <Navigate to="/student/dashboard" replace />;
    }

    if (decodedToken.role === "TEACHER") {
      return <Navigate to="/teacher/dashboard" replace />;
    }

    if (decodedToken.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return children;

  } catch (error) {
    localStorage.removeItem("token");
    return children;
  }
};

export default PublicRoute;