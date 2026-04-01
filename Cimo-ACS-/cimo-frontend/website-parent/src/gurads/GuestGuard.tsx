import { Navigate } from "react-router-dom";

interface GuestGuardProps {
  children: React.ReactNode;
}

const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  const phone = localStorage.getItem("phone");

  if (!phone) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default GuestGuard;
