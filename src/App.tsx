import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";
import "./App.css";
import { useEffect, useState } from "react";
import { PublicClientApplication, EventType, EventMessage, AuthenticationResult } from "@azure/msal-browser";
import { msalConfig } from "./lib/msalConfig";
import { MsalProvider } from "@azure/msal-react";

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// Set up event callbacks
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
        // Initialize MSAL first
        await msalInstance.initialize();
        
        // Handle redirect promise
        const response = await msalInstance.handleRedirectPromise();
        
        if (response !== null) {
          // Handle successful login
          msalInstance.setActiveAccount(response.account);
          console.log('MSAL redirect handled successfully', response);
        }
        
        console.log('MSAL initialized successfully');
        setMsalInitialized(true);
      } catch (error) {
        console.error('MSAL initialization failed:', error);
        setMsalInitialized(true); // Set to true anyway to prevent infinite loading
      }
    };

    initializeMsal();
  }, []);

  useEffect(() => {
    // Handle email parameter logic (for direct login links)
    const params = new URLSearchParams(window.location.search);
    const email = params.get("email");

    if (email) {
      localStorage.setItem("Iplot_admin_bolig", email);

      // Clean up URL
      params.delete("email");
      const newUrl =
        window.location.pathname +
        (params.toString() ? `?${params.toString()}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  useEffect(() => {
    // Enhanced tab handling logic with better accessibility
    const handleTab = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();

        const focusableElements = Array.from(
          document.querySelectorAll(
            'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"]):not([disabled])'
          )
        ).filter((el: any) => {
          return el.offsetParent !== null && !el.hasAttribute('aria-hidden');
        });

        const currentIndex = focusableElements.indexOf(document.activeElement as Element);
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

  // Show loading until MSAL is initialized
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
            position: 'top-right',
          }}
        />
        <RouterProvider router={routes} />
      </QueryClientProvider>
    </MsalProvider>
  );
};
