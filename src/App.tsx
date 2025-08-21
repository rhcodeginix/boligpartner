import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import "./App.css";
import { useEffect, useState } from "react";
import {
  PublicClientApplication,
  EventType,
  EventMessage,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig } from "./lib/msalConfig";
import { MsalProvider } from "@azure/msal-react";

const msalInstance = new PublicClientApplication(msalConfig);

msalInstance.addEventCallback((event: EventMessage) => {
  if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
    const payload = event.payload as AuthenticationResult;
    const account = payload.account;
    msalInstance.setActiveAccount(account);
  }
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const App = () => {
  const [msalInitialized, setMsalInitialized] = useState(false);

  useEffect(() => {
    const initializeMsal = async () => {
      try {
        await msalInstance.initialize();

        const response = await msalInstance.handleRedirectPromise();

        if (response !== null) {
          msalInstance.setActiveAccount(response.account);
        }

        setMsalInitialized(true);
      } catch (error) {
        console.error("MSAL initialization failed:", error);
        setMsalInitialized(true);
      }
    };

    initializeMsal();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    if (email) {
      localStorage.setItem("Iplot_admin_bolig", email);

      params.delete("email");
      const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();

        const focusableElements = Array.from(
          document.querySelectorAll(
            'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'
          )
        ).filter((el: any) => {
          return el.offsetParent !== null && !el.hasAttribute("aria-hidden");
        });

        const currentIndex = focusableElements.indexOf(
          document.activeElement as Element
        );
        const nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;

        if (focusableElements.length > 0) {
          const nextElement = focusableElements[
            (nextIndex + focusableElements.length) % focusableElements.length
          ] as HTMLElement;
          nextElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, []);

  if (!msalInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Initializing authentication...</div>
        </div>
      </div>
    );
  }

  return (
    <MsalProvider instance={msalInstance}>
      <QueryClientProvider client={queryClient}>
        <Toaster
          toastOptions={{
            style: {
              zIndex: 999999999,
            },
            duration: 4000,
            position: "top-right",
          }}
        />
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </MsalProvider>
  );
};
