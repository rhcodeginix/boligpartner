/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import Ic_x_circle from "../../../../assets/images/Ic_x_circle.svg";
import { ArrowLeft, Pencil, Plus, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import Drawer from "../../../../components/ui/drawer";
import { toast } from "react-hot-toast";
import { db } from "../../../../config/firebaseConfig";
import { fetchRoomData } from "../../../../lib/utils";
import { ProductFormDrawer } from "../../editHusmodel/productform";
import { ViewProductDetail } from "../../editHusmodel/ViewDetailProduct";
import { AddNewSubCat } from "../../editHusmodel/AddNewSubCat";

const fileSchema = z.union([
  z
    .instanceof(File)
    .refine((file: any) => file === null || file.size <= 10 * 1024 * 1024, {
      message: "Filstørrelsen må være mindre enn 10 MB.",
    }),
  z.string(),
]);

// const productSchema = z.object({
//   Produktnavn: z.string().min(1, "Produktnavn må bestå av minst 1 tegn."),
//   delieverBy: z.string().min(1, "Lever innen må bestå av minst 1 tegn."),
//   Hovedbilde: z.array(fileSchema).min(1, "Minst én fil må lastes opp."),
//   pris: z.string().nullable(),
//   IncludingOffer: z.boolean().optional(),
//   Produktbeskrivelse: z
//     .string()
//     .min(1, "Produktbeskrivelse må bestå av minst 1 tegn."),
//   isSelected: z.boolean().optional(),
// });

const productSchema = z.object({
  Produktnavn: z.string().optional(),
  delieverBy: z.string().optional(),
  Hovedbilde: z.array(fileSchema).optional(),
  pris: z.string().nullable().optional(),
  IncludingOffer: z.boolean().optional(),
  Produktbeskrivelse: z.string().optional(),
  isSelected: z.boolean().optional(),
});

// const categorySchema = z.object({
//   navn: z.string().min(1, "Kategorinavn må bestå av minst 1 tegn."),
//   productOptions: z.string({ required_error: "Required" }),
//   produkter: z.array(productSchema).min(1, "Minst ett produkt er påkrevd."),
// });
const categorySchema = z.discriminatedUnion("productOptions", [
  z.object({
    navn: z.string().min(1, "Kategorinavn må bestå av minst 1 tegn."),
    productOptions: z.literal("Multi Select"),
    produkter: z.array(productSchema).min(1, "Minst ett produkt er påkrevd."),
  }),
  z.object({
    navn: z.string().min(1, "Kategorinavn må bestå av minst 1 tegn."),
    productOptions: z.literal("Single Select"),
    produkter: z.array(productSchema).min(1, "Minst ett produkt er påkrevd."),
  }),
  z.object({
    navn: z.string().min(1, "Kategorinavn må bestå av minst 1 tegn."),
    productOptions: z.literal("Text"),
    text: z.string().min(1, "Kommentar er påkrevd."),
  }),
]);
const mainCategorySchema = z.object({
  name: z.string().min(1, "Hovedkategorinavn må bestå av minst 1 tegn."),
  Kategorinavn: z.array(categorySchema).optional().nullable(),
  isSelected: z.boolean().optional(),
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
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTabData) {
      setActiveSubTabData(0);
    }
  }, [activeTabData]);

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id: any = pathSegments.length > 2 ? pathSegments[2] : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hovedkategorinavn: [
        {
          name: "",
          Kategorinavn: null,
        },
      ],
    },
  });

  const produkter = form.watch(
    `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
  );

  // const { remove } = useFieldArray({
  //   control: form.control,
  //   name: `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
  // });

  // const removeProduct = (index: number) => {
  //   if (produkter.length > 1) {
  //     remove(index);
  //   }
  // };
  const [pdfId, setPdfId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPdfId(params.get("pdf_id"));
  }, []);

  function deepCompareAndMerge(oldData: any, newData: any): any {
    const merged: any = { ...oldData };

    for (const key in newData) {
      const oldVal = oldData?.[key];
      const newVal = newData[key];

      if (key === "rooms" && Array.isArray(oldVal) && Array.isArray(newVal)) {
        const mergedRooms: any[] = [];

        for (let i = 0; i < newVal.length; i++) {
          const newRoom = newVal[i];
          const indexToUpdate = i;

          if (oldVal[indexToUpdate]) {
            oldVal[indexToUpdate].Kategorinavn =
              newRoom.Kategorinavn || oldVal[indexToUpdate].Kategorinavn;
            oldVal[indexToUpdate].name =
              newRoom.name || oldVal[indexToUpdate].name;
          } else {
            oldVal[indexToUpdate] = {
              Kategorinavn: newRoom.Kategorinavn,
              name: newRoom.name,
              ...newRoom,
            };
          }

          mergedRooms.push(oldVal[indexToUpdate]);
        }
      } else if (
        typeof newVal === "object" &&
        newVal !== null &&
        !Array.isArray(newVal)
      ) {
        merged[key] = deepCompareAndMerge(oldVal || {}, newVal);
      } else if (newVal !== oldVal) {
        merged[key] = newVal;
      }
    }

    return merged;
  }

  function removeUndefined(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(removeUndefined);
    } else if (typeof obj === "object" && obj !== null) {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v !== undefined)
          .map(([k, v]) => [k, removeUndefined(v)])
      );
    }
    return obj;
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // const rooms = {
    //   rooms: data.hovedkategorinavn,
    // };
    // Ensure each first product has isSelected: true if none are selected
    const normalizedRooms = data.hovedkategorinavn.map((room: any) => {
      if (!Array.isArray(room.Kategorinavn)) return room;

      const updatedKategorinavn = room.Kategorinavn.map((kat: any) => {
        if (!Array.isArray(kat.produkter)) return kat;

        const hasSelected = kat.produkter.some((p: any) => p.isSelected);

        const updatedProdukter = kat.produkter.map((p: any, i: number) => ({
          ...p,
          isSelected: hasSelected ? p.isSelected === true : i === 0,
        }));

        return {
          ...kat,
          produkter: updatedProdukter,
        };
      });

      return {
        ...room,
        Kategorinavn: updatedKategorinavn,
      };
    });

    const rooms = {
      rooms: normalizedRooms,
    };

    try {
      const houseData: any = await fetchRoomData(id);
      let finalData;
      if (houseData) {
        finalData = houseData?.Plantegninger.find(
          (item: any) => String(item?.pdf_id) === String(pdfId)
        );
      }

      const updatedFields = deepCompareAndMerge(finalData, rooms);
      const cleanedFields = removeUndefined(updatedFields);

      // Replace the matching item in the array
      let updatedPlantegninger = [...(houseData?.Plantegninger || [])];

      const indexToUpdate = updatedPlantegninger.findIndex(
        (item: any) => String(item?.pdf_id) === String(pdfId)
      );

      if (indexToUpdate !== -1) {
        updatedPlantegninger[indexToUpdate] = {
          ...updatedPlantegninger[indexToUpdate],
          ...cleanedFields,
          id: id,
        };
      }

      const husmodellDocRef = doc(db, "room_configurator", id);
      const formatDate = (date: Date) => {
        return date
          .toLocaleString("sv-SE", { timeZone: "UTC" })
          .replace(",", "");
      };

      await updateDoc(husmodellDocRef, {
        Plantegninger: updatedPlantegninger, // ✅ send full array with only one item changed
        updatedAt: formatDate(new Date()),
      });

      toast.success("Lagret", { position: "top-right" });
      // navigate(`/Bolig-configurator`);
      // Next();
      const params = new URLSearchParams(location.search);
      params.delete("pdf_id");
      navigate(`${location.pathname}?${params.toString()}`, {
        replace: true,
      });
      setActiveTab(1);
    } catch (error) {
      console.error("Firestore operation failed:", error);
      toast.error("Something went wrong. Please try again.", {
        position: "top-right",
      });
    }
  };

  const [AddSubCategory, setAddSubCategory] = useState(false);

  // useEffect(() => {
  //   form.setValue("hovedkategorinavn", Category);
  // }, [form, Category]);

  useEffect(() => {
    if (Array.isArray(Category) && Category.length > 0) {
      const formatted = Category.map((cat: any, index: number) => ({
        name: cat.name,
        Kategorinavn:
          index === activeTabData
            ? cat.Kategorinavn && cat.Kategorinavn.length > 0
              ? cat.Kategorinavn
              : null
            : null,
      }));

      form.setValue("hovedkategorinavn", formatted);
    }
  }, [form, Category, activeTabData]);

  // useEffect(() => {
  //   if (Array.isArray(Category) && Category.length > 0) {
  //     const requiredCategoriesWithProducts = {
  //       Himlling: [
  //         {
  //           Produktnavn: "I henhold til leveransebeskrivelse",
  //         },
  //         {
  //           Produktnavn: "Mdf panel",
  //         },
  //         {
  //           Produktnavn: "Takplate 60x120",
  //         },
  //         {
  //           Produktnavn: "Eget valg",
  //         },
  //       ],
  //       Vegger: [
  //         {
  //           Produktnavn: "I henhold til leveransebeskrivelse",
  //         },
  //         {
  //           Produktnavn: "5 bords kostmald mdf plate",
  //         },
  //         {
  //           Produktnavn: "Ubehandlet sponplate",
  //         },
  //         {
  //           Produktnavn: "Eget valg",
  //         },
  //       ],
  //       Gulv: [
  //         {
  //           Produktnavn: "Lokalleveranse",
  //         },
  //         {
  //           Produktnavn: "Eikeparkett 3 stavs",
  //         },
  //         {
  //           Produktnavn: "Eikeparkett 1 stavs",
  //         },
  //         {
  //           Produktnavn: "Laminat 1 stavs",
  //         },
  //         {
  //           Produktnavn: "Eget valg",
  //         },
  //       ],
  //       Lister: [
  //         {
  //           Produktnavn: "I henhold til leveransebeskrivelse",
  //         },
  //         {
  //           Produktnavn: "Annen signatur",
  //         },
  //         {
  //           Produktnavn: "Uten lister for listefri løsning",
  //         },
  //         {
  //           Produktnavn: "Eget valg",
  //         },
  //       ],
  //       Kommentar: [],
  //     };

  //     const formatted = Category.map((cat: any, index: number) => {
  //       const existingKategorinavn =
  //         index === activeTabData && Array.isArray(cat.Kategorinavn)
  //           ? cat.Kategorinavn
  //           : [];

  //       const existingNames = existingKategorinavn.map((k: any) => k.navn);

  //       const missing = Object.entries(requiredCategoriesWithProducts)
  //         .filter(([name]) => !existingNames.includes(name))
  //         .map(([name, produkter]) => ({
  //           navn: name,
  //           productOptions: name === "Kommentar" ? "Text" : "Multi Select",
  //           produkter,
  //         }));

  //       return {
  //         name: cat.name,
  //         Kategorinavn:
  //           index === activeTabData
  //             ? [...existingKategorinavn, ...missing]
  //             : null,
  //       };
  //     });

  //     form.setValue("hovedkategorinavn", formatted);
  //   }
  // }, [activeTabData]);

  const prevProductsRef = useRef<any[]>([]);

  useEffect(() => {
    const value = form.watch(`hovedkategorinavn.${activeTabData}`);
    if (value !== undefined) {
      form.setValue(`hovedkategorinavn.${activeTabData}`, value);
    }
  }, [activeTabData, form]);

  useEffect(() => {
    const updatedProducts = form.watch(
      `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
    );

    if (!updatedProducts) return;

    if (
      JSON.stringify(prevProductsRef.current) !==
      JSON.stringify(updatedProducts)
    ) {
      setCategory((prev: any[]) => {
        const updatedCategories = [...prev];

        if (
          updatedCategories[activeTabData]?.Kategorinavn?.[activeSubTabData]
        ) {
          updatedCategories[activeTabData].Kategorinavn[
            activeSubTabData
          ].produkter = updatedProducts?.map((product: any, _index: number) => {
            return {
              Produktnavn: product.Produktnavn || "",
              Hovedbilde: product.Hovedbilde || [],
              pris: product.pris || "",
              IncludingOffer: product.IncludingOffer || false,
              Produktbeskrivelse: product.Produktbeskrivelse || "",
              delieverBy: product.delieverBy || "",
              isSelected: product.isSelected || false,
            };
          });
        }

        return updatedCategories;
      });

      prevProductsRef.current = updatedProducts;
    }
  }, [
    JSON.stringify(
      form.watch(
        `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
      )
    ),
  ]);

  const handleToggleSubCategoryPopup = () => {
    if (AddSubCategory) {
      setAddSubCategory(false);
    } else {
      setAddSubCategory(true);
    }
  };

  const hovedkategorinavn = (() => {
    const categories =
      form.getValues("hovedkategorinavn")?.[activeTabData]?.Kategorinavn || [];

    const filteredCategories = categories.filter((item: any) => {
      if (!item?.navn) {
        return false;
      }

      const hasNavn = item.navn.trim() !== "";
      const hasSubTabNavn = item?.[activeSubTabData]?.navn?.trim() !== "";
      const hasSubTabProductOptions =
        item?.[activeSubTabData]?.productOptions?.trim() !== "";

      return hasNavn || hasSubTabNavn || hasSubTabProductOptions;
    });

    return filteredCategories.length > 0 ? filteredCategories : [];
  })();

  const [draggingProductIndex, setDraggingProductIndex] = useState<
    number | null
  >(null);
  const [dragOverProductIndex, setDragOverProductIndex] = useState<
    number | null
  >(null);
  const handleDrop = () => {
    if (
      draggingProductIndex === null ||
      dragOverProductIndex === null ||
      draggingProductIndex === dragOverProductIndex
    ) {
      return;
    }

    const updatedProducts = [...produkter];
    const draggedItem = updatedProducts[draggingProductIndex];
    updatedProducts.splice(draggingProductIndex, 1);
    updatedProducts.splice(dragOverProductIndex, 0, draggedItem);

    form.setValue(
      `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
      updatedProducts
    );

    setDraggingProductIndex(null);
    setDragOverProductIndex(null);
  };

  const [editSubCatIndex, setEditSubCatIndex] = useState<number | null>(null);

  const [isProductDrawerOpen, setIsProductDrawerOpen] = useState(false);
  const handleproductDrawer = () => {
    if (isProductDrawerOpen) {
      setIsProductDrawerOpen(false);
    } else {
      setIsProductDrawerOpen(true);
    }
  };
  const title = form.watch(
    `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.navn`
  );

  const [isView, setIsView] = useState(false);
  const [ViewSubCat, setViewSubCat] = useState<any | null>(null);

  const handleproductViewDrawer = () => {
    if (isView) {
      setIsView(false);
      setViewSubCat(null);
    } else {
      setIsView(true);
    }
  };

  const [editProductIndex, setEditProductIndex] = useState<number | null>(null);
  const [isEditProductDrawerOpen, setIsEditProductDrawerOpen] = useState(false);

  const errorObj: any =
    form.formState.errors?.hovedkategorinavn?.[activeTabData]?.Kategorinavn?.[
      activeSubTabData
    ];

  const hasTextError =
    errorObj?.productOptions === "Text" &&
    "text" in errorObj &&
    !!errorObj.text;

  useEffect(() => {
    if (
      produkter &&
      produkter.length > 0 &&
      !produkter.some((p: any) => p.isSelected)
    ) {
      const updatedProducts = produkter.map((p: any, index: number) => ({
        ...p,
        isSelected: index === 0,
      }));

      form.setValue(
        `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
        updatedProducts,
        { shouldValidate: true }
      );
      setCategory((prev: any[]) => {
        const updatedCategories = [...prev];
        if (
          updatedCategories[activeTabData]?.Kategorinavn?.[activeSubTabData]
        ) {
          updatedCategories[activeTabData].Kategorinavn[
            activeSubTabData
          ].produkter = updatedProducts;
        }
        return updatedCategories;
      });
    }
  }, [produkter]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="p-4">
              <div
                className="flex items-center gap-2.5 mb-2.5 cursor-pointer"
                onClick={() => {
                  setActiveTab(3);
                }}
              >
                <ArrowLeft className="text-purple" />
                <span className="text-purple text-sm font-medium">
                  Tilbake til plantegning
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-darkBlack font-semibold text-xl">
                  Legg til konfigurasjon for {labelName}
                </h4>
              </div>
            </div>
            <div className="border-t border-gray2"></div>
            <div className="p-4">
              <div className="flex items-center gap-6 h-[48px] mb-8 border border-[#EFF1F5] rounded-lg bg-[#F9F9FB] p-2">
                {hovedkategorinavn?.length > 0 && (
                  <div className="flex items-center gap-4 overflow-x-auto overflowXAuto">
                    {hovedkategorinavn?.map((cat: any, index: number) => (
                      <div
                        key={index}
                        className={`cursor-pointer gap-1 h-full flex items-center py-2 px-3 whitespace-nowrap ${
                          activeSubTabData === index
                            ? "shadow-shadow1 bg-white font-semibold text-primary"
                            : "text-darkBlack font-normal"
                        }`}
                        onClick={() => setActiveSubTabData(index)}
                      >
                        <span className="text-sm">{cat.navn}</span>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setEditSubCatIndex(index);
                            setAddSubCategory(true);
                          }}
                        >
                          <Pencil className="w-5 h-5 text-primary" />
                        </div>
                        {/* {cat.navn !== "Himlling" &&
                          cat.navn !== "Vegger" &&
                          cat.navn !== "Gulv" &&
                          cat.navn !== "Lister" && ( */}
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
                        {/* )} */}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="text-purple font-semibold text-sm flex items-center gap-1 cursor-pointer h-full whitespace-nowrap"
                  onClick={() => setAddSubCategory(true)}
                >
                  <Plus />
                  Legg til produkt
                </div>
              </div>
              {hovedkategorinavn.length > 0 && (
                <>
                  <div className="flex items-center gap-3 justify-between mb-5">
                    <h4 className="text-darkBlack text-base font-semibold">
                      {title}
                    </h4>
                    {form.watch(
                      `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.productOptions`
                    ) !== "Text" && (
                      <div
                        className="text-purple border-2 border-purple rounded-[40px] py-2 px-4 font-semibold text-base flex items-center gap-1 cursor-pointer h-full"
                        onClick={() => {
                          setIsProductDrawerOpen(true);
                        }}
                      >
                        <Plus />
                        Legge til {title}
                      </div>
                    )}
                    {/* <div
                  className={`flex items-center gap-1 font-medium ${
                    produkter.length === 1
                      ? "text-gray cursor-not-allowed text-opacity-55"
                      : "text-purple cursor-pointer"
                  }`}
                  onClick={() => {
                    if (produkter.length > 1) {
                      removeProduct(index);
                    }
                  }}
                >
                  <X /> Slett produkt
                </div> */}
                  </div>
                  {form.watch(
                    `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.productOptions`
                  ) === "Text" ? (
                    <div className="mb-4">
                      <textarea
                        className={`h-[130px] bg-white rounded-[8px] text-black p-2 w-full resize-none text-sm
                        ${hasTextError ? "border-red" : "border-gray1"} border
                        flex w-full rounded-[8px] border-input bg-white text-black px-[14px] py-[10px] text-base focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus:shadow-none focus-visible:shadow-none resize-none border-input file:border-0 file:bg-transparent file:text-sm file:font-medium focus:bg-lightYellow2 focus:shadow-none focus-visible:shadow-none placeholder:text-[#667085] placeholder:text-opacity-55 placeholder:text-base disabled:text-[#767676] focus:shadow-shadow1`}
                        placeholder="Skriv kommentar..."
                        value={
                          form.watch(
                            `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.text`
                          ) || ""
                        }
                        onChange={(e) => {
                          form.setValue(
                            `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.text`,
                            e.target.value,
                            { shouldValidate: true }
                          );
                        }}
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {produkter?.map((product, index) => {
                        const isSelected = product?.isSelected;

                        return (
                          <div
                            // className="cursor-move border-[#EFF1F5] border rounded-lg"
                            className={`cursor-pointer border rounded-lg ${
                              isSelected
                                ? "border-2 border-purple bg-lightPurple bg-opacity-10"
                                : "border-[#EFF1F5]"
                            }`}
                            key={index}
                            draggable
                            onDragStart={() => setDraggingProductIndex(index)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverProductIndex(index);
                            }}
                            onDrop={() => handleDrop()}
                            onClick={() => {
                              const productOptions = form.getValues(
                                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.productOptions`
                              );

                              let updatedProducts;

                              if (productOptions === "Single Select") {
                                updatedProducts = produkter.map(
                                  (p: any, i: number) => ({
                                    ...p,
                                    isSelected: i === index,
                                  })
                                );
                              } else {
                                updatedProducts = produkter.map(
                                  (p: any, i: number) => ({
                                    ...p,
                                    isSelected:
                                      i === index
                                        ? !p.isSelected
                                        : p.isSelected,
                                  })
                                );
                              }

                              form.setValue(
                                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
                                updatedProducts,
                                { shouldValidate: true }
                              );
                            }}
                          >
                            <div className="flex gap-4 p-3">
                              {product?.Hovedbilde?.[0] && (
                                <div className="w-[100px]">
                                  <img
                                    src={`${product?.Hovedbilde?.[0]}`}
                                    alt="floor"
                                    className="w-[100px] h-[76px] border border-[#EFF1F5] rounded-[4px]"
                                  />
                                </div>
                              )}
                              <div className="w-full">
                                <div className="flex items-center gap-2 justify-between">
                                  <h4 className="text-darkBlack text-sm">
                                    {product?.Produktnavn}
                                  </h4>
                                  {/* <div className="flex items-center gap-2 mt-1">
                                  <Pencil
                                    className="w-5 h-5 text-primary cursor-pointer"
                                    onClick={() => {
                                      setEditProductIndex(index);
                                      setIsEditProductDrawerOpen(true);
                                    }}
                                  />
                                  <Trash2
                                    className="w-5 h-5 text-red cursor-pointer"
                                    onClick={() => {
                                      const updated = produkter.filter(
                                        (_: any, i: number) => i !== index
                                      );

                                      form.setValue(
                                        `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
                                        updated,
                                        { shouldValidate: true }
                                      );
                                    }}
                                  />
                                </div> */}
                                </div>

                                {product?.delieverBy && (
                                  <div className="mb-2 flex items-center gap-2">
                                    <p className="text-secondary text-xs">
                                      Deliver by:
                                    </p>
                                    <span className="text-darkBlack">
                                      {product?.delieverBy}
                                    </span>
                                  </div>
                                )}
                                {/* {[
                                  "Himlling",
                                  "Vegger",
                                  "Gulv",
                                  "Lister",
                                ].includes(title) ? (
                                  ""
                                ) : ( */}
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-medium text-darkBlack">
                                    {/* {product?.IncludingOffer === false
                                      ? `kr ${product?.pris}`
                                      : "Standard"} */}
                                    {product?.IncludingOffer ? (
                                      <div className="text-black font-semibold whitespace-nowrap">
                                        Standard
                                      </div>
                                    ) : (
                                      <div className="text-black font-semibold whitespace-nowrap">
                                        {product?.pris
                                          ? `kr ${product?.pris}`
                                          : "-"}
                                      </div>
                                    )}
                                  </span>

                                  {/* <span
                                  className="text-purple font-medium text-sm cursor-pointer"
                                  onClick={() => {
                                    handleproductViewDrawer();
                                    setViewSubCat(product);
                                  }}
                                >
                                  View Details
                                </span> */}
                                </div>
                                {/* )} */}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div
            className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white border-t border-gray2 p-4 left-0"
            style={{
              zIndex: 99999,
            }}
          >
            <Button
              text="Avbryt"
              className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2 flex items-center gap-2"
              onClick={() => {
                setActiveTab(3);
              }}
            />
            <Button
              text="Lukk og lagre"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2"
              type="submit"
            />
          </div>
        </form>
      </Form>

      <Drawer isOpen={AddSubCategory} onClose={handleToggleSubCategoryPopup}>
        <h4 className="text-darkBlack font-medium text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-6">
          {editSubCatIndex !== null
            ? "Rediger underkategori"
            : "Legg til ny underkategori"}
          <X
            onClick={handleToggleSubCategoryPopup}
            className="text-primary cursor-pointer"
          />
        </h4>
        <AddNewSubCat
          onClose={() => {
            setAddSubCategory(false);
            setEditSubCatIndex(null);
          }}
          formData={form}
          activeTabData={activeTabData}
          setCategory={setCategory}
          editIndex={editSubCatIndex}
          defaultValue={
            editSubCatIndex !== null
              ? hovedkategorinavn[editSubCatIndex] || {}
              : {}
          }
        />
      </Drawer>
      <Drawer isOpen={isProductDrawerOpen} onClose={handleproductDrawer}>
        <h4 className="text-darkBlack font-medium text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-6">
          Legg til nye gulvfliser
          <X
            onClick={handleToggleSubCategoryPopup}
            className="text-primary cursor-pointer"
          />
        </h4>
        <ProductFormDrawer
          onClose={() => setIsProductDrawerOpen(false)}
          onSubmit={(formData) => {
            const existingProducts =
              form.getValues(
                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
              ) || [];

            form.setValue(
              `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
              [...existingProducts, ...formData.produkter]
            );
          }}
        />
      </Drawer>
      <Drawer isOpen={isView} onClose={handleproductViewDrawer}>
        <h4 className="text-darkBlack font-semibold text-2xl flex items-center gap-2 justify-between p-6">
          Informasjon om {ViewSubCat?.Produktnavn}
          <X
            onClick={handleproductViewDrawer}
            className="text-primary cursor-pointer"
          />
        </h4>
        <ViewProductDetail editData={ViewSubCat} />
      </Drawer>
      <Drawer
        isOpen={isEditProductDrawerOpen}
        onClose={() => {
          setIsEditProductDrawerOpen(false);
          setEditProductIndex(null);
        }}
      >
        <h4 className="text-darkBlack font-semibold text-2xl flex items-center gap-2 justify-between p-6">
          Rediger produkt
          <X
            onClick={() => {
              setIsEditProductDrawerOpen(false);
              setEditProductIndex(null);
            }}
            className="text-primary cursor-pointer"
          />
        </h4>

        {editProductIndex !== null && (
          <ProductFormDrawer
            onClose={() => {
              setIsEditProductDrawerOpen(false);
              setEditProductIndex(null);
            }}
            editData={form.watch(
              `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter.${editProductIndex}`
            )}
            onSubmit={(updatedProduct) => {
              const existingProducts =
                form.getValues(
                  `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
                ) || [];

              const updatedProducts = [...existingProducts];
              updatedProducts[editProductIndex] = updatedProduct.produkter?.[0];

              form.setValue(
                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
                updatedProducts
              );

              setIsEditProductDrawerOpen(false);
              setEditProductIndex(null);
            }}
          />
        )}
      </Drawer>
    </>
  );
};
