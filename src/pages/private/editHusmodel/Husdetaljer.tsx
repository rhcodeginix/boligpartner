/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
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
import Ic_upload_blue_img from "../../../assets/images/Ic_upload_blue_img.svg";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { TextArea } from "../../../components/ui/textarea";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { fetchAdminDataByEmail, fetchHusmodellData } from "../../../lib/utils";
import { Spinner } from "../../../components/Spinner";
import {
  ChevronDown,
  ChevronUp,
  House,
  HousePlus,
  Trash2,
  Warehouse,
} from "lucide-react";

const formSchema = z.object({
  TypeObjekt: z.string().min(1, { message: "Velg en Type Objekt." }),
  photo: z.union([
    z
      .instanceof(File)
      .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
        message: "Filstørrelsen må være mindre enn 10 MB.",
      }),
    z.string(),
  ]),
  PlantegningerFasader: z
    .array(
      z.union([
        z
          .instanceof(File)
          .refine(
            (file: any) => file === null || file.size <= 10 * 1024 * 1024,
            {
              message: "Filstørrelsen må være mindre enn 10 MB.",
            }
          ),
        z.string(),
      ])
    )
    .min(1, "Minst ett bilde kreves."),
  photo3D: z
    .array(
      z.union([
        z
          .instanceof(File)
          .refine(
            (file: any) => file === null || file.size <= 10 * 1024 * 1024,
            {
              message: "Filstørrelsen må være mindre enn 10 MB.",
            }
          ),
        z.string(),
      ])
    )
    .min(1, "Minst ett bilde kreves."),
  husmodell_name: z.string().min(1, {
    message: "Navn på husmodell må bestå av minst 2 tegn.",
  }),
  link_3D_image: z
    .string()
    .min(1, {
      message: "Link til 3D bilde må bestå av minst 2 tegn.",
    })
    .optional(),
  pris: z.string().min(1, {
    message: "Pris må bestå av minst 1 tegn.",
  }),
  BRATotal: z.string().min(1, {
    message: "BRA total (bruksareal) må bestå av minst 2 tegn.",
  }),
  PRom: z.string().min(1, {
    message: "GUA (Gulvareal) må bestå av minst 2 tegn.",
  }),
  Mønehøyde: z.number().min(1, {
    message: "Mønehøyde areal må bestå av minst 2 tegn.",
  }),
  Gesimshøyde: z.number().min(1, {
    message: "Gesimshøyde areal må bestå av minst 2 tegn.",
  }),
  LB: z.string().min(1, {
    message: "LB areal må bestå av minst 2 tegn.",
  }),
  Takvinkel: z.number().min(1, {
    message: "Takvinkel areal må bestå av minst 2 tegn.",
  }),
  BebygdAreal: z.number().min(1, {
    message: "Bebygd areal (BYA) må bestå av minst 2 tegn.",
  }),
  Soverom: z.number().min(1, {
    message: "Soverom må bestå av minst 2 tegn.",
  }),
  InnvendigBod: z.number().min(1, {
    message: "InnvendigBod må bestå av minst 2 tegn.",
  }),
  Bad: z.number().min(1, {
    message: "Bad må bestå av minst 2 tegn.",
  }),
  Energimerking: z
    .string()
    .min(1, { message: "Energimerking must må spesifiseres." }),
  TilgjengeligBolig: z
    .string()
    .min(1, { message: "TilgjengeligBolig must må spesifiseres." }),
  Tomtetype: z.string().min(1, { message: "Tomtetype must må spesifiseres." }),
  Hustittel: z.string().min(1, {
    message: "Hustittel må bestå av minst 2 tegn.",
  }),
  OmHusmodellen: z.string().min(1, {
    message: "OmHusmodellen må bestå av minst 2 tegn.",
  }),
  TittelVideo: z
    .string()
    .min(1, {
      message: "Tittel på video må bestå av minst 2 tegn.",
    })
    .optional(),
  VideoLink: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+$/.test(
          val
        ),
      {
        message: "Please enter a valid YouTube URL.",
      }
    ),
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
  const [loading, setLoading] = useState(true);
  const [createData, setCreateData] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();
      if (data) {
        setCreateData(data);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      const data = await fetchHusmodellData(id);
      if (data && data.Husdetaljer) {
        Object.entries(data.Husdetaljer).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
      setLoading(false);
    };

    getData();
  }, [form, id]);

  const navigate = useNavigate();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const file3DInputRef = React.useRef<HTMLInputElement | null>(null);
  const filePlantegningerFasaderPhotoInputRef =
    React.useRef<HTMLInputElement | null>(null);
  const uploadPhoto: any = form.watch("photo");
  const uploadPlantegningerFasaderPhoto: any = form.watch(
    "PlantegningerFasader"
  );
  const upload3DPhoto: any = form.watch("photo3D");

  const uploadFile = async (file: File, fieldName: any) => {
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB.", {
        position: "top-right",
      });
      return;
    }
    const fileType = "images";
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${fileType}/${fileName}`);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);

      form.setValue(fieldName, url);
      form.clearErrors(fieldName);
    } catch (error) {
      console.error(`Error uploading file for ${fieldName}:`, error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.[0]) {
      await uploadFile(event.target.files[0], "photo");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files?.[0]) {
      await uploadFile(event.dataTransfer.files[0], "photo");
    }
  };
  const handleFileUpload = async (files: FileList, fieldName: any) => {
    if (!files.length) return;

    const uploadPromises = Array.from(files).map(async (file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB.", {
          position: "top-right",
        });
        return null;
      }

      const fileType = "images";
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `${fileType}/${fileName}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading file:", error);
        return null;
      }
    });

    const uploadedUrls = (await Promise.all(uploadPromises)).filter(
      Boolean
    ) as string[];

    let existingImages = form.getValues(fieldName) || [];
    if (!Array.isArray(existingImages)) {
      existingImages = [];
    }

    if (uploadedUrls.length) {
      const newImages = [...existingImages, ...uploadedUrls];
      form.setValue(fieldName, newImages);
      form.clearErrors(fieldName);
    }
  };

  const handlePlantegningerFasaderFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      await handleFileUpload(event.target.files, "PlantegningerFasader");
    }
  };

  const handlePlantegningerFasaderClick = () => {
    filePlantegningerFasaderPhotoInputRef.current?.click();
  };

  const handlePlantegningerFasaderDrop = async (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      await handleFileUpload(event.dataTransfer.files, "PlantegningerFasader");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handle3DDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const handlePlantegningerFasaderDragOver = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
  };

  const handle3DFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      await handleFileUpload(event.target.files, "photo3D");
    }
  };

  const handle3DClick = () => {
    file3DInputRef.current?.click();
  };

  const handle3DDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      await handleFileUpload(event.dataTransfer.files, "photo3D");
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (data.VideoLink && !/^https?:\/\//i.test(data.VideoLink)) {
        data.VideoLink = `https://${data.VideoLink}`;
      }

      const formatDate = (date: Date) => {
        return date
          .toLocaleString("sv-SE", { timeZone: "UTC" })
          .replace(",", "");
      };

      const uniqueId = id ? id : uuidv4();
      const husmodellDocRef = doc(db, "housemodell_configure_broker", uniqueId);

      const husdetaljerData = {
        ...data,
        link_3D_image: data.link_3D_image || null,
        id: uniqueId,
      };

      if (id) {
        await updateDoc(husmodellDocRef, {
          Husdetaljer: husdetaljerData,
          updatedAt: formatDate(new Date()),
        });
        toast.success("Updated successfully", {
          position: "top-right",
        });
      } else {
        await setDoc(husmodellDocRef, {
          Husdetaljer: husdetaljerData,
          updatedAt: formatDate(new Date()),
          createdAt: formatDate(new Date()),
          createDataBy: {
            email: createData?.email,
            photo: createData?.photo,
            name: createData?.name,
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
  const selectedHouseType = form.watch("TypeObjekt");

  const [isOpen, setIsOpen] = useState<{ [key: string]: boolean }>({
    section1: false,
    section2: false,
  });

  const toggleAccordion = (sectionId: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="pt-6 px-8 mb-[154px]">
            <div className="mb-6">
              <h4 className="text-darkBlack font-bold text-2xl mb-2">
                House Details
              </h4>
              <p className="text-secondary text-lg">Enter your house details</p>
            </div>
            <div className="flex flex-col gap-6">
              <div className="border-[#EFF1F5] border rounded-lg overflow-hidden">
                <div
                  className={`bg-white flex justify-between items-center w-full p-4 cursor-pointer duration-1000 ${
                    isOpen ? "active" : ""
                  }`}
                  onClick={() => toggleAccordion("section1")}
                >
                  <span className="text-black text-lg font-medium">
                    Grunnleggende informasjon
                  </span>

                  {isOpen.section1 ? (
                    <ChevronUp className="text-purple" />
                  ) : (
                    <ChevronDown className="text-purple" />
                  )}
                </div>
                {isOpen.section1 && (
                  <div className="grid grid-cols-2 gap-6 w-[100%] border-[#EFF1F5] border-t p-4">
                    <div className="col-span-2">
                      <p
                        className={`${
                          form.formState.errors.TypeObjekt
                            ? "text-red"
                            : "text-black"
                        } mb-[6px] text-sm font-medium`}
                      >
                        Type objekt
                      </p>
                      <div className="flex gap-4 items-center">
                        {[
                          {
                            label: "Bolig",
                            icon: <House />,
                            value: "bolig",
                          },
                          {
                            label: "Hytte",
                            icon: <HousePlus />,
                            value: "hytte",
                          },
                          {
                            label: "Garasje",
                            icon: <Warehouse />,
                            value: "garasje",
                          },
                        ].map((item: any, index: number) => (
                          <div
                            key={index}
                            onClick={() => {
                              form.setValue("TypeObjekt", item.value);
                              form.clearErrors("TypeObjekt");
                            }}
                            className={`border-2 rounded-lg py-2 px-4 shadow-shadow2 cursor-pointer flex items-center gap-2 ${
                              selectedHouseType === item.value
                                ? "border-purple"
                                : "border-gray1"
                            }`}
                          >
                            <div
                              className={`${
                                selectedHouseType === item.value
                                  ? "text-[#444CE7]"
                                  : "text-[#5D6B98]"
                              }`}
                            >
                              {item.icon}
                            </div>
                            <div className="text-darkBlack text-sm text-center font-medium">
                              {item.label}
                            </div>
                          </div>
                        ))}
                      </div>
                      {form.formState.errors.TypeObjekt && (
                        <p className="text-red text-sm mt-1">
                          {form.formState.errors.TypeObjekt.message}
                        </p>
                      )}
                    </div>
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
                    <div>
                      <FormField
                        control={form.control}
                        name="pris"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Pris fra
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Pris fra"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  inputMode="numeric"
                                  type="text"
                                  onChange={({ target: { value } }: any) =>
                                    field.onChange({
                                      target: {
                                        name: "pris",
                                        value: value.replace(/\D/g, "")
                                          ? new Intl.NumberFormat(
                                              "no-NO"
                                            ).format(
                                              Number(value.replace(/\D/g, ""))
                                            )
                                          : "",
                                      },
                                    })
                                  }
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
                                      Filformater: Kun PDF, maks 2 MB
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
                    <div className="border-t border-[#DCDFEA] w-full"></div>
                    <div className="col-span-2">
                      <p className={`text-black mb-[6px] text-sm font-medium`}>
                        Andre bilder og 3D-visning
                      </p>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <FormField
                            control={form.control}
                            name="link_3D_image"
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <p
                                  className={`${
                                    fieldState.error ? "text-red" : "text-black"
                                  } mb-[6px] text-sm font-medium`}
                                >
                                  Link til 3D bilde
                                </p>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      placeholder="Legg til 3D link fra Norkart"
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
                        <FormField
                          control={form.control}
                          name="photo"
                          render={() => (
                            <FormItem className="w-full">
                              <FormControl>
                                <div className="flex items-center gap-5 w-full">
                                  <div
                                    className="relative w-full p-2 rounded-lg"
                                    style={{
                                      boxShadow:
                                        "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                                    }}
                                  >
                                    <div
                                      className="border border-gray2 border-dashed rounded-lg px-3 laptop:px-[42px] py-4 flex justify-center items-start gap-6 cursor-pointer w-full"
                                      onClick={handle3DClick}
                                      onDrop={handle3DDrop}
                                      onDrag={handle3DDragOver}
                                    >
                                      <img
                                        src={Ic_upload_blue_img}
                                        alt="upload"
                                      />
                                      <div className="flex items-start justify-start flex-col gap-3">
                                        <div className="flex items-center gap-3">
                                          <span className="text-primary font-medium whitespace-nowrap flex items-center justify-center border-2 border-purple rounded-[40px] h-[36px] py-2 px-4">
                                            Bla gjennom
                                          </span>
                                          <p className="text-gray text-sm text-center truncate w-full">
                                            Slipp filen her for å laste den opp
                                          </p>
                                        </div>
                                        <p className="text-gray text-sm truncate w-full">
                                          Filformater: Kun PDF, maks 2 MB
                                        </p>
                                      </div>
                                      <input
                                        type="file"
                                        ref={file3DInputRef}
                                        className="hidden"
                                        accept=".svg, .png, .jpg, .jpeg, .gif"
                                        onChange={handle3DFileChange}
                                        name="photo3D"
                                        multiple
                                      />
                                    </div>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      {upload3DPhoto && (
                        <div className="mt-5 flex items-center gap-5 flex-wrap">
                          {upload3DPhoto?.map((file: any, index: number) => (
                            <div
                              className="relative h-[140px] w-[140px]"
                              key={index}
                            >
                              <img
                                src={file}
                                alt="logo"
                                className="object-cover w-full h-full rounded-lg"
                              />
                              <div
                                className="absolute bottom-2 right-2 bg-white rounded-full w-6 h-6 p-1 flex items-center justify-center cursor-pointer"
                                onClick={() => {
                                  const updatedFiles = upload3DPhoto.filter(
                                    (_: any, i: number) => i !== index
                                  );
                                  form.setValue("photo3D", updatedFiles);
                                }}
                              >
                                <Trash2 className="text-red h-4 w-4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="BRATotal"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              BRA total (bruksareal)
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn BRA total (bruksareal)"
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
                        name="PRom"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              GUA (Gulvareal)
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn GUA (Gulvareal)"
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
                        name="Mønehøyde"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Mønehøyde
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Mønehøyde"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  type="number"
                                  onChange={(e: any) =>
                                    field.onChange(Number(e.target.value) || "")
                                  }
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
                        name="Gesimshøyde"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Gesimshøyde
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Gesimshøyde"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  type="number"
                                  onChange={(e: any) =>
                                    field.onChange(Number(e.target.value) || "")
                                  }
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
                        name="Takvinkel"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Takvinkel
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Takvinkel"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  type="number"
                                  onChange={(e: any) =>
                                    field.onChange(Number(e.target.value) || "")
                                  }
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
                        name="BebygdAreal"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Bebygd areal (BYA)
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Bebygd areal (BYA)"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  type="number"
                                  onChange={(e: any) =>
                                    field.onChange(Number(e.target.value) || "")
                                  }
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
                        name="LB"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              L x B
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn L x B"
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
                        name="Soverom"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Soverom
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Soverom"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  type="number"
                                  onChange={(e: any) =>
                                    field.onChange(Number(e.target.value) || "")
                                  }
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
                        name="Bad"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Bad
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Bad"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  type="number"
                                  onChange={(e: any) =>
                                    field.onChange(Number(e.target.value) || "")
                                  }
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
                        name="InnvendigBod"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Innvendig bod
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Innvendig bod"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                  type="number"
                                  onChange={(e: any) =>
                                    field.onChange(Number(e.target.value) || "")
                                  }
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
                        name="Energimerking"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Energimerking
                            </p>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger
                                  className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                                >
                                  <SelectValue placeholder="Enter Energimerking" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectGroup>
                                    <SelectItem value="A">A</SelectItem>
                                    <SelectItem value="B">B</SelectItem>
                                    <SelectItem value="C">C</SelectItem>
                                    <SelectItem value="D">D</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="TilgjengeligBolig"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Tilgjengelig bolig
                            </p>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger
                                  className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                                >
                                  <SelectValue placeholder="Enter Tilgjengelig bolig" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectGroup>
                                    <SelectItem value="Ja">Ja</SelectItem>
                                    <SelectItem value="Nei">Nei</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="Tomtetype"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Tomtetype
                            </p>
                            <FormControl>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value}
                              >
                                <SelectTrigger
                                  className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                                >
                                  <SelectValue placeholder="Enter Tomtetype" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectGroup>
                                    <SelectItem value="Flat">Flat</SelectItem>
                                    <SelectItem value="Skrånet">
                                      Skrånet
                                    </SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="border-[#EFF1F5] border rounded-lg overflow-hidden">
                <div
                  className={`bg-white flex justify-between items-center w-full p-4 cursor-pointer duration-1000 ${
                    isOpen ? "active" : ""
                  }`}
                  onClick={() => toggleAccordion("section2")}
                >
                  <span className="text-black text-lg font-medium">
                    Husbeskrivelse og plantegninger
                  </span>

                  {isOpen.section1 ? (
                    <ChevronUp className="text-purple" />
                  ) : (
                    <ChevronDown className="text-purple" />
                  )}
                </div>
                {isOpen.section2 && (
                  <div className="grid grid-cols-2 gap-6 w-[100%] border-[#EFF1F5] border-t p-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="Hustittel"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Hustittel
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Hustittel"
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
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="OmHusmodellen"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Om husmodellen
                            </p>
                            <FormControl>
                              <div className="relative">
                                <TextArea
                                  placeholder="Skriv inn Om husmodellen"
                                  {...field}
                                  className={`h-[300px] bg-white rounded-[8px] border text-black
                                  ${
                                    fieldState?.error
                                      ? "border-red"
                                      : "border-gray1"
                                  } `}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="PlantegningerFasader"
                        render={({ fieldState }) => (
                          <FormItem className="w-full">
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Plantegninger og fasader
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
                                    onDragOver={
                                      handlePlantegningerFasaderDragOver
                                    }
                                    onClick={handlePlantegningerFasaderClick}
                                    onDrop={handlePlantegningerFasaderDrop}
                                  >
                                    <p className="text-gray text-sm text-center truncate w-full">
                                      <span className="text-primary font-medium truncate">
                                        Bla gjennom
                                      </span>{" "}
                                      Slipp filen her for å laste den opp
                                    </p>
                                    <p className="text-gray text-sm text-center truncate w-full">
                                      Filformater: Kun PDF, maks 2 MB
                                    </p>
                                    <input
                                      type="file"
                                      ref={
                                        filePlantegningerFasaderPhotoInputRef
                                      }
                                      className="hidden"
                                      accept=".svg, .png, .jpg, .jpeg, .gif"
                                      onChange={
                                        handlePlantegningerFasaderFileChange
                                      }
                                      name="PlantegningerFasader"
                                      multiple
                                    />
                                  </div>
                                </div>
                                {uploadPlantegningerFasaderPhoto && (
                                  <div className="mt-5 flex items-center gap-5 flex-wrap">
                                    {uploadPlantegningerFasaderPhoto?.map(
                                      (file: any, index: number) => (
                                        <div
                                          className="relative h-[140px] w-[140px]"
                                          key={index}
                                        >
                                          <img
                                            src={file}
                                            alt="logo"
                                            className="object-cover w-full h-full rounded-lg"
                                          />
                                          <div
                                            className="bg-white rounded-full w-6 h-6 flex items-center justify-center absolute bottom-2 right-2 cursor-pointer"
                                            onClick={() => {
                                              const updatedFiles =
                                                uploadPlantegningerFasaderPhoto.filter(
                                                  (_: any, i: number) =>
                                                    i !== index
                                                );
                                              form.setValue(
                                                "PlantegningerFasader",
                                                updatedFiles
                                              );
                                            }}
                                          >
                                            <Trash2 className="text-red w-4 h-4" />
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
                        name="TittelVideo"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Tittel på video
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Tittel på video"
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
                        name="VideoLink"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Video link
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn Video link"
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
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
            <Link to={"/Husmodell"} className="w-1/2 sm:w-auto">
              <Button
                text="Avbryt"
                className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              />
            </Link>
            <Button
              text="Lagre"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              type="submit"
            />
          </div>
          {loading && <Spinner />}
        </form>
      </Form>
    </>
  );
};
