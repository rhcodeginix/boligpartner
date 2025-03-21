import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/useAuth";

export const AuthLayout = () => {
  if (useIsAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
