/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import Button from "../../../components/common/button";
import { Input } from "../../../components/ui/input";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import {
  fetchAdminDataByEmail,
  fetchProjectsData,
  phoneNumberValidations,
} from "../../../lib/utils";
import { InputMobile } from "../../../components/ui/inputMobile";
import { parsePhoneNumber } from "react-phone-number-input";
import ApiUtils from "../../../api";
import Ic_search_location from "../../../assets/images/Ic_search_location.svg";
import { Spinner } from "../../../components/Spinner";

const formSchema = z.object({
  Kundenavn: z.string().min(1, {
    message: "Kundenavn må bestå av minst 2 tegn.",
  }),
  // Anleggsadresse: z.string().min(1, {
  //   message: "Anleggsadresse må bestå av minst 2 tegn.",
  // }),
  Anleggsadresse: z.string().optional(),
  mobileNummer: z.string().refine(
    (value) => {
      const parsedNumber = parsePhoneNumber(value);
      const countryCode = parsedNumber?.countryCallingCode
        ? `+${parsedNumber.countryCallingCode}`
        : "";
      const phoneNumber = parsedNumber?.nationalNumber || "";
      if (countryCode !== "+47") {
        return false;
      }
      const validator = phoneNumberValidations[countryCode];
      return validator ? validator(phoneNumber) : false;
    },
    {
      message:
        "Vennligst skriv inn et gyldig telefonnummer for det valgte landet.",
    }
  ),
  EPost: z
    .string()
    .email({ message: "Vennligst skriv inn en gyldig e-postadresse." })
    .min(1, { message: "E-posten må være på minst 2 tegn." }),
  Kundenummer: z.string().min(1, {
    message: "BP prosjektnummer må bestå av minst 2 tegn.",
  }),
  Postnr: z.string().optional(),
  Poststed: z.string().optional(),
  Kommune: z.number().optional(),
  TypeProsjekt: z.string().optional(),
  VelgSerie: z.string().optional(),
});

export const Husdetaljer: React.FC<{
  setActiveTab: any;
}> = ({ setActiveTab }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const location = useLocation();
  const pathSegments = location.pathname.split("/");

  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const kundeId = pathSegments.length > 4 ? pathSegments[4] : null;
  const [address, setAddress] = useState("");
  const navigate = useNavigate();
  const [createData, setCreateData] = useState<any>(null);
  const [officeId, setOficeId] = useState<any>(null);

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();
      if (data) {
        setCreateData(data);
        if (data?.office) {
          setOficeId(data?.office);
        }
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (!id || !kundeId) {
      return;
    }

    const getData = async () => {
      const data = await fetchProjectsData(kundeId);

      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
          if (key === "Anleggsadresse") {
            setAddress(String(value));
          }
        });
      }
    };

    getData();
  }, [form, id, kundeId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeProsjekt = params.get("TypeProsjekt");
    const VelgSerie = params.get("VelgSerie");

    if (typeProsjekt) {
      form.setValue("TypeProsjekt", typeProsjekt);
    }
    if (VelgSerie) {
      form.setValue("VelgSerie", VelgSerie);
    }
  }, [location]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitLoading(true);

    const formatDate = (date: Date) =>
      date.toLocaleString("sv-SE", { timeZone: "UTC" }).replace(",", "");

    try {
      const now = new Date();
      const createdAt = formatDate(now);
      const updatedAt = formatDate(now);

      const uniqueId = kundeId || uuidv4();
      const finalData = {
        ...data,
        id: uniqueId,
        createdAt,
        updatedAt,
      };

      const projectDocRef = doc(db, "projects", uniqueId);

      const docSnap = await getDoc(projectDocRef);

      if (docSnap.exists()) {
        await updateDoc(projectDocRef, {
          ...finalData,
          updatedAt,
          // updated_by: createData?.id,
          category_id: id,
          self_id: uniqueId,
        });

        toast.success("Updated successfully", { position: "top-right" });
      } else {
        await setDoc(projectDocRef, {
          ...finalData,
          createdAt,
          updatedAt,
          created_by: createData?.id,
          // updated_by: createData?.id,
          category_id: id,
          self_id: uniqueId,
          office_id: officeId,
        });

        toast.success("Added successfully", { position: "top-right" });
      }

      navigate(`/se-series/${id}/edit-husmodell/${uniqueId}`);
      setActiveTab(1);
    } catch (error) {
      console.error("Firestore operation failed:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const [addressData, setAddressData] = useState<any>(null);

  const kartInputRef = useRef<HTMLInputElement | null>(null);

  const handleKartInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setAddress(value);

    if (value) {
      try {
        const response = await ApiUtils.getAddress(value);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        setAddressData(json.adresser);
        form.resetField("Anleggsadresse");
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  return (
    <>
      {isSubmitLoading && <Spinner />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="pt-6 px-4 md:px-6 desktop:px-8 mb-[130px]">
            <div className="mb-4 md:mb-6">
              <h4 className="text-darkBlack font-bold text-lg md:text-xl desktop:text-2xl">
                Kundeopplysninger
              </h4>
            </div>
            <div className="border-[#EFF1F5] border rounded-lg overflow-hidden">
              <div className="md:grid flex flex-col md:grid-cols-2 gap-4 md:gap-6 w-[100%] p-4">
                <div className="col-span-2">
                  <p className={`text-black text-sm font-medium`}>
                    KundeInformation
                  </p>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="Kundenavn"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm font-medium`}
                        >
                          Kundenavn
                        </p>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Skriv inn Kundenavn"
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
                    name="Anleggsadresse"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm font-medium`}
                        >
                          Anleggsadresse
                        </p>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Skriv inn Anleggsadresse"
                              {...field}
                              className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                              type="text"
                              ref={kartInputRef}
                              onChange={handleKartInputChange}
                              value={address}
                            />
                            {address &&
                              addressData &&
                              addressData.length > 0 && (
                                <div
                                  className="absolute top-[45px] left-0 bg-white rounded-[8px] w-full h-auto max-h-[200px] overflow-y-auto overFlowYAuto"
                                  style={{
                                    zIndex: 999,
                                    boxShadow:
                                      "rgba(16, 24, 40, 0.09) 0px 4px 6px -2px, rgba(16, 24, 40, 0.09) 0px 12px 16px -4px",
                                  }}
                                >
                                  {addressData &&
                                    addressData?.map(
                                      (address: any, index: number) => (
                                        <div
                                          className="p-2 desktop:p-3 flex items-center gap-2 hover:bg-lightPurple cursor-pointer"
                                          key={index}
                                          onClick={() => {
                                            form.setValue(
                                              "Anleggsadresse",
                                              `${address.adressetekst} ${address.postnummer} ${address.poststed}`
                                            );
                                            setAddressData(null);
                                            setAddress(
                                              `${address.adressetekst} ${address.postnummer} ${address.poststed}`
                                            );
                                            form.setValue(
                                              "Postnr",
                                              address.postnummer
                                            );
                                            form.setValue(
                                              "Kommune",
                                              Number(address.kommunenummer)
                                            );
                                            form.setValue(
                                              "Poststed",
                                              address.poststed
                                            );
                                          }}
                                        >
                                          <img
                                            src={Ic_search_location}
                                            alt="location"
                                            className="w-6 h-6 md:w-auto md:h-auto"
                                          />
                                          <div>
                                            <span className="text-black font-medium text-sm md:text-base">
                                              {`${address.adressetekst}  ${address.postnummer} ${address.poststed}` ||
                                                "N/A"}
                                            </span>
                                          </div>
                                        </div>
                                      )
                                    )}
                                </div>
                              )}
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
                    name={`mobileNummer`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : ""
                          } mb-[6px] text-sm`}
                        >
                          Mobilnummer
                        </p>
                        <FormControl>
                          <div className="relative flex gap-1.5 items-center">
                            <InputMobile
                              placeholder="Skriv inn Telefon"
                              {...field}
                              className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                              type="tel"
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
                    name={`EPost`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : ""
                          } mb-[6px] text-sm`}
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
                              type="email"
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
                    name="Kundenummer"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <p
                          className={`${
                            fieldState.error ? "text-red" : "text-black"
                          } mb-[6px] text-sm font-medium`}
                        >
                          BP prosjektnummer
                        </p>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Skriv inn BP prosjektnummer"
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
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
            <Link to={`/Husmodell`}>
              <Button
                text="Avbryt"
                className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              />
            </Link>
            <Button
              text="Neste"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </>
  );
};
