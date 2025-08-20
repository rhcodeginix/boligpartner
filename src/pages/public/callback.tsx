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

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Handle login redirect result
        const response = await instance.handleRedirectPromise();

        if (response?.account) {
          console.log("Login success", response.account);
        }

        // If user account exists, get the token silently
        if (accounts.length > 0) {
          const tokenResponse: AuthenticationResult =
            await instance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0],
            });
          console.log(tokenResponse);

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
        }
      } catch (error) {
        // If silent token acquisition fails, initiate redirect
        if (error instanceof InteractionRequiredAuthError) {
          instance.acquireTokenRedirect(loginRequest);
        } else {
          console.error("MSAL Redirect Error:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    handleRedirect();
  }, [accounts, instance]);

  if (loading) {
    return (
      <div className="h-screen w-full">
        <Spinner />
      </div>
    );
  }

  return null;
};
