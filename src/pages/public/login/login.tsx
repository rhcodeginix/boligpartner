// if (
//   adminData?.supplier !== "9f523136-72ca-4bde-88e5-de175bc2fc71" ||
//   adminData?.is_admin === true
// )
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { z } from "zod";
import Ic_logo from "../../../assets/images/Ic_logo.svg";
import Microsoft_logo from "../../../assets/images/Microsoft_logo.svg";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../../components/common/button";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import bcrypt from "bcryptjs";
import { useEffect, useState } from "react";
import Modal from "../../../components/common/modal";
import { Landmark, Home, X } from "lucide-react";
import { useMsal } from "@azure/msal-react";
import {
  AuthenticationResult,
  InteractionRequiredAuthError,
  RedirectRequest,
} from "@azure/msal-browser";
import { Spinner } from "../../../components/Spinner";

const loginRequest: RedirectRequest = {
  scopes: ["user.read"],
};

export const Login = () => {
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

  const formSchema = z.object({
    email: z
      .string()
      .email({ message: "Vennligst skriv inn en gyldig e-postadresse." })
      .min(1, { message: "E-postadresse er påkrevd." }),

    password: z
      .string()
      .min(8, { message: "Passordet må være minst 8 tegn langt." })
      .regex(/[A-Z]/, {
        message: "Passordet må inneholde minst én stor bokstav.",
      })
      .regex(/[a-z]/, {
        message: "Passordet må inneholde minst én liten bokstav.",
      })
      .regex(/[0-9]/, { message: "Passordet må inneholde minst ett tall." })
      .regex(/[@$!%*?&]/, {
        message: "Passordet må inneholde minst ett spesialtegn.",
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>, type: string) => {
    try {
      const adminDocRef = doc(db, "admin", data.email);
      const adminSnap = await getDoc(adminDocRef);

      if (!adminSnap.exists()) {
        toast.error("Admin finnes ikke", { position: "top-right" });
      } else {
        if (data.password) {
          const hashedPassword = bcrypt.hashSync(data.password, 10);
          await updateDoc(adminDocRef, { password: hashedPassword });

          toast.success("Logg inn", {
            position: "top-right",
          });
          if (type === "boligpartner") {
            localStorage.setItem("Iplot_admin_bolig", data.email);
          } else if (type === "lead") {
            localStorage.setItem("Iplot_admin", data.email);
          }

          if (type === "boligpartner") {
            navigate("/Husmodell");
          } else if (type === "lead") {
            const url = `https://admin.mintomt.no/bank-leads?email=${encodeURIComponent(
              data.email
            )}`;
            window.location.href = url;
          }
          setSelectedType("");
        }
      }
    } catch (error) {
      console.error("Error during sign-in", error);
    }
  };

  const handleMainSubmit = async (data: any) => {
    const adminDocRef = doc(db, "admin", data.email);
    const adminSnap = await getDoc(adminDocRef);

    if (!adminSnap.exists()) {
      toast.error("Brukeren finnes ikke", { position: "top-right" });
    } else {
      const adminData = adminSnap.data();
      if (adminData && adminData?.role === "Bankansvarlig") {
        setSelectedType("boligpartner");
        form.handleSubmit((data) => onSubmit(data, "boligpartner"))();
        return;
      } else if (adminData && adminData?.role === "Agent") {
        if (adminData?.supplier === "9f523136-72ca-4bde-88e5-de175bc2fc71") {
          if (adminData?.is_bank && adminData?.is_boligkonfigurator) {
            const isValid = await form.trigger();

            if (!isValid) return;

            if (!selectedType) {
              setModalOpen(true);
            } else {
              const formData = form.getValues();
              onSubmit(formData, selectedType);
            }
          } else if (adminData?.is_boligkonfigurator) {
            setSelectedType("boligpartner");
            form.handleSubmit((data) => onSubmit(data, "boligpartner"))();
          } else if (adminData?.is_bank) {
            setSelectedType("lead");
            form.handleSubmit((data) => onSubmit(data, "lead"))();
          } else {
            setSelectedType("boligpartner");
            form.handleSubmit((data) => onSubmit(data, "boligpartner"))();
          }
        } else {
          toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
            position: "top-right",
          });
        }

        return;
      } else {
        toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
          position: "top-right",
        });
        return;
      }
    }
    const isValid = await form.trigger();

    if (!isValid) return;

    if (!selectedType) {
      setModalOpen(true);
    } else {
      const formData = form.getValues();
      onSubmit(formData, selectedType);
    }
  };

  const { instance, accounts } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest);
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // const response = await instance.handleRedirectPromise();

        // if (response?.account) {
        //   console.log("Login success", response.account);
        // }

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

          // const response = await fetch(
          //   "https://prix6wkqezgybojdc4j5yecxk40tncyy.lambda-url.eu-north-1.on.aws/",
          //   {
          //     method: "POST",
          //     headers: {
          //       "Content-Type": "application/json",
          //     },
          //     body: JSON.stringify({
          //       token: token,
          //     }),
          //   }
          // );

          // const data = await response.json();
          // console.log("Lambda response:", data);
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

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="relative w-full max-w-[490px]">
          <div
            className="mx-4 bg-white p-7 w-full"
            style={{
              boxShadow:
                "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
            }}
          >
            <div className="flex justify-center mb-10">
              <img src={Ic_logo} alt="logo" />
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleMainSubmit)}
                className="relative"
              >
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            E-post
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn E-post"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="text"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            Passord
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Passord"
                                {...field}
                                className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                type="password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex justify-end w-full gap-5 items-center p-4">
                  <div onClick={() => form.reset()}>
                    <Button
                      text="Avbryt"
                      className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                    />
                  </div>
                  <Button
                    text="Lagre"
                    className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                    type="submit"
                  />
                </div>
              </form>
            </Form>
            <div
              onClick={handleLogin}
              className="text-black border border-[#DCDFEA] rounded-[8px] py-[10px] px-4 mt-4 md:mt-6 flex gap-2 justify-center items-center cursor-pointer text-sm md:text-base"
              style={{
                boxShadow: "0px 1px 2px 0px #1018280D",
              }}
            >
              <img src={Microsoft_logo} alt="microsoft" />
              Logg inn med Microsoft
            </div>
          </div>
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
                form.handleSubmit((data) => onSubmit(data, selectedType))();

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
