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
import Ic_upload_photo from "../../../assets/images/Ic_upload_photo.svg";
import Ic_build_housing from "../../../assets/images/Ic_build_housing.svg";
import Ic_delete_purple from "../../../assets/images/Ic_delete_purple.svg";
import Ic_garaje from "../../../assets/images/Ic_garaje.svg";
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
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../config/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { fetchHusmodellData, fetchSupplierData } from "../../../lib/utils";
import { Spinner } from "../../../components/Spinner";

const formSchema = z.object({
  Leverandører: z
    .string()
    .min(1, { message: "Leverandører must må spesifiseres." }),
  TypeObjekt: z.string().min(1, { message: "Velg en Type Objekt." }),
  photo: z.union([
    z
      .instanceof(File)
      .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
        message: "Filstørrelsen må være mindre enn 10 MB.",
      }),
    z.string(),
  ]),
  PlantegningerFasader: z.union([
    z
      .instanceof(File)
      .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
        message: "Filstørrelsen må være mindre enn 10 MB.",
      }),
    z.string(),
  ]),
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
    message: "BRA total må bestå av minst 2 tegn.",
  }),
  Bruksareal: z.string().min(1, { message: "Bruksareal må spesifiseres." }),
  PRom: z.string().min(1, {
    message: "P-rom må bestå av minst 2 tegn.",
  }),
  BebygdArealBYA: z.string().min(1, {
    message: "Bebygd areal (BYA) må bestå av minst 2 tegn.",
  }),
  Mønehøyde: z.number().min(1, {
    message: "Mønehøyde areal (BYA) må bestå av minst 2 tegn.",
  }),
  Gesimshøyde: z.number().min(1, {
    message: "Gesimshøyde areal (BYA) må bestå av minst 2 tegn.",
  }),
  LB: z.string().min(1, {
    message: "LB areal (BYA) må bestå av minst 2 tegn.",
  }),
  Takvinkel: z.number().min(1, {
    message: "Takvinkel areal (BYA) må bestå av minst 2 tegn.",
  }),
  BebygdAreal: z.number().min(1, {
    message: "Bebygd areal må bestå av minst 2 tegn.",
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
  TittelVideo: z.string().min(1, {
    message: "Tittel på video må bestå av minst 2 tegn.",
  }),
  VideoLink: z
    .string()
    .refine(
      (val) =>
        val === "" ||
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?(\/.*)?$/.test(
          val
        ),
      {
        message: "Please enter a valid URL.",
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
  const [suppliers, setSuppliers] = useState([]);
  const [oldSupplierId, setOldSupplierId] = useState<any | null>(null);

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
            if (key === "Leverandører") {
              setOldSupplierId(value);
            }
          }
        });
      }
      setLoading(false);
    };

    getData();
  }, [form, id, suppliers]);

  const fetchSuppliersData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "suppliers"));
      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSuppliers(data);
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    }
  };

  useEffect(() => {
    fetchSuppliersData();
  }, []);

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

  const handlePlantegningerFasaderFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files?.[0]) {
      await uploadFile(event.target.files[0], "PlantegningerFasader");
    }
  };

  const handlePlantegningerFasaderClick = () => {
    filePlantegningerFasaderPhotoInputRef.current?.click();
  };

  const handlePlantegningerFasaderDrop = async (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    if (event.dataTransfer.files?.[0]) {
      await uploadFile(event.dataTransfer.files[0], "PlantegningerFasader");
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    let newImages = [...(upload3DPhoto || [])];

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

    if (uploadedUrls.length) {
      newImages = [...newImages, ...uploadedUrls];
      form.setValue("photo3D", newImages);
      form.clearErrors("photo3D");
    }
  };

  const handle3DFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      await handleFileUpload(event.target.files);
    }
  };

  const handle3DClick = () => {
    file3DInputRef.current?.click();
  };

  const handle3DDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      await handleFileUpload(event.dataTransfer.files);
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

      const formatter = new Intl.DateTimeFormat("nb-NO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const newSupplierId = data.Leverandører;

      if (oldSupplierId && newSupplierId !== oldSupplierId) {
        const newSupplierDocRef = doc(db, "suppliers", newSupplierId);
        const newSupplierData = await fetchSupplierData(newSupplierId);

        await updateDoc(newSupplierDocRef, {
          ...newSupplierData,
          id: newSupplierId,
          updatedAt: formatter.format(new Date()),
          Produkter: newSupplierData?.Produkter + 1,
        });

        const oldSupplierDocRef = doc(db, "suppliers", oldSupplierId);
        const oldSupplierData = await fetchSupplierData(oldSupplierId);

        await updateDoc(oldSupplierDocRef, {
          ...oldSupplierData,
          id: oldSupplierId,
          updatedAt: formatter.format(new Date()),
          Produkter: Math.max(
            oldSupplierData?.Produkter === 0
              ? 0
              : oldSupplierData?.Produkter - 1
          ),
        });
      } else {
        const newSupplierDocRef = doc(db, "suppliers", newSupplierId);
        const newSupplierData = await fetchSupplierData(newSupplierId);

        await updateDoc(newSupplierDocRef, {
          ...newSupplierData,
          id: newSupplierId,
          updatedAt: formatter.format(new Date()),
          Produkter: newSupplierData?.Produkter + 1,
        });
      }

      const uniqueId = id ? id : uuidv4();
      const husmodellDocRef = doc(db, "house_model", uniqueId);

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
        });
        toast.success("Added successfully", { position: "top-right" });
      }

      navigate(`/edit-husmodell/${uniqueId}`);
      setActiveTab(1);
      setOldSupplierId(null);
    } catch (error) {
      console.error("Firestore operation failed:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };
  const selectedHouseType = form.watch("TypeObjekt");

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="p-6 mb-[100px]">
            <div className="flex flex-col gap-8">
              <div className="flex gap-8">
                <div className="w-[20%]">
                  <h5 className="text-black text-sm font-medium">
                    Grunninformasjon
                  </h5>
                  <p className="text-gray text-sm whitespace-nowrap">
                    Legg til bilder og husdetaljer
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 w-[80%] shadow-shadow2 px-6 py-5 rounded-lg">
                  <div>
                    <FormField
                      control={form.control}
                      name="Leverandører"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            Leverandører
                          </p>
                          <FormControl>
                            <div className="relative">
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
                                  <SelectValue placeholder="Select Leverandører" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectGroup>
                                    {suppliers.map((sup: any, index) => {
                                      return (
                                        <SelectItem value={sup?.id} key={index}>
                                          {sup?.company_name}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                          icon: Ic_build_housing,
                          value: "bolig",
                        },
                        {
                          label: "Hytte",
                          icon: Ic_build_housing,
                          value: "hytte",
                        },
                        { label: "Garasje", icon: Ic_garaje, value: "garasje" },
                      ].map((item: any, index: number) => (
                        <div
                          key={index}
                          onClick={() => {
                            form.setValue("TypeObjekt", item.value);
                            form.clearErrors("TypeObjekt");
                          }}
                          className={`border-2 rounded-lg p-2 cursor-pointer ${
                            selectedHouseType === item.value
                              ? "border-purple"
                              : "border-gray1"
                          }`}
                        >
                          <div className="bg-[#F9FAFB] rounded-[8px] h-[125px] w-[198px] flex items-center justify-center mb-2">
                            <img src={item.icon} alt={item.label} />
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
                                        ? new Intl.NumberFormat("no-NO").format(
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
                              {uploadPhoto && (
                                <img
                                  src={uploadPhoto}
                                  alt="logo"
                                  height="140px"
                                  width="140px"
                                />
                              )}
                              <div className="relative w-full">
                                <div
                                  className="border border-gray2 rounded-[8px] px-3 laptop:px-6 py-4 flex justify-center items-center flex-col gap-3 cursor-pointer w-full"
                                  onDragOver={handleDragOver}
                                  onClick={handleClick}
                                  onDrop={handleDrop}
                                >
                                  <img src={Ic_upload_photo} alt="upload" />
                                  <p className="text-gray text-sm text-center truncate w-full">
                                    <span className="text-primary font-medium truncate">
                                      Klikk for opplasting
                                    </span>{" "}
                                    eller dra-og-slipp
                                  </p>
                                  <p className="text-gray text-sm text-center truncate w-full">
                                    SVG, PNG, JPG or GIF (maks. 800x400px)
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
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-2">
                    <p className={`text-black mb-[6px] text-sm font-medium`}>
                      Illustrasjoner
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
                                <div className="relative w-full">
                                  <div
                                    className="border border-gray2 rounded-[8px] px-3 laptop:px-6 py-4 flex justify-center items-center flex-col gap-3 cursor-pointer w-full"
                                    onDragOver={handle3DDragOver}
                                    onClick={handle3DClick}
                                    onDrop={handle3DDrop}
                                  >
                                    <img src={Ic_upload_photo} alt="upload" />
                                    <p className="text-gray text-sm text-center truncate w-full">
                                      <span className="text-primary font-medium truncate">
                                        Klikk for opplasting
                                      </span>{" "}
                                      eller dra-og-slipp
                                    </p>
                                    <p className="text-gray text-sm text-center truncate w-full">
                                      SVG, PNG, JPG or GIF (maks. 800x400px)
                                    </p>
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
                        {upload3DPhoto.map((file: any, index: number) => (
                          <div
                            className="relative h-[140px] w-[140px]"
                            key={index}
                          >
                            <img
                              src={file}
                              alt="logo"
                              height="100%"
                              width="100%"
                              className="object-cover"
                            />
                            <div
                              className="absolute top-2 right-2 bg-[#FFFFFFCC] rounded-[12px] p-[6px] cursor-pointer"
                              onClick={() => {
                                const updatedFiles = upload3DPhoto.filter(
                                  (_: any, i: number) => i !== index
                                );
                                form.setValue("photo3D", updatedFiles);
                              }}
                            >
                              <img src={Ic_delete_purple} alt="delete" />
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
                            BRA total
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn BRA total"
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
                      name="Bruksareal"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            Bruksareal (BRA)
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
                                <SelectValue placeholder="Enter Bruksareal (BRA)" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                <SelectGroup>
                                  <SelectItem value="233 m2">233 m2</SelectItem>
                                  <SelectItem value="234 m2">234 m2</SelectItem>
                                  <SelectItem value="235 m2">235 m2</SelectItem>
                                  <SelectItem value="236 m2">236 m2</SelectItem>
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
                      name="PRom"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm font-medium`}
                          >
                            P-rom
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn P-rom"
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
                      name="BebygdArealBYA"
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
                            Bebygd areal
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Bebygd areal"
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
                                  <SelectItem value="Apartment">
                                    Apartment
                                  </SelectItem>
                                  <SelectItem value="House">House</SelectItem>
                                  <SelectItem value="Duplex">Duplex</SelectItem>
                                  <SelectItem value="Townhouse">
                                    Townhouse
                                  </SelectItem>
                                  <SelectItem value="Condominium">
                                    Condominium
                                  </SelectItem>
                                  <SelectItem value="Villa">Villa</SelectItem>
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
              </div>
              <div className="flex gap-8">
                <div className="w-[20%]">
                  <h5 className="text-black text-sm font-medium">
                    Husbeskrivelse og plantegninger
                  </h5>
                  <p className="text-gray text-sm whitespace-nowrap">
                    Legg til bilder og husbeskrivelse
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-6 w-[80%] shadow-shadow2 px-6 py-5 rounded-lg">
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
                  <div className="col-span-2 flex gap-6 items-center">
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
                              {uploadPlantegningerFasaderPhoto && (
                                <img
                                  src={uploadPlantegningerFasaderPhoto}
                                  alt="logo"
                                  height="140px"
                                  width="140px"
                                />
                              )}
                              <div className="relative w-full">
                                <div
                                  className="border border-gray2 rounded-[8px] px-3 laptop:px-6 py-4 flex justify-center items-center flex-col gap-3 cursor-pointer w-full"
                                  onDragOver={
                                    handlePlantegningerFasaderDragOver
                                  }
                                  onClick={handlePlantegningerFasaderClick}
                                  onDrop={handlePlantegningerFasaderDrop}
                                >
                                  <img src={Ic_upload_photo} alt="upload" />
                                  <p className="text-gray text-sm text-center truncate w-full">
                                    <span className="text-primary font-medium truncate">
                                      Klikk for opplasting
                                    </span>{" "}
                                    eller dra-og-slipp
                                  </p>
                                  <p className="text-gray text-sm text-center truncate w-full">
                                    SVG, PNG, JPG or GIF (maks. 800x400px)
                                  </p>
                                  <input
                                    type="file"
                                    ref={filePlantegningerFasaderPhotoInputRef}
                                    className="hidden"
                                    accept=".svg, .png, .jpg, .jpeg, .gif"
                                    onChange={
                                      handlePlantegningerFasaderFileChange
                                    }
                                    name="PlantegningerFasader"
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
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
            <Link to={"/Husmodeller"} className="w-1/2 sm:w-auto">
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
