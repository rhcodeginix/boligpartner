/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../../../components/ui/form";
import Button from "../../../components/common/button";
import Ic_x_circle from "../../../assets/images/Ic_x_circle.svg";
import { ArrowLeft, Pencil, Plus, X } from "lucide-react";
import { AddNewSubCat } from "./AddNewSubCat";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import Drawer from "../../../components/ui/drawer";
import { ProductFormDrawer } from "./productform";
import { toast } from "react-hot-toast";
import { db } from "../../../config/firebaseConfig";
import { fetchHusmodellData } from "../../../lib/utils";

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

const categorySchema = z.object({
  navn: z.string().min(1, "Kategorinavn må bestå av minst 1 tegn."),
  produkter: z.array(productSchema).min(1, "Minst ett produkt er påkrevd."),
});
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

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id: any = pathSegments.length > 2 ? pathSegments[2] : null;
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hovedkategorinavn: [
        {
          name: "",
          // Kategorinavn: [
          //   {
          //     navn: "",
          //     produkter: [
          //       {
          //         Produktnavn: "",
          //         Hovedbilde: [],
          //         pris: "",
          //         IncludingOffer: false,
          //         Produktbeskrivelse: "",
          //       },
          //     ],
          //   },
          // ],
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
    const rooms = {
      rooms: data.hovedkategorinavn,
    };

    try {
      const houseData: any = await fetchHusmodellData(id);
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

      const husmodellDocRef = doc(db, "housemodell_configure_broker", id);
      const formatDate = (date: Date) => {
        return date
          .toLocaleString("sv-SE", { timeZone: "UTC" })
          .replace(",", "");
      };

      await updateDoc(husmodellDocRef, {
        Plantegninger: updatedPlantegninger, // ✅ send full array with only one item changed
        updatedAt: formatDate(new Date()),
      });

      toast.success("Updated successfully", { position: "top-right" });
      navigate(`/Husmodell`);
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

  const prevProductsRef = useRef<any[]>([]);

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

      return hasNavn || hasSubTabNavn;
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

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="p-4">
              <div
                className="flex items-center gap-2.5 mb-2.5"
                onClick={() => {
                  setActiveTab(2);
                }}
              >
                <ArrowLeft className="text-purple" />
                <span className="text-purple text-sm font-medium">
                  Back to Floor 1 plan
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-darkBlack font-semibold text-xl">
                  Add Customisation Option for {labelName}
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
              {hovedkategorinavn.length > 0 && (
                <>
                  <div className="flex items-center gap-3 justify-between mb-5">
                    <h4 className="text-darkBlack text-base font-semibold">
                      {title}
                    </h4>
                    <div
                      className="text-purple border-2 border-purple rounded-[40px] py-2 px-4 font-semibold text-base flex items-center gap-1 cursor-pointer h-full"
                      onClick={() => {
                        setIsProductDrawerOpen(true);
                      }}
                    >
                      <Plus />
                      Add {title}
                    </div>
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
                  <div className="grid grid-cols-2">
                    {produkter?.map((product, index) => {
                      return (
                        <div
                          className="cursor-move border-[#EFF1F5] border rounded-lg"
                          key={index}
                          draggable
                          onDragStart={() => setDraggingProductIndex(index)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverProductIndex(index);
                          }}
                          onDrop={() => handleDrop()}
                        >
                          <div className="flex gap-4 p-3">
                            <div className="w-[100px]">
                              <img
                                src={`${product?.Hovedbilde[0]}`}
                                alt="floor"
                                className="w-[100px] h-[76px] border border-[#EFF1F5] rounded-[4px]"
                              />
                            </div>
                            <div className="w-full">
                              <h4 className="text-darkBlack text-sm mb-1">
                                {product?.Produktnavn}
                              </h4>
                              <div className="mb-2 flex items-center gap-2">
                                <p className="text-secondary text-xs">
                                  Deliver by:
                                </p>
                                <span className="text-darkBlack">
                                  {product?.delieverBy}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-darkBlack">
                                  {product?.IncludingOffer === false
                                    ? product?.pris
                                    : "Standard"}
                                </span>
                                <span className="text-purple font-medium text-sm cursor-pointer">
                                  View Details
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                setActiveTab(2);
              }}
            />
            <Button
              text="Lagre"
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
              ? hovedkategorinavn[editSubCatIndex]?.navn || ""
              : ""
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
    </>
  );
};
