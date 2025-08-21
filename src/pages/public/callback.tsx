import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  AuthenticationResult,
  RedirectRequest,
} from "@azure/msal-browser";
import { Spinner } from "../../components/Spinner";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/common/modal";
import { Home, Landmark, X } from "lucide-react";
import Button from "../../components/common/button";

const loginRequest: RedirectRequest = {
  scopes: ["user.read"],
};

export const MicrosoftCallBack = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [ModalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    if (ModalOpen) {
      setModalOpen(false);
      setSelectedType("");
    } else {
      setModalOpen(true);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        if (accounts.length > 0) {
          console.log("✅ Account found, acquiring token:", accounts[0]);

          try {
            const tokenResponse: AuthenticationResult =
              await instance.acquireTokenSilent({
                ...loginRequest,
                account: accounts[0],
              });
            console.log("🔑 Access Token:", tokenResponse.accessToken);
            const token = tokenResponse.accessToken;

            if (!token) return;

            const response = await fetch(
              "https://12k1qcbcda.execute-api.eu-north-1.amazonaws.com/prod/user",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ token }),
              }
            );

            if (!response.ok) throw new Error(`Returned ${response.status}`);

            const data = await response.json();
            const userEmail = data?.user?.userPrincipalName;

            // Fetch admin data from Firestore
            const adminDocRef = doc(db, "admin", userEmail);
            const adminSnap = await getDoc(adminDocRef);

            if (!adminSnap.exists()) {
              toast.error("Brukeren finnes ikke", { position: "top-right" });
              return;
            }

            const adminData = adminSnap.data();

            // ---- Helper functions ----
            const loginBolig = () => {
              localStorage.setItem("Iplot_admin_bolig", userEmail);
              toast.success("Logg inn", { position: "top-right" });
              navigate("/Husmodell");
            };

            const loginLead = () => {
              localStorage.setItem("Iplot_admin", userEmail);
              toast.success("Logg inn", { position: "top-right" });
              const url = `https://admin.mintomt.no/bank-leads?email=${encodeURIComponent(
                userEmail
              )}`;
              window.location.href = url;
            };

            // ---- Role-based access ----
            if (adminData?.role === "Bankansvarlig") {
              loginBolig();
              return;
            }

            if (adminData?.role === "Agent") {
              // Only allow specific supplier
              if (
                adminData?.supplier !== "9f523136-72ca-4bde-88e5-de175bc2fc71"
              ) {
                toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
                  position: "top-right",
                });
                return;
              }

              // Handle Agent permissions
              if (adminData?.is_bank && adminData?.is_boligkonfigurator) {
                if (!selectedType) {
                  setModalOpen(true);
                  return;
                }

                if (selectedType === "boligpartner") {
                  loginBolig();
                } else if (selectedType === "lead") {
                  loginLead();
                }

                setSelectedType("");
                return;
              }

              if (adminData?.is_boligkonfigurator) {
                loginBolig();
                return;
              }

              if (adminData?.is_bank) {
                loginLead();
                return;
              }

              // Default fallback → boligpartner
              loginBolig();
              return;
            }

            // Any other roles
            toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
              position: "top-right",
            });
          } catch (tokenError) {
            console.error("❌ Token acquisition error:", tokenError);

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
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div>Authentication completed successfully!</div>
          {accounts.length > 0 ? (
            <div className="mt-4">
              <p>Welcome, {accounts[0].name || accounts[0].username}!</p>
              <p className="text-sm text-gray-600">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p>No user account found. Please try logging in again.</p>
            </div>
          )}
        </div>
      </div>
      {ModalOpen && (
        <Modal onClose={handleModalOpen} isOpen={true} outSideClick={true}>
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg relative h-auto max-h-[90vh] overflow-y-auto w-[355px] sm:w-[390px]">
            <X
              className="text-primary absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer"
              onClick={() => setModalOpen(false)}
            />
            <h2 className="text-lg font-semibold mb-4">
              Velg type tjeneste du vil bruke
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedType) {
                  setError(true);
                  return;
                }

                setModalOpen(false);
              }}
              className="relative"
            >
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
                  {[
                    {
                      label: "Tips til bank",
                      value: "lead",
                      icon: (
                        <Landmark
                          className={`${
                            selectedType === "lead"
                              ? "text-primary"
                              : "text-[#5D6B98]"
                          }`}
                        />
                      ),
                    },
                    {
                      label: "Boligkonfigurator",
                      value: "boligpartner",
                      icon: (
                        <Home
                          className={`${
                            selectedType === "boligpartner"
                              ? "text-primary"
                              : "text-[#5D6B98]"
                          }`}
                        />
                      ),
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedType(item.value);
                        setError(false);
                      }}
                      className={`flex items-center gap-2 border-2 rounded-lg py-2 px-3 cursor-pointer ${
                        selectedType === item.value
                          ? "border-primary"
                          : "border-[#EFF1F5]"
                      }`}
                    >
                      {item.icon}
                      <div className="text-darkBlack text-sm text-center">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>

                {error && <p className="text-red text-sm">Påkrevd</p>}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  text="Avbryt"
                  className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  onClick={() => setModalOpen(false)}
                />
                <Button
                  text="Neste"
                  className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  type="submit"
                />
              </div>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
};
