/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState } from "react";
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
// import Ic_upload_blue_img from "../../../assets/images/Ic_upload_blue_img.svg";
import { Input } from "../../../components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../components/ui/select";
// import { TextArea } from "../../../components/ui/textarea";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { phoneNumberValidations } from "../../../lib/utils";
// import { Spinner } from "../../../components/Spinner";
// import {
//   // ChevronDown,
//   // ChevronUp,
//   House,
//   HousePlus,
//   Trash2,
//   Warehouse,
// } from "lucide-react";
import { InputMobile } from "../../../components/ui/inputMobile";
import { parsePhoneNumber } from "react-phone-number-input";
import ApiUtils from "../../../api";
import Ic_search_location from "../../../assets/images/Ic_search_location.svg";

const formSchema = z.object({
  // photo: z.union([
  //   z
  //     .instanceof(File)
  //     .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
  //       message: "Filstørrelsen må være mindre enn 10 MB.",
  //     }),
  //   z.string(),
  // ]),
  // husmodell_name: z.string().min(1, {
  //   message: "Navn på husmodell må bestå av minst 2 tegn.",
  // }),
  Kundenavn: z.string().min(1, {
    message: "Kundenavn må bestå av minst 2 tegn.",
  }),
  Anleggsadresse: z.string().min(1, {
    message: "Anleggsadresse må bestå av minst 2 tegn.",
  }),
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
    message: "Kundenummer må bestå av minst 2 tegn.",
  }),
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
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (!id) {
  //     setLoading(false);
  //     return;
  //   }
  //   const getData = async () => {
  //     const data = await fetchHusmodellData(id);
  //     if (data && data.Husdetaljer) {
  //       Object.entries(data.Husdetaljer).forEach(([key, value]) => {
  //         if (value !== undefined && value !== null) {
  //           form.setValue(key as any, value);
  //         }
  //       });
  //     }
  //     setLoading(false);
  //   };

  //   getData();
  // }, [form, id]);

  const navigate = useNavigate();
  // const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  // const file3DInputRef = React.useRef<HTMLInputElement | null>(null);
  // const filePlantegningerFasaderPhotoInputRef =
  //   React.useRef<HTMLInputElement | null>(null);
  // const uploadPhoto: any = form.watch("photo");
  // const uploadPlantegningerFasaderPhoto: any = form.watch(
  //   "PlantegningerFasader"
  // );
  // const upload3DPhoto: any = form.watch("photo3D");

  // const uploadFile = async (file: File, fieldName: any) => {
  //   if (!file) return;

  //   if (file.size > 2 * 1024 * 1024) {
  //     toast.error("Image size must be less than 2MB.", {
  //       position: "top-right",
  //     });
  //     return;
  //   }
  //   const fileType = "images";
  //   const timestamp = Date.now();
  //   const fileName = `${timestamp}_${file.name}`;
  //   const storageRef = ref(storage, `${fileType}/${fileName}`);

  //   try {
  //     const snapshot = await uploadBytes(storageRef, file);
  //     const url = await getDownloadURL(snapshot.ref);

  //     form.setValue(fieldName, url);
  //     form.clearErrors(fieldName);
  //   } catch (error) {
  //     console.error(`Error uploading file for ${fieldName}:`, error);
  //   }
  // };

  // const handleFileChange = async (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (event.target.files?.[0]) {
  //     await uploadFile(event.target.files[0], "photo");
  //   }
  // };

  // const handleClick = () => {
  //   fileInputRef.current?.click();
  // };

  // const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  //   if (event.dataTransfer.files?.[0]) {
  //     await uploadFile(event.dataTransfer.files[0], "photo");
  //   }
  // };
  // const handleFileUpload = async (files: FileList, fieldName: any) => {
  //   if (!files.length) return;

  //   const uploadPromises = Array.from(files).map(async (file) => {
  //     if (file.size > 2 * 1024 * 1024) {
  //       toast.error("Image size must be less than 2MB.", {
  //         position: "top-right",
  //       });
  //       return null;
  //     }

  //     const fileType = "images";
  //     const timestamp = Date.now();
  //     const fileName = `${timestamp}_${file.name}`;
  //     const storageRef = ref(storage, `${fileType}/${fileName}`);

  //     try {
  //       const snapshot = await uploadBytes(storageRef, file);
  //       return await getDownloadURL(snapshot.ref);
  //     } catch (error) {
  //       console.error("Error uploading file:", error);
  //       return null;
  //     }
  //   });

  //   const uploadedUrls = (await Promise.all(uploadPromises)).filter(
  //     Boolean
  //   ) as string[];

  //   let existingImages = form.getValues(fieldName) || [];
  //   if (!Array.isArray(existingImages)) {
  //     existingImages = [];
  //   }

  //   if (uploadedUrls.length) {
  //     const newImages = [...existingImages, ...uploadedUrls];
  //     form.setValue(fieldName, newImages);
  //     form.clearErrors(fieldName);
  //   }
  // };

  // const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
  //   event.preventDefault();
  // };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // if (data.VideoLink && !/^https?:\/\//i.test(data.VideoLink)) {
      //   data.VideoLink = `https://${data.VideoLink}`;
      // }
      // if (data.TittelVideo === null || data.TittelVideo === undefined) {
      //   delete data.TittelVideo;
      // }
      const formatDate = (date: Date) => {
        return date
          .toLocaleString("sv-SE", { timeZone: "UTC" })
          .replace(",", "");
      };

      const uniqueId = id ? id : uuidv4();
      const husmodellDocRef = doc(db, "housemodell_configure_broker", uniqueId);

      const husdetaljerData = {
        ...data,
        // link_3D_image: data.link_3D_image || null,
        id: uniqueId,
      };

      if (id) {
        const docSnap = await getDoc(husmodellDocRef);

        if (docSnap.exists()) {
          const existingData = docSnap.data();
          const currentHusdetaljer = existingData.Husdetaljer || {};

          // Deep merge existing + new data
          const updatedHusdetaljer = {
            ...currentHusdetaljer,
            ...husdetaljerData,
          };

          // Now update only merged result
          await updateDoc(husmodellDocRef, {
            Husdetaljer: updatedHusdetaljer,
            updatedAt: new Date().toISOString(),
          });

          toast.success("Lagret", {
            position: "top-right",
          });
        }
        // await updateDoc(husmodellDocRef, {
        //   Husdetaljer: husdetaljerData,
        //   updatedAt: formatDate(new Date()),
        // });
        // toast.success("Lagret", {
        //   position: "top-right",
        // });
      } else {
        await setDoc(husmodellDocRef, {
          Husdetaljer: husdetaljerData,
          updatedAt: formatDate(new Date()),
          createdAt: formatDate(new Date()),
          createDataBy: {
            email: "andre.fenger@gmail.com",
            photo:
              "https://firebasestorage.googleapis.com/v0/b/l-plot.firebasestorage.app/o/images%2F1742809941044_Ic_profile_image.svg?alt=media&token=1a58ec1e-c9a3-4c50-aab8-13e0993184b5",
            name: "André Fenger",
          },
        });
        toast.success("Added successfully", { position: "top-right" });
      }

      navigate(`/edit-husmodell/${uniqueId}`);
      setActiveTab(1);
    } catch (error) {
      console.error("Firestore operation failed:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  const [address, setAddress] = useState("");

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
      } catch (error: any) {
        console.error(error?.message);
      }
    }
  };

  return (
    <>
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
                {/*
                  <div>
                    <FormField
                      control={form.control}
                      name="husmodell_name"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            Navn på husmodell
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Navn på husmodell"
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
                  <div className="col-span-2 flex gap-6 items-center">
                    <FormField
                      control={form.control}
                      name="photo"
                      render={({ fieldState }) => (
                        <FormItem className="w-full">
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            Hovedbilde
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-5 w-full">
                              <div
                                className="relative w-max p-2 rounded-lg"
                                style={{
                                  boxShadow:
                                    "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                                }}
                              >
                                <div
                                  className="border border-gray2 border-dashed rounded-lg px-3 laptop:px-[42px] py-4 flex justify-center items-center flex-col gap-3 cursor-pointer w-full"
                                  onDragOver={handleDragOver}
                                  onClick={handleClick}
                                  onDrop={handleDrop}
                                >
                                  <p className="text-gray text-sm text-center truncate w-full">
                                    <span className="text-primary font-medium truncate">
                                      Bla gjennom
                                    </span>{" "}
                                    Slipp filen her for å laste den opp
                                  </p>
                                  <p className="text-gray text-sm text-center truncate w-full">
                                    Filformater: Kun JPEG, JPG, PNG, maks 2 MB
                                  </p>
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept=".svg, .png, .jpg, .jpeg, .gif"
                                    onChange={handleFileChange}
                                    name="photo"
                                  />
                                </div>
                              </div>
                              {uploadPhoto && (
                                <div className="relative">
                                  <img
                                    src={uploadPhoto}
                                    alt="logo"
                                    height="140px"
                                    width="140px"
                                  />
                                  <div
                                    className="bg-white rounded-full w-6 h-6 flex items-center justify-center absolute bottom-2 right-2 cursor-pointer"
                                    onClick={() => {
                                      form.resetField("photo");
                                    }}
                                  >
                                    <Trash2 className="text-red w-4 h-4" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  */}
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
                          Kundenummer
                        </p>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Skriv inn Kundenummer"
                              {...field}
                              className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                              type="number"
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
            <Link to={"/Husmodell"}>
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
          {/* {loading && <Spinner />} */}
        </form>
      </Form>
    </>
  );
};
