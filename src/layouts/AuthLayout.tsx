import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/useAuth";
import { useEffect } from "react";
import { analytics } from "../config/firebaseConfig";
import { logEvent } from "firebase/analytics";

export const AuthLayout = () => {
  const isAuthenticated = useIsAuthenticated();

  const location = useLocation();

  useEffect(() => {
    if (analytics) {
      logEvent(analytics, "page_view", {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [location]);

  if (isAuthenticated) {
    return <Navigate to={"/Husmodell"} replace />;
  }

  return <Outlet />;
};
