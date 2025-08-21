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
    console.log("Current state:", {
      inProgress,
      accountsLength: accounts.length,
      loading,
    });

    const handleAuthentication = async () => {
      try {
        console.log("🔄 Starting token acquisition...", {
          inProgress,
          accountsLength: accounts.length,
        });

        // If user account exists, get the token silently
        if (accounts.length > 0) {
          console.log("✅ Account found, acquiring token:", accounts[0]);

          try {
            const tokenResponse: AuthenticationResult =
              await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
              });

            console.log("🎉 Token acquired successfully!");
            console.log("Full token response:", tokenResponse);
            console.log("🔑 Access Token:", tokenResponse.accessToken);

            // Store the token for API calls
            localStorage.setItem("access_token", tokenResponse.accessToken);
            localStorage.setItem("user_info", JSON.stringify(accounts[0]));

            console.log("💾 Token and user info stored in localStorage");

            // Auto-redirect to dashboard after successful login
            console.log("🚀 Redirecting to dashboard in 2 seconds...");
            setTimeout(() => {
              // window.location.href = '/dashboard'; // Uncomment when ready
              console.log("Would redirect to dashboard now");
            }, 2000);
          } catch (tokenError) {
            console.error("❌ Token acquisition error:", tokenError);

            // If silent token acquisition fails, initiate redirect
            if (tokenError instanceof InteractionRequiredAuthError) {
              console.log("🔄 Interaction required, redirecting...");
              instance.acquireTokenRedirect(loginRequest);
              return;
            }
          }
        } else {
          console.log("⚠️ No accounts found - user may need to login");
        }
      } catch (error) {
        console.error("💥 Authentication Error:", error);
      } finally {
        console.log("✅ Setting loading to false");
        setLoading(false);
      }
    };

    // Try to get token regardless of inProgress state if we have accounts
    if (accounts.length > 0 && !loading) {
      console.log("🚀 Account available, attempting token acquisition...");
      handleAuthentication();
    } else if (inProgress === "none" && accounts.length === 0) {
      console.log("⚠️ MSAL processing complete but no accounts found");
      setLoading(false);
    } else {
      console.log("⏳ Waiting for accounts or MSAL to complete...", {
        inProgress,
        accountsLength: accounts.length,
        loading,
      });
      handleAuthentication();
    }
  }, [accounts, instance, inProgress, loading]);

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
