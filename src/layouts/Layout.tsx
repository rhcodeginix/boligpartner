import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { Navbar } from "../components/Navbar";
import ScrollToTop from "../components/common/scrollToTop";
import { useIsAuthenticated } from "../hooks/useAuth";

export const Layout = () => {
  const isAuthenticated = useIsAuthenticated();

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
