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

  console.log("page call--------------------");
  console.log("inProgress:", inProgress);
  console.log("accounts:", accounts);

  useEffect(() => {
    console.log("useeffect--------------------");

    const handleAuthentication = async () => {
      try {
        console.log("Handling authentication...", {
          inProgress,
          accountsLength: accounts.length,
        });

        // If user account exists after redirect, get the token silently
        if (accounts.length > 0) {
          console.log("Account found:", accounts[0]);

          try {
            const tokenResponse: AuthenticationResult =
              await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
              });
            console.log("Token acquired silently:", tokenResponse);

            const token = tokenResponse.accessToken;
            console.log("Access Token:", token);

            // Store the token for API calls
            localStorage.setItem("access_token", token);
            localStorage.setItem("user_info", JSON.stringify(accounts[0]));

            // Auto-redirect to dashboard after successful login
            setTimeout(() => {
              window.location.href = "/dashboard"; // Change to your desired route
            }, 1500);
          } catch (tokenError) {
            console.error("Token acquisition error:", tokenError);

            // If silent token acquisition fails, initiate redirect
            if (tokenError instanceof InteractionRequiredAuthError) {
              console.log("Interaction required, redirecting...");
              instance.acquireTokenRedirect(loginRequest);
              return; // Don't set loading to false as we're redirecting
            }
          }
        } else {
          console.log("No accounts found - user may need to login");
          // Optionally redirect to login if no accounts are found
          // instance.loginRedirect(loginRequest);
        }
      } catch (error) {
        console.error("Authentication Error:", error);
      } finally {
        // Only set loading to false when MSAL is not in progress
        if (inProgress === "none") {
          setLoading(false);
        }
      }
    };

    // Wait for MSAL to finish processing (startup, handleRedirect, etc.)
    if (inProgress === "none") {
      console.log("MSAL processing complete, handling authentication...");
      handleAuthentication();
    } else {
      console.log("MSAL still processing...", inProgress);
      // Keep loading state while MSAL is processing
      setLoading(true);
    }
  }, [accounts, instance, inProgress]);

  if (loading || inProgress !== "none") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4">
            {inProgress === "startup" && "Initializing authentication..."}
            {inProgress === "handleRedirect" && "Processing login..."}
            {inProgress === "acquireToken" && "Getting access token..."}
            {inProgress === "none" && "Completing authentication..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div>Authentication completed successfully!</div>
        {accounts.length > 0 ? (
          <div className="mt-4">
            <p>Welcome, {accounts[0].name || accounts[0].username}!</p>
            <p className="text-sm text-gray-600">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="mt-4">
            <p>No user account found. Please try logging in again.</p>
          </div>
        )}
      </div>
    </div>
  );
};
