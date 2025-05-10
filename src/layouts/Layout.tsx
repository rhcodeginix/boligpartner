import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Spinner } from "../components/Spinner";
import { Navbar } from "../components/Navbar";
import ScrollToTop from "../components/common/scrollToTop";

export const Layout = () => {
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
