import { useFieldArray, useForm } from "react-hook-form";
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
import { toast } from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../config/firebaseConfig";
import React, { useCallback, useState } from "react";
import { Plus, X } from "lucide-react";
import { TextArea } from "../../../components/ui/textarea";

const fileSchema = z.union([
  z
    .instanceof(File)
    .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
      message: "Filstørrelsen må være mindre enn 10 MB.",
    }),
  z.string(),
]);

const productSchema = z.object({
  Produktnavn: z.string().min(1, "Produktnavn må bestå av minst 1 tegn."),
  delieverBy: z.string().min(1, "Lever innen må bestå av minst 1 tegn."),
  Hovedbilde: z.array(fileSchema).min(1, "Minst én fil må lastes opp."),
  pris: z.string().nullable(),
  IncludingOffer: z.boolean().optional(),
  Produktbeskrivelse: z
    .string()
    .min(1, "Produktbeskrivelse må bestå av minst 1 tegn."),
});

const formSchema = z.object({
  produkter: z.array(productSchema).min(1, "Minst ett produkt er påkrevd."),
});

export const ProductFormDrawer: React.FC<{
  onClose: any;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}> = ({ onClose, onSubmit: onSubmitProp }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produkter: [
        {
          Produktnavn: "",
          delieverBy: "",
          Hovedbilde: [],
          pris: "",
          IncludingOffer: false,
          Produktbeskrivelse: "",
        },
      ],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // onSubmit(newProduct)
    // Send full form data to parent component
    if (typeof onSubmitProp === "function") {
      onSubmitProp(data); // pass the whole form data
    }
    onClose();
    // const updatedName = data.Kategorinavn;

    // const existingCategories =
    //   formData.getValues(`hovedkategorinavn.${activeTabData}.Kategorinavn`) ||
    //   [];

    // if (editIndex !== null && existingCategories[editIndex]) {
    //   // Edit existing
    //   const updatedCategories = [...existingCategories];
    //   updatedCategories[editIndex].navn = updatedName;

    //   setCategory((prev: any) => {
    //     const updatedCategory = [...prev];
    //     updatedCategory[activeTabData] = {
    //       ...updatedCategory[activeTabData],
    //       Kategorinavn: updatedCategories,
    //     };
    //     return updatedCategory;
    //   });

    //   formData.setValue(
    //     `hovedkategorinavn.${activeTabData}.Kategorinavn`,
    //     updatedCategories,
    //     { shouldValidate: true }
    //   );
    // } else {
    //   // Add new
    //   const newSubCategory = { navn: updatedName, produkter: [] };
    //   setCategory((prev: any) => {
    //     const updatedCategory = [...prev];
    //     updatedCategory[activeTabData] = {
    //       ...updatedCategory[activeTabData],
    //       Kategorinavn: [...existingCategories, newSubCategory],
    //     };
    //     return updatedCategory;
    //   });
    //   formData.setValue(
    //     `hovedkategorinavn.${activeTabData}.Kategorinavn`,
    //     [...existingCategories, newSubCategory],
    //     { shouldValidate: true }
    //   );
    // }
  };

  const file3DInputRef = React.useRef<HTMLInputElement | null>(null);

  const handle3DClick = () => {
    file3DInputRef.current?.click();
  };
  const handle3DDragOver = useCallback(
    (event: any) => event.preventDefault(),
    []
  );
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null
  );

  const delieverBy = ["Boligpartner", "Salgskontor"];
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "produkter",
  });

  const produkter = form.watch(`produkter`);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full h-screen"
        >
          <div className="overflow-y-auto h-full pb-[160px]">
            {fields.map((_, index) => {
              const upload3DPhoto = form.watch(`produkter.${index}.Hovedbilde`);

              return (
                <div
                  className="flex flex-col gap-[18px] p-4 bg-white border border-[#DCDFEA]"
                  key={index}
                >
                  <button
                    type="button"
                    className={`flex gap-2 items-end ml-auto ${
                      produkter.length === 1
                        ? "text-gray cursor-not-allowed"
                        : "text-primary"
                    }`}
                    onClick={() => {
                      if (produkter.length > 1) remove(index);
                    }}
                  >
                    <X /> Fjern produkt
                  </button>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <FormField
                        control={form.control}
                        name={`produkter.${index}.Produktnavn`}
                        render={({ field, fieldState }) => {
                          const initialValue =
                            form.getValues(`produkter.${index}.Produktnavn`) ||
                            "";
                          return (
                            <FormItem>
                              <p
                                className={`${
                                  fieldState.error ? "text-red" : "text-black"
                                } mb-[6px] text-sm font-medium`}
                              >
                                Produktnavn
                              </p>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Skriv inn Produktnavn"
                                    {...field}
                                    className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                                    type="text"
                                    value={initialValue ?? ""}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name={`produkter.${index}.pris`}
                        render={({ field, fieldState }) => {
                          const initialValue = form.getValues(
                            `produkter.${index}.pris`
                          );
                          return (
                            <FormItem>
                              <div className="flex items-center justify-between gap-2 mb-[6px]">
                                <p
                                  className={`${
                                    fieldState.error ? "text-red" : "text-black"
                                  } text-sm font-medium`}
                                >
                                  Pris fra
                                </p>
                                <div className="flex items-center gap-3 text-black text-sm font-medium">
                                  inkl. i tilbud
                                  <div className="toggle-container">
                                    <input
                                      type="checkbox"
                                      id={`toggleSwitch.${index}.IncludingOffer`}
                                      className="toggle-input"
                                      checked={
                                        form.watch(
                                          `produkter.${index}.IncludingOffer`
                                        ) || false
                                      }
                                      name={`IncludingOffer`}
                                      onChange={(e: any) => {
                                        const checkedValue = e.target.checked;
                                        form.setValue(
                                          `produkter.${index}.IncludingOffer`,
                                          checkedValue
                                        );
                                        if (checkedValue) {
                                          form.setValue(
                                            `produkter.${index}.pris`,
                                            null
                                          );
                                        } else {
                                          form.setValue(
                                            `produkter.${index}.pris`,
                                            ""
                                          );
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`toggleSwitch.${index}.IncludingOffer`}
                                      className="toggle-label"
                                    ></label>
                                  </div>
                                </div>
                              </div>
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
                                    disabled={form.watch(
                                      `produkter.${index}.IncludingOffer`
                                    )}
                                    type="text"
                                    onChange={({ target: { value } }: any) => {
                                      let cleaned = value
                                        .replace(/[^\d-]/g, "")
                                        .replace(/(?!^)-/g, "");

                                      const isNegative =
                                        cleaned.startsWith("-");

                                      const numericPart = cleaned.replace(
                                        /-/g,
                                        ""
                                      );

                                      let formatted = "";

                                      if (numericPart) {
                                        formatted = new Intl.NumberFormat(
                                          "no-NO"
                                        ).format(Number(numericPart));
                                        if (isNegative) {
                                          formatted = "-" + formatted;
                                        }
                                      } else {
                                        formatted = isNegative ? "-" : "";
                                      }

                                      field.onChange({
                                        target: {
                                          name: `produkter.${index}.pris`,
                                          value: formatted,
                                        },
                                      });
                                    }}
                                    value={
                                      initialValue === null ? "-" : initialValue
                                    }
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name={`produkter.${index}.delieverBy`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`mb-2 ${
                                fieldState.error ? "text-red" : "text-black"
                              } text-sm font-medium`}
                            >
                              Lever innen
                            </p>
                            <FormControl>
                              <div className="flex items-center gap-5">
                                {delieverBy.map((option) => (
                                  <div
                                    key={option}
                                    className="relative flex items-center gap-2"
                                  >
                                    <input
                                      className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-primary`}
                                      type="radio"
                                      value={option}
                                      onChange={(e) => {
                                        form.setValue(
                                          `produkter.${index}.delieverBy`,
                                          e.target.value
                                        );
                                      }}
                                      checked={field.value === option}
                                    />
                                    <p
                                      className={`text-gray text-sm font-medium`}
                                    >
                                      {option}
                                    </p>
                                  </div>
                                ))}
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
                        name={`produkter.${index}.Produktbeskrivelse`}
                        render={({ field, fieldState }) => {
                          const initialValue =
                            form.getValues(
                              `produkter.${index}.Produktbeskrivelse`
                            ) || "";
                          return (
                            <FormItem>
                              <p
                                className={`${
                                  fieldState.error ? "text-red" : "text-black"
                                } mb-[6px] text-sm font-medium`}
                              >
                                Produktbeskrivelse
                              </p>
                              <FormControl>
                                <div className="relative">
                                  <TextArea
                                    placeholder="Skriv inn Produktbeskrivelse"
                                    {...field}
                                    className={`h-[130px] bg-white rounded-[8px] border text-black
                                  ${
                                    fieldState?.error
                                      ? "border-red"
                                      : "border-gray1"
                                  } `}
                                    value={initialValue}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                    <div className="row-span-2">
                      <FormField
                        control={form.control}
                        name={`produkter.${index}.Hovedbilde`}
                        render={({ fieldState }) => {
                          const fieldPath: any = `produkter.${index}.Hovedbilde`;
                          const initialValue = form.watch(fieldPath) || [];

                          const handleFileChange = async (
                            files: FileList | null
                          ) => {
                            if (files) {
                              let newImages: any = [...(initialValue || [])];

                              for (let i = 0; i < files.length; i++) {
                                const file: any = files[i];

                                if (file.size > 2 * 1024 * 1024) {
                                  toast.error(
                                    "Image size must be less than 2MB.",
                                    {
                                      position: "top-right",
                                    }
                                  );
                                  continue;
                                }
                                const fileType = "images";
                                const timestamp = new Date().getTime();
                                const fileName = `${timestamp}_${file?.name}`;

                                const storageRef = ref(
                                  storage,
                                  `${fileType}/${fileName}`
                                );

                                const snapshot = await uploadBytes(
                                  storageRef,
                                  file
                                );

                                const url = await getDownloadURL(snapshot.ref);

                                newImages.push(url);

                                form.setValue(fieldPath, newImages);
                                form.clearErrors(fieldPath);
                              }
                            }
                          };

                          return (
                            <FormItem className="w-full">
                              <p
                                className={`${
                                  fieldState.error ? "text-red" : "text-black"
                                } mb-[6px] text-sm font-medium`}
                              >
                                Last opp bilde
                              </p>
                              <FormControl>
                                <div className="flex items-center gap-5 w-full">
                                  <div
                                    className="relative w-max p-2 rounded-lg"
                                    style={{
                                      boxShadow:
                                        "0px 2px 4px -2px #1018280F, 0px 4px 8px -2px #1018281A",
                                    }}
                                    onDragOver={handle3DDragOver}
                                    onClick={handle3DClick}
                                    onDrop={(event) => {
                                      event.preventDefault();
                                      handleFileChange(
                                        event.dataTransfer.files
                                      );
                                    }}
                                  >
                                    <div className="border border-gray2 border-dashed rounded-lg px-3 laptop:px-[42px] py-4 flex justify-center items-center flex-col gap-3 cursor-pointer w-full">
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
                                        ref={file3DInputRef}
                                        className="hidden"
                                        multiple
                                        accept="image/png, image/jpeg, image/svg+xml, image/gif"
                                        onChange={(event) =>
                                          handleFileChange(event.target.files)
                                        }
                                      />
                                    </div>
                                  </div>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    {upload3DPhoto && (
                      <div className="mt-5 flex items-center gap-5">
                        {upload3DPhoto?.map((file: any, imgIndex: number) => (
                          <div
                            className="relative h-[140px] w-[140px]"
                            key={imgIndex}
                            draggable
                            onDragStart={() => setDraggedImageIndex(imgIndex)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                              if (
                                draggedImageIndex === null ||
                                draggedImageIndex === imgIndex
                              )
                                return;

                              const newOrder = [...upload3DPhoto];
                              const draggedItem = newOrder[draggedImageIndex];
                              newOrder.splice(draggedImageIndex, 1);
                              newOrder.splice(imgIndex, 0, draggedItem);

                              form.setValue(
                                `produkter.${index}.Hovedbilde`,
                                newOrder
                              );
                              setDraggedImageIndex(null);
                            }}
                          >
                            <img
                              src={file}
                              alt="logo"
                              className="object-cover h-full w-full rounded-lg"
                            />
                            <div
                              className="absolute top-2 right-2 bg-[#FFFFFFCC] rounded-[12px] p-[6px] cursor-pointer"
                              onClick={() => {
                                const updatedFiles = upload3DPhoto.filter(
                                  (_, i) => i !== imgIndex
                                );
                                form.setValue(
                                  `produkter.${index}.Hovedbilde`,
                                  updatedFiles
                                );
                              }}
                            >
                              <X className="text-red" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div
              className="p-6 flex items-center gap-2 text-primary text-sm font-medium cursor-pointer"
              onClick={() =>
                append({
                  Produktnavn: "",
                  delieverBy: "",
                  Hovedbilde: [],
                  pris: "",
                  IncludingOffer: false,
                  Produktbeskrivelse: "",
                })
              }
            >
              <Plus />
              Add other product
            </div>
          </div>
          <div
            className="flex sticky bottom-0 justify-end w-full gap-5 items-center left-0 px-8 py-4 bg-white"
            style={{
              boxShadow:
                "0px -3px 4px -2px #1018280F, 0px -4px 8px -2px #1018281A",
            }}
          >
            <div onClick={() => form.reset()} className="w-1/2 sm:w-auto">
              <Button
                text="Avbryt"
                className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              />
            </div>
            <Button
              text="Lagre"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </>
  );
};
