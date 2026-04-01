import { Navigate } from "react-router-dom";
import { verifyToken } from "../contexts/AuthContext";
import React from "react";

interface UserGuardProps {
  children: React.ReactNode;
}

const UserGuard: React.FC<UserGuardProps> = ({ children }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = verifyToken(token);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserGuard;
