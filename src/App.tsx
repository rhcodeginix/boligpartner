import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import "./App.css";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App = () => {
  useEffect(() => {
    const handleTab = (e: any) => {
      if (e.key === "Tab") {
        e.preventDefault();

        const focusable = Array.from(
          document.querySelectorAll(
            'input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el: any) => !el.disabled && el.offsetParent !== null);

        const index = focusable.indexOf((document as any).activeElement);
        const next = e.shiftKey ? index - 1 : index + 1;

        if (focusable.length > 0) {
          const nextElement: any =
            focusable[(next + focusable.length) % focusable.length];
          nextElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        toastOptions={{
          style: {
            zIndex: 999999999,
          },
        }}
      />
      <RouterProvider router={routes} />
    </QueryClientProvider>
  );
};
