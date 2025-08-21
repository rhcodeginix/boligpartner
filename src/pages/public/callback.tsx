import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  AuthenticationResult,
  RedirectRequest,
} from "@azure/msal-browser";
import { Spinner } from "../../components/Spinner";

const loginRequest: RedirectRequest = {
  scopes: ["user.read"],
};

export const MicrosoftCallBack = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  console.log("page call--------------------");
  console.log("inProgress:", inProgress);

  useEffect(() => {
    console.log("useeffect--------------------");

    const initializeAndHandle = async () => {
      try {
        console.log("after function--------------------", instance);

        // Check if MSAL instance is available
        if (!instance) {
          console.error("MSAL instance not available");
          setLoading(false);
          return;
        }

        console.log("instance-------------------", instance);

        // Wait for MSAL to be fully initialized
        if (!initialized) {
          console.log("Waiting for MSAL initialization...");
          // Check if instance has the initialize method and call it
          if (typeof instance.initialize === "function") {
            await instance.initialize();
          }
          setInitialized(true);
        }

        // Handle login redirect result
        console.log("Handling redirect promise...");
        const response = await instance.handleRedirectPromise();
        console.log("Redirect response:", response);

        if (response?.account) {
          console.log("Login success", response.account);
          // Store user info or redirect as needed
          // Example: navigate to dashboard
          // window.location.href = '/dashboard';
        }

        // If user account exists, get the token silently
        if (accounts.length > 0) {
          try {
            const tokenResponse: AuthenticationResult =
              await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
              });
            console.log("Token acquired silently:", tokenResponse);

            const token = tokenResponse.accessToken;
            console.log("Access Token:", token);
          } catch (tokenError) {
            // If silent token acquisition fails, initiate redirect
            if (tokenError instanceof InteractionRequiredAuthError) {
              console.log("Interaction required, redirecting...");
              instance.acquireTokenRedirect(loginRequest);
              return; // Don't set loading to false as we're redirecting
            } else {
              console.error("Token acquisition error:", tokenError);
            }
          }
        } else {
          // No accounts found, might need to login
          console.log("No accounts found");
        }
      } catch (error: any) {
        console.error("MSAL Error:", error);
        // Check if it's the specific initialization error
        if (
          error.message &&
          error.message.includes("uninitialized_public_client_application")
        ) {
          console.log("Retrying after initialization...");
          // Retry after a longer delay
          setTimeout(() => {
            initializeAndHandle();
          }, 1000);
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    // Only proceed if not currently in progress and instance is available
    if (instance && inProgress === "none") {
      console.log("before function--------------------");
      initializeAndHandle();
    } else {
      console.log("Waiting for MSAL to be ready...", {
        instance: !!instance,
        inProgress,
      });
    }
  }, [accounts, instance, inProgress, initialized]);

  if (loading) {
    return (
      <div className="h-screen w-full">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div>Authentication completed. Redirecting...</div>
    </div>
  );
};
