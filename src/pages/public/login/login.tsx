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
import { useState } from "react";
import Modal from "../../../components/common/modal";
import { Landmark, Home, X } from "lucide-react";
import { useMsal } from "@azure/msal-react";
import { RedirectRequest } from "@azure/msal-browser";

const loginRequest: RedirectRequest = {
  scopes: ["user.read"],
};

interface AdminData {
  role: string;
  supplier?: string;
  is_admin?: boolean;
  is_bank?: boolean;
  is_boligkonfigurator?: boolean;
  password?: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [selectedType, setSelectedType] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleModalOpen = () => {
    if (modalOpen) {
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

  // Helper functions for navigation
  const loginBolig = (email: string) => {
    localStorage.setItem("Iplot_admin_bolig", email);
    toast.success("Logg inn", { position: "top-right" });
    navigate("/Husmodell");
  };

  const loginLead = (email: string) => {
    localStorage.setItem("Iplot_admin", email);
    toast.success("Logg inn", { position: "top-right" });
    const url = `https://admin.mintomt.no/bank-leads?email=${encodeURIComponent(email)}`;
    window.location.href = url;
  };

  // Handle user authentication and routing based on permissions
  const handleUserAuth = async (email: string, type?: string) => {
    try {
      const adminDocRef = doc(db, "admin", email);
      const adminSnap = await getDoc(adminDocRef);

      if (!adminSnap.exists()) {
        toast.error("Brukeren finnes ikke", { position: "top-right" });
        return;
      }

      const adminData = adminSnap.data() as AdminData;

      // Handle Bankansvarlig role
      if (adminData?.role === "Bankansvarlig") {
        loginBolig(email);
        return;
      }

      // Handle Agent role
      if (adminData?.role === "Agent") {
        // Check supplier restriction
        if (adminData?.supplier !== "9f523136-72ca-4bde-88e5-de175bc2fc71") {
          toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
            position: "top-right",
          });
          return;
        }

        // Handle dual permissions (both bank and boligkonfigurator)
        if (adminData?.is_bank && adminData?.is_boligkonfigurator) {
          if (!type) {
            setModalOpen(true);
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

        // Handle single permissions
        if (adminData?.is_boligkonfigurator) {
          loginBolig(email);
          return;
        }

        if (adminData?.is_bank) {
          loginLead(email);
          return;
        }

        // Default fallback for Agent
        loginBolig(email);
        return;
      }

      // Any other roles not allowed
      toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error during authentication:", error);
      toast.error("En feil oppstod under innlogging.", { position: "top-right" });
    }
  };

  // Handle form submission for email/password login
  const onSubmit = async (data: z.infer<typeof formSchema>, type: string) => {
    try {
      setIsLoading(true);
      const adminDocRef = doc(db, "admin", data.email);
      const adminSnap = await getDoc(adminDocRef);

      if (!adminSnap.exists()) {
        toast.error("Admin finnes ikke", { position: "top-right" });
        return;
      }

      // Hash the password and update it (you might want to verify existing password first)
      if (data.password) {
        const hashedPassword = bcrypt.hashSync(data.password, 10);
        await updateDoc(adminDocRef, { password: hashedPassword });
      }

      // Handle user authentication and routing
      await handleUserAuth(data.email, type);
    } catch (error) {
      console.error("Error during sign-in", error);
      toast.error("En feil oppstod under innlogging.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle main form submission
  const handleMainSubmit = async (data: any) => {
    try {
      const adminDocRef = doc(db, "admin", data.email);
      const adminSnap = await getDoc(adminDocRef);

      if (!adminSnap.exists()) {
        toast.error("Brukeren finnes ikke", { position: "top-right" });
        return;
      }

      const adminData = adminSnap.data() as AdminData;

      // Quick routing for specific roles
      if (adminData?.role === "Bankansvarlig") {
        await onSubmit(data, "boligpartner");
        return;
      }

      if (adminData?.role === "Agent") {
        if (adminData?.supplier === "9f523136-72ca-4bde-88e5-de175bc2fc71") {
          if (adminData?.is_bank && adminData?.is_boligkonfigurator) {
            const isValid = await form.trigger();
            if (!isValid) return;

            if (!selectedType) {
              setModalOpen(true);
            } else {
              const formData = form.getValues();
              await onSubmit(formData, selectedType);
            }
          } else if (adminData?.is_boligkonfigurator) {
            await onSubmit(data, "boligpartner");
          } else if (adminData?.is_bank) {
            await onSubmit(data, "lead");
          } else {
            await onSubmit(data, "boligpartner");
          }
        } else {
          toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
            position: "top-right",
          });
        }
        return;
      }

      toast.error("Vennligst logg inn som Bolig Partner-bruker.", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error in handleMainSubmit:", error);
    }
  };

  // Handle Microsoft login
  const handleMicrosoftLogin = async () => {
    try {
      setIsLoading(true);
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Microsoft login error:", error);
      toast.error("Microsoft innlogging feilet", { position: "top-right" });
      setIsLoading(false);
    }
  };

  // Handle modal form submission
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) {
      setError(true);
      return;
    }

    const formData = form.getValues();
    await onSubmit(formData, selectedType);
    setModalOpen(false);
  };

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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
                  <div onClick={() => !isLoading && form.reset()}>
                    <Button
                      text="Avbryt"
                      className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                    />
                  </div>
                  <Button
                    text={isLoading ? "Laster..." : "Lagre"}
                    className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                    type="submit"
                  />
                </div>
              </form>
            </Form>
            
            <div
              onClick={handleMicrosoftLogin}
              className={`text-black border border-[#DCDFEA] rounded-[8px] py-[10px] px-4 mt-4 md:mt-6 flex gap-2 justify-center items-center cursor-pointer text-sm md:text-base ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              style={{
                boxShadow: "0px 1px 2px 0px #1018280D",
              }}
            >
              <img src={Microsoft_logo} alt="microsoft" />
              {isLoading ? "Laster..." : "Logg inn med Microsoft"}
            </div>
          </div>
        </div>
      </div>
      
      {modalOpen && (
        <Modal onClose={handleModalOpen} isOpen={true} outSideClick={true}>
          <div className="p-4 md:p-6 bg-white rounded-lg shadow-lg relative h-auto max-h-[90vh] overflow-y-auto w-[355px] sm:w-[390px]">
            <X
              className="text-primary absolute top-2.5 right-2.5 w-5 h-5 cursor-pointer"
              onClick={() => setModalOpen(false)}
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
                  text={isLoading ? "Laster..." : "Neste"}
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