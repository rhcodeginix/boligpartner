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
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(true);

  console.log("page call--------------------");

  useEffect(() => {
    console.log("useeffect--------------------");

    const handleRedirect = async () => {
      try {
        // Check if MSAL instance is initialized
        if (!instance) {
          console.error("MSAL instance not available");
          setLoading(false);
          return;
        }
        console.log("instance-------------------", instance);

        // Handle login redirect result
        const response = await instance.handleRedirectPromise();
        console.log(response);

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

            // Example API call using token
            // const res = await fetch("https://your-api.com/endpoint", {
            //   headers: {
            //     Authorization: `Bearer ${token}`,
            //   },
            // });
            // const data = await res.json();
            // console.log("API response:", data);
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
      } catch (error) {
        console.error("MSAL Redirect Error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to ensure MSAL is fully ready
    const timer = setTimeout(() => {
      console.log("before function--------------------");

      handleRedirect();
    }, 100);

    return () => clearTimeout(timer);
  }, [accounts, instance]);

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
