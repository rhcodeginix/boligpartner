import React, { useEffect, useState } from "react";
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
import Ic_upload_photo from "../../../assets/images/Ic_upload_photo.svg";
import { Input } from "../../../components/ui/input";
import Ic_delete_purple from "../../../assets/images/Ic_delete_purple.svg";
import Ic_x_circle from "../../../assets/images/Ic_x_circle.svg";
import { Plus, X } from "lucide-react";
import Modal from "../../../components/common/modal";
import { AddNewSubCat } from "./AddNewSubCat";
import { TextArea } from "../../../components/ui/textarea";

const fileSchema = z.union([
  z.instanceof(File).refine((file) => file.size <= 10 * 1024 * 1024, {
    message: "Filstørrelsen må være mindre enn 10 MB.",
  }),
  z.string(),
]);

const productSchema = z.object({
  Produktnavn: z.string().min(2, {
    message: "Produktnavn må bestå av minst 2 tegn.",
  }),
  Hovedbilde: z.array(fileSchema).min(1, {
    message: "Minst én fil må lastes opp.",
  }),
  pris: z
    .string()
    .min(1, {
      message: "Pris må bestå av minst 1 tegn.",
    })
    .nullable(),
  IncludingOffer: z.boolean().optional(),
  Produktbeskrivelse: z.string().min(2, {
    message: "Produktbeskrivelse må bestå av minst 2 tegn.",
  }),
});

const categorySchema = z.object({
  navn: z.string().min(2, {
    message: "Kategorinavn må bestå av minst 2 tegn.",
  }),
  produkter: z.array(productSchema).min(1, {
    message: "Minst ett produkt er påkrevd.",
  }),
});

const mainCategorySchema = z.object({
  navn: z.string().min(2, {
    message: "Hovedkategorinavn må bestå av minst 2 tegn.",
  }),
  Beskrivelse: z.string().min(2, {
    message: "Beskrivelse må bestå av minst 2 tegn.",
  }),
  Kategorinavn: z.array(categorySchema),
});

const formSchema = z.object({
  hovedkategorinavn: z.array(mainCategorySchema),
});

export const Eksterior: React.FC<{
  setActiveTab: any;
  labelName: any;
  Category: any;
  activeTabData: any;
  setCategory: any;
}> = ({ setActiveTab, labelName, Category, activeTabData, setCategory }) => {
  const [activeSubTabData, setActiveSubTabData] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hovedkategorinavn: [
        {
          navn: "",
          Beskrivelse: "",
          Kategorinavn: [
            {
              navn: "",
              produkter: [
                {
                  Produktnavn: "",
                  Hovedbilde: [],
                  pris: "",
                  IncludingOffer: false,
                  Produktbeskrivelse: "",
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
  });

  const addProduct = () => {
    append({
      Produktnavn: "",
      Hovedbilde: [],
      pris: "",
      IncludingOffer: false,
      Produktbeskrivelse: "",
    });
  };

  // const removeProduct = (index: number) => {
  //   if (fields.length > 1) {
  //     remove(index);
  //   }
  // };
  const removeProduct = (index: number) => {
    if (fields.length > 1) {
      const currentValues = form.getValues();
      const updatedProdukter = currentValues.hovedkategorinavn[
        activeTabData
      ].Kategorinavn[activeSubTabData].produkter.filter((_, i) => i !== index);

      form.setValue(
        `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
        updatedProdukter
      );

      remove(index);
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("final-data---", data);
    // setActiveTab(2);
  };

  const [AddSubCategory, setAddSubCategory] = useState(false);

  useEffect(() => {
    form.setValue("hovedkategorinavn", Category);
  }, [form, Category]);

  const handleToggleSubCategoryPopup = () => {
    if (AddSubCategory) {
      setAddSubCategory(false);
    } else {
      setAddSubCategory(true);
    }
  };
  const file3DInputRef = React.useRef<HTMLInputElement | null>(null);

  const handle3DClick = () => {
    file3DInputRef.current?.click();
  };

  const handle3DDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const produkter = form.watch(
    `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
  );

  const totalPris =
    produkter &&
    produkter.reduce((acc, prod) => {
      const numericValue = prod.pris
        ?.replace(/\s/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
      return acc + (numericValue ? parseFloat(numericValue) : 0);
    }, 0);

  const hovedkategorinavn = (() => {
    const categories =
      form.getValues("hovedkategorinavn")?.[activeTabData]?.Kategorinavn || [];

    const filteredCategories = categories.filter(
      (item: any) => item?.navn?.trim() !== ""
    );

    return filteredCategories.length > 0 ? filteredCategories : [];
  })();

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-darkBlack font-semibold text-xl">
                {labelName}
              </h4>
              <h5
                className="text-purple font-semibold text-base cursor-pointer"
                onClick={() => setActiveTab(2)}
              >
                Hopp over steget
              </h5>
            </div>
            <FormField
              key={activeTabData}
              control={form.control}
              name={`hovedkategorinavn.${activeTabData}.Beskrivelse`}
              render={({ field, fieldState }) => {
                const wordCount =
                  field?.value && typeof field.value === "string"
                    ? field?.value?.trim().split(/\s+/).length
                    : 0;
                const maxWords = 20;

                return (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : "text-black"
                      } mb-[6px] text-sm font-medium`}
                    >
                      Beskrivelse
                    </p>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Skriv inn Beskrivelse"
                          {...field}
                          className={`bg-white rounded-[8px] border text-black ${
                            fieldState.error ? "border-red" : "border-gray1"
                          }`}
                          type="text"
                          onChange={(e: any) => {
                            const words = e?.target?.value?.trim().split(/\s+/);
                            if (words.length <= maxWords) {
                              field.onChange(e.target.value);
                              setCategory((prev: any) => {
                                const updatedCategory = [...prev];
                                updatedCategory[activeTabData] = {
                                  ...updatedCategory[activeTabData],
                                  Beskrivelse: e.target.value,
                                };
                                return updatedCategory;
                              });
                            }
                          }}
                        />
                        <div className="flex justify-end text-xs font-medium mt-[6px] text-black">
                          {wordCount}/{maxWords}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                );
              }}
            />
            <div className="mt-2 border-b border-gray2 flex items-center gap-6 h-[48px] mb-8">
              {hovedkategorinavn?.length > 0 && (
                <div className="flex items-center gap-4 overflow-x-auto overflowXAuto">
                  {hovedkategorinavn?.map((cat: any, index: number) => (
                    <div
                      key={index}
                      className={`cursor-pointer font-semibold gap-1 h-full flex items-center border-b-[3px] text-darkBlack py-3 px-5 whitespace-nowrap ${
                        activeSubTabData === index
                          ? "border-primary font-semibold"
                          : "border-transparent"
                      }`}
                      onClick={() => setActiveSubTabData(index)}
                    >
                      <span className="text-sm">{cat.navn}</span>
                      <img
                        src={Ic_x_circle}
                        alt="close"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const updatedCategories = hovedkategorinavn.filter(
                            (_, i) => i !== index
                          );

                          setCategory((prev: any) => {
                            const updatedCategory = [...prev];
                            updatedCategory[activeTabData] = {
                              ...updatedCategory[activeTabData],
                              Kategorinavn: updatedCategories,
                            };
                            return updatedCategory;
                          });

                          form.setValue(
                            `hovedkategorinavn.${activeTabData}.Kategorinavn`,
                            updatedCategories,
                            { shouldValidate: true }
                          );
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div
                className="text-purple font-semibold text-sm flex items-center gap-1 cursor-pointer h-full whitespace-nowrap"
                onClick={() => setAddSubCategory(true)}
              >
                <Plus />
                Legg til kategori
              </div>
            </div>
            {hovedkategorinavn?.length > 0 && (
              <div className="flex flex-col gap-8">
                {fields.map((product, index) => {
                  const upload3DPhoto = form.watch(
                    `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Hovedbilde`
                  );

                  return (
                    <div key={product.id} className="flex flex-col gap-[18px]">
                      <div className="flex items-center gap-3 justify-between">
                        <h4 className="text-darkBlack text-base font-semibold">
                          Produktdetaljer
                        </h4>
                        <div
                          className={`flex items-center gap-1 font-medium ${
                            fields.length === 1
                              ? "text-gray cursor-not-allowed text-opacity-55"
                              : "text-purple cursor-pointer"
                          }`}
                          onClick={() => {
                            if (fields.length > 1) {
                              removeProduct(index);
                            }
                          }}
                        >
                          <X /> Slett produkt
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <FormField
                            control={form.control}
                            name={`hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Produktnavn`}
                            render={({ field, fieldState }) => {
                              const initialValue = form.getValues(
                                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Produktnavn`
                              );
                              return (
                                <FormItem>
                                  <p
                                    className={`${
                                      fieldState.error
                                        ? "text-red"
                                        : "text-black"
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
                                        value={initialValue ?? field.value}
                                        onChange={(e: any) =>
                                          field.onChange(e.target.value)
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
                        <div className="row-span-2">
                          <FormField
                            control={form.control}
                            name={`hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Hovedbilde`}
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormControl>
                                  <div className="flex items-center gap-5 w-full">
                                    <div className="relative w-full">
                                      <div
                                        className="border border-gray2 rounded-[8px] px-3 laptop:px-6 py-4 flex justify-center items-center flex-col gap-3 cursor-pointer w-full"
                                        onDragOver={handle3DDragOver}
                                        onClick={handle3DClick}
                                        onDrop={(event) => {
                                          event.preventDefault();
                                          const files = Array.from(
                                            event.dataTransfer.files
                                          );

                                          if (files.length > 0) {
                                            const updatedFiles = [
                                              ...(Array.isArray(field.value)
                                                ? field.value
                                                : []),
                                              ...files,
                                            ];
                                            form.setValue(
                                              `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Hovedbilde`,
                                              updatedFiles
                                            );
                                            form.clearErrors(
                                              `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Hovedbilde`
                                            );
                                          }
                                        }}
                                      >
                                        <img
                                          src={Ic_upload_photo}
                                          alt="upload"
                                        />
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
                                          multiple
                                          accept="image/png, image/jpeg, image/svg+xml, image/gif"
                                          onChange={(event) => {
                                            const files = event.target.files
                                              ? Array.from(event.target.files)
                                              : [];
                                            if (files.length > 0) {
                                              const updatedFiles = [
                                                ...(Array.isArray(field.value)
                                                  ? field.value
                                                  : []),
                                                ...files,
                                              ];
                                              form.setValue(
                                                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Hovedbilde`,
                                                updatedFiles
                                              );
                                              form.clearErrors(
                                                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Hovedbilde`
                                              );
                                            }
                                          }}
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
                            name={`hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.pris`}
                            render={({ field, fieldState }) => (
                              <FormItem>
                                <div className="flex items-center justify-between gap-2 mb-[6px]">
                                  <p
                                    className={`${
                                      fieldState.error
                                        ? "text-red"
                                        : "text-black"
                                    } text-sm font-medium`}
                                  >
                                    Pris fra
                                  </p>
                                  <div className="flex items-center gap-3 text-black text-sm font-medium">
                                    inkl. i tilbud
                                    <div className="toggle-container">
                                      <input
                                        type="checkbox"
                                        id={`toggleSwitch.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.IncludingOffer`}
                                        className="toggle-input"
                                        checked={
                                          form.watch(
                                            `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.IncludingOffer`
                                          ) || false
                                        }
                                        name={`hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.IncludingOffer`}
                                        onChange={(e: any) => {
                                          const checkedValue = e.target.checked;
                                          form.setValue(
                                            `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.IncludingOffer`,
                                            checkedValue
                                          );
                                          if (checkedValue) {
                                            form.setValue(
                                              `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.pris`,
                                              null
                                            );
                                          } else {
                                            form.setValue(
                                              `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.pris`,
                                              ""
                                            );
                                          }
                                        }}
                                      />
                                      <label
                                        htmlFor={`toggleSwitch.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.IncludingOffer`}
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
                                      type="text"
                                      onChange={({ target: { value } }: any) =>
                                        field.onChange({
                                          target: {
                                            name: `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.pris`,
                                            value: value.replace(/\D/g, "")
                                              ? new Intl.NumberFormat(
                                                  "no-NO"
                                                ).format(
                                                  Number(
                                                    value.replace(/\D/g, "")
                                                  )
                                                )
                                              : "",
                                          },
                                        })
                                      }
                                      value={
                                        field.value === null ? "-" : field.value
                                      }
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        {upload3DPhoto && (
                          <div className="mt-5 flex items-center gap-5">
                            {upload3DPhoto.map(
                              (file: any, imgIndex: number) => (
                                <div
                                  className="relative h-[140px] w-[140px]"
                                  key={imgIndex}
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt="logo"
                                    height="100%"
                                    width="100%"
                                    className="object-cover"
                                  />
                                  <div
                                    className="absolute top-2 right-2 bg-[#FFFFFFCC] rounded-[12px] p-[6px] cursor-pointer"
                                    onClick={() => {
                                      const updatedFiles = upload3DPhoto.filter(
                                        (_, i) => i !== imgIndex
                                      );
                                      form.setValue(
                                        `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Hovedbilde`,
                                        updatedFiles
                                      );
                                    }}
                                  >
                                    <img src={Ic_delete_purple} alt="delete" />
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name={`hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${index}.Produktbeskrivelse`}
                          render={({ field, fieldState }) => (
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
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
                <div
                  className="text-purple font-semibold text-base flex items-center gap-1 cursor-pointer h-full"
                  onClick={addProduct}
                >
                  <Plus />
                  Legg til annet produkt
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
            <div className="flex items-center gap-4">
              <span className="text-gray text-base mb-4">Totalpris</span>
              <div>
                <h3 className="mb-[2px] text-darkBlack font-semibold text-2xl">
                  {totalPris} NOK
                </h3>
                <h6 className="text-purple text-sm font-semibold">
                  Se oppstilling
                </h6>
              </div>
            </div>
            <div className="flex items-center gap-5">
              <div
                onClick={() => {
                  setActiveTab(0);
                }}
                className="w-1/2 sm:w-auto"
              >
                <Button
                  text="Avbryt"
                  className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2 flex items-center gap-2"
                />
              </div>
              <Button
                text="Lagre"
                className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2 flex items-center gap-2"
                type="submit"
              />
            </div>
          </div>
        </form>
      </Form>

      {AddSubCategory && (
        <Modal onClose={handleToggleSubCategoryPopup} isOpen={true}>
          <div className="bg-white relative rounded-[12px] p-6 md:m-0 w-full sm:w-[518px]">
            <h4 className="mb-[20px] text-darkBlack font-medium text-xl">
              Legg til ny underkategori
            </h4>
            <AddNewSubCat
              onClose={handleToggleSubCategoryPopup}
              formData={form}
              activeTabData={activeTabData}
              setCategory={setCategory}
            />
          </div>
        </Modal>
      )}
    </>
  );
};
