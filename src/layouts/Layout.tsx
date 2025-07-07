import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { Navbar } from "../components/Navbar";
import ScrollToTop from "../components/common/scrollToTop";
import { useIsAuthenticated } from "../hooks/useAuth";
import { analytics } from "../config/firebaseConfig";
import { logEvent } from "firebase/analytics";

export const Layout = () => {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="flex flex-col flex-grow">
      <ScrollToTop />
      <Navbar />
      <main className="">
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
