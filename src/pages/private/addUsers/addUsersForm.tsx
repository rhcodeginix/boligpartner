import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";
import Button from "../../../components/common/button";
import Ic_upload_photo from "../../../assets/images/Ic_upload_photo.svg";
import { Input } from "../../../components/ui/input";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../../../config/firebaseConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { fetchAdminData } from "../../../lib/utils";
import { Spinner } from "../../../components/Spinner";

const formSchema = z.object({
  photo: z.union([
    z
      .instanceof(File)
      .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
        message: "Filstørrelsen må være mindre enn 10 MB.",
      }),
    z.string(),
  ]),
  name: z.string().min(1, {
    message: "Navn må bestå av minst 2 tegn.",
  }),
  email: z
    .string()
    .email({ message: "Vennligst skriv inn en gyldig e-postadresse." })
    .min(1, { message: "E-posten må være på minst 2 tegn." }),
  modulePermissions: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        permissions: z.object({
          all: z.boolean(),
          add: z.boolean(),
          edit: z.boolean(),
          delete: z.boolean(),
          duplicate: z.boolean().optional(),
        }),
      })
    )
    .min(1, "At least one permission is required"),
});

export const AddUserForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      modulePermissions: [],
    },
  });

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    const files = event.target.files;
    if (files && files[0]) {
      await uploadFile(files[0], "photo");
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      await uploadFile(files[0], "photo");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };
  const uploadPhoto = form.watch("photo");

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const adminDocRef = doc(db, "admin", data.email);
      const adminSnap = await getDoc(adminDocRef);
      const uniqueId = id ? id : uuidv4();

      if (id) {
        await updateDoc(adminDocRef, {
          ...data,
          id: uniqueId,
          updatedAt: new Date(),
        });
        toast.success("Updated successfully", {
          position: "top-right",
        });
      } else {
        if (!adminSnap.exists()) {
          await setDoc(adminDocRef, {
            ...data,
            role: "admin",
            id: uniqueId,
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          toast.success("Admin created successfully!", {
            position: "top-right",
          });
        } else {
          toast.error("Already Added!", { position: "top-right" });
        }
      }
      navigate(`/Brukeradministrasjon`);
    } catch (error) {
      console.error("Firestore operation failed:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  const [modulePermissions, setModulePermissions] = useState([
    {
      id: 1,
      name: "Leverandører",
      permissions: {
        all: true,
        add: true,
        edit: true,
        delete: true,
      },
    },
    {
      id: 2,
      name: "Husmodell",
      permissions: {
        all: true,
        add: true,
        edit: true,
        delete: true,
        duplicate: true,
      },
    },
  ]);

  const permissionTypes = [
    { key: "all", label: "All" },
    { key: "add", label: "Add" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
    { key: "duplicate", label: "Duplicate" },
  ];

  const handlePermissionChange = (
    moduleName: string,
    permissionKey: string
  ) => {
    setModulePermissions((prevState) => {
      return prevState.map((module: any, index: number) => {
        if (module.id === moduleName) {
          if (permissionKey === "all") {
            const newAllValue = !module.permissions.all;
            const updatedPermissions: any = {};

            Object.keys(module.permissions).forEach((key) => {
              updatedPermissions[key] = newAllValue;
            });

            return {
              ...module,
              permissions: updatedPermissions,
            };
          } else {
            const newPermissions = {
              ...module.permissions,
              [permissionKey]: !module.permissions[permissionKey],
            };

            const allSpecificPermissionsEnabled = Object.entries(newPermissions)
              .filter(([key]) => key !== "all")
              .every(([_, value]) => value === true);

            if (allSpecificPermissionsEnabled) {
              newPermissions.all = true;
            } else {
              newPermissions.all = false;
            }

            return {
              ...module,
              permissions: newPermissions,
            };
          }
        }

        return module;
      });
    });
  };

  useEffect(() => {
    form.setValue("modulePermissions", modulePermissions);
  }, [form, modulePermissions]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      const data = await fetchAdminData(id);
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null)
            form.setValue(key as any, value);
          if (key === "modulePermissions") {
            setModulePermissions(value);
          }
        });
      }
      setLoading(false);
    };

    getData();
  }, [form, id]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="p-5 laptop:p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 flex gap-6 items-center">
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="photo"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <div
                              className="border border-gray2 rounded-[8px] px-3 laptop:px-6 py-4 flex justify-center items-center flex-col gap-3 cursor-pointer"
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
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-1/2">
                  {typeof uploadPhoto === "string" && (
                    <img
                      src={uploadPhoto}
                      alt="logo"
                      height="140px"
                      width="140px"
                    />
                  )}
                </div>
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } mb-[6px] text-sm font-medium`}
                      >
                        Navn
                      </p>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Skriv inn Navn"
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
              <div className="col-span-2">
                <p className={`text-black mb-[6px] text-lg font-medium`}>
                  Informasjon om tilgangsnivå
                </p>
                <div className="border border-gray1 border-r-0 border-b-0 rounded shadow-sm overflow-x-auto">
                  <table className="min-w-full bg-white border-r border-gray1">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray1">
                        <th className="py-3 px-4 text-left font-medium text-gray-500 tracking-wider border-r border-gray1 text-black">
                          #/Modules
                        </th>
                        {permissionTypes.map((permission) => (
                          <th
                            key={permission.key}
                            className="py-3 px-4 text-center font-medium text-gray-500 tracking-wider border-r border-gray1 text-black"
                          >
                            {permission.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {modulePermissions.map((module: any, index) => (
                        <tr
                          key={module.id}
                          className={
                            index === 2
                              ? "border-t-2 border-b-2 border-primary"
                              : "border-b border-gray1"
                          }
                        >
                          <td className="py-3 px-4 border-r border-gray1 text-black">
                            {module.name}
                          </td>
                          {permissionTypes
                            .filter(
                              (permission) =>
                                !(
                                  module.name === "Leverandører" &&
                                  permission.key === "duplicate"
                                )
                            )
                            .map((permission) => (
                              <td
                                key={`${module.id}-${permission.key}`}
                                className="text-center py-2 px-4 border-r border-gray1"
                              >
                                <label className="inline-flex items-center justify-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={module.permissions[permission.key]}
                                    onChange={() =>
                                      handlePermissionChange(
                                        module.id,
                                        permission.key
                                      )
                                    }
                                  />
                                  <div
                                    className={`w-6 h-6 border rounded flex items-center justify-center ${
                                      module.permissions[permission.key]
                                        ? "bg-primary border-[#fff]"
                                        : "bg-white border-gray1"
                                    }`}
                                  >
                                    {module.permissions[permission.key] && (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-4 h-4 text-white"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                </label>
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {form.formState.errors.modulePermissions && (
                  <div className="text-red text-xs mt-2">
                    {form.formState.errors.modulePermissions?.message}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-gray2 p-4">
            <div onClick={() => form.reset()} className="w-1/2 sm:w-auto">
              <Button
                text="Avbryt"
                className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              />
            </div>
            <Button
              text="Lagre"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              type="submit"
            />
          </div>
        </form>
      </Form>
      {loading && <Spinner />}
    </>
  );
};
