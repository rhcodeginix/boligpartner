import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/useAuth";

export const AuthLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  if (isAuthenticated) {
    return <Navigate to={"/Husmodell"} replace />;
  }

  return <Outlet />;
};
