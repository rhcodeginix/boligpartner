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
import { Link, useNavigate } from "react-router-dom";
import Modal from "../../components/common/modal";
import Ic_logo from "../../assets/images/Ic_logo.svg";
import Img_main_bg from "../../assets/images/Img_main_bg.png";
import { Home, Landmark, X } from "lucide-react";
import Button from "../../components/common/button";

const loginRequest: RedirectRequest = {
  scopes: ["user.read"],
};

interface AdminData {
  role: string;
  supplier?: string;
  is_admin?: boolean;
  is_bank?: boolean;
  is_boligkonfigurator?: boolean;
}

export const MicrosoftCallBack = () => {
  const { instance, accounts, inProgress } = useMsal();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState<string>("");
  const [modalError, setModalError] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const handleModalOpen = () => {
    if (modalOpen) {
      setModalOpen(false);
      setSelectedType("");
    } else {
      setModalOpen(true);
    }
  };

  const loginBolig = (email: string) => {
    localStorage.setItem("Iplot_admin_bolig", email);
    toast.success("Logg inn", { position: "top-right" });
    navigate("/Husmodell");
  };

  const loginLead = (email: string) => {
    localStorage.setItem("Iplot_admin", email);
    toast.success("Logg inn", { position: "top-right" });
    const url = `https://admin.mintomt.no/bank-leads?email=${encodeURIComponent(
      email
    )}`;
    window.location.href = url;
  };

  const handleUserAuth = async (email: string, type?: string) => {
    try {
      const adminDocRef = doc(db, "admin", email);
      const adminSnap = await getDoc(adminDocRef);

      if (!adminSnap.exists()) {
        toast.error("Brukeren finnes ikke", { position: "top-right" });
        setError("User not found in database");
        navigate("/login");
        return;
      }

      const adminData = adminSnap.data() as AdminData;

      if (adminData?.role === "Bankansvarlig") {
        loginBolig(email);
        return;
      }

      if (adminData?.role === "Agent") {
        if (adminData?.supplier !== "9f523136-72ca-4bde-88e5-de175bc2fc71") {
          toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
            position: "top-right",
          });
          setError("User not authorized for this supplier");
          return;
        }

        if (adminData?.is_bank && adminData?.is_boligkonfigurator) {
          if (!type) {
            setUserEmail(email);
            setModalOpen(true);
            setLoading(false);
            return;
          }

          if (type === "boligpartner") {
            loginBolig(email);
          } else if (type === "lead") {
            loginLead(email);
          }

          setSelectedType("");
          return;
        }

        if (adminData?.is_boligkonfigurator) {
          loginBolig(email);
          return;
        }

        if (adminData?.is_bank) {
          loginLead(email);
          return;
        }

        loginBolig(email);
        return;
      }

      toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
        position: "top-right",
      });
      setError("User role not authorized");
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("En feil oppstod under innlogging.", {
        position: "top-right",
      });
      setError("Authentication error occurred");
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      setModalError(true);
      return;
    }

    setLoading(true);
    await handleUserAuth(userEmail, selectedType);
    setModalOpen(false);
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        if (inProgress !== "none") {
          return;
        }

        if (accounts.length === 0) {
          setError(
            "No authenticated account found. Please try logging in again."
          );
          setLoading(false);
          return;
        }

        try {
          const tokenResponse: AuthenticationResult =
            await instance.acquireTokenSilent({
              ...loginRequest,
              account: accounts[0],
            });

          const token = tokenResponse.accessToken;

          if (!token) {
            setError("Failed to acquire access token");
            setLoading(false);
            return;
          }

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

          if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
          }

          const data = await response.json();
          const email = data?.user?.userPrincipalName;

          if (!email) {
            setError("Failed to get user email from Microsoft");
            setLoading(false);
            return;
          }

          await handleUserAuth(email);
        } catch (tokenError) {
          console.error("❌ Token acquisition error:", tokenError);

          if (tokenError instanceof InteractionRequiredAuthError) {
            try {
              await instance.acquireTokenRedirect(loginRequest);
            } catch (redirectError) {
              console.error("Redirect error:", redirectError);
              setError("Failed to redirect for authentication");
              setLoading(false);
            }
            return;
          }

          setError("Failed to acquire authentication token");
          setLoading(false);
        }
      } catch (error) {
        console.error("💥 Authentication Error:", error);
        setError("An unexpected error occurred during authentication");
        setLoading(false);
      }
    };

    if (inProgress === "none") {
      handleAuthentication();
    }
  }, [instance, accounts, inProgress]);

  if (loading || inProgress !== "none") {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-600">
            {inProgress === "startup" && "Initializing authentication..."}
            {inProgress === "handleRedirect" && "Processing Microsoft login..."}
            {inProgress === "acquireToken" && "Getting access token..."}
            {inProgress === "none" && loading && "Completing authentication..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md mx-4">
          <div className="border border-red rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red mb-2">
              Authentication Error
            </h2>
            <p className="text-red mb-4">{error}</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  window.location.href = "/";
                }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex items-center justify-center h-screen relative w-full"
        style={{
          backgroundImage: `url(${Img_main_bg})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div
          className="px-4 md:px-6 py-4 flex items-center border-b border-gray2 justify-between w-full fixed top-0 bg-white"
          style={{
            zIndex: 999,
          }}
          id="navbar"
        >
          <div className="flex items-center gap-2">
            <Link to={"/"}>
              <img src={Ic_logo} alt="logo" className="w-[200px] lg:w-auto" />
            </Link>
          </div>
        </div>
        <div className="text-center">
          <div className="text-primary text-lg font-semibold mb-2">
            Authentication completed successfully!
          </div>
          {accounts.length > 0 ? (
            <div className="mt-4">
              <p className="text-gray-700">
                Welcome, {accounts[0].name || accounts[0].username}!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Redirecting to dashboard...
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-red-600">
                No user account found. Please try logging in again.
              </p>
              <button
                onClick={() => navigate("/")}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={handleModalOpen} isOpen={true} outSideClick={true}>
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg relative h-auto max-h-[90vh] overflow-y-auto w-[355px] sm:w-[390px]">
            <X
              className="text-primary absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer"
              onClick={() => {
                setModalOpen(false);
                navigate("/login");
              }}
            />
            <h2 className="text-lg font-semibold mb-4">
              Velg type tjeneste du vil bruke
            </h2>

            <form onSubmit={handleModalSubmit} className="relative">
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
                        setModalError(false);
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

                {modalError && <p className="text-red text-sm">Påkrevd</p>}
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  text="Avbryt"
                  className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  onClick={() => setModalOpen(false)}
                />
                <Button
                  text={loading ? "Laster..." : "Neste"}
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
