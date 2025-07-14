/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "../../../components/ui/form";
import Button from "../../../components/common/button";
import Ic_x_circle from "../../../assets/images/Ic_x_circle.svg";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AddNewSubCat } from "./AddNewSubCat";
import Img_noTask from "../../../assets/images/Img_noTask.png";
import { collection, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import Drawer from "../../../components/ui/drawer";
import { ProductFormDrawer } from "./productForm";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-hot-toast";
import { EditProductFormDrawer } from "./editProductForm";
import { db } from "../../../config/firebaseConfig";
import { Spinner } from "../../../components/Spinner";

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
  Labour: z.string().min(1, "Arbeid må bestå av minst 1 tegn."),
  LabourPris: z.string().optional(),
  produktId: z.string().optional(),
});

const categorySchema = z.object({
  navn: z.string().min(1, "Kategorinavn må bestå av minst 1 tegn."),
  id: z.string().optional(),
  produkter: z.array(productSchema).min(1, "Minst ett produkt er påkrevd."),
});
const mainCategorySchema = z.object({
  name: z.string().min(1, "Hovedkategorinavn må bestå av minst 1 tegn."),
  Kategorinavn: z.array(categorySchema).min(1, "Minst én kategori er påkrevd."),
  isSelected: z.boolean().optional(),
  id: z.string().optional(),
});

const formSchema = z.object({
  hovedkategorinavn: z.array(mainCategorySchema),
});

export const Customization: React.FC<{
  Category: any;
  activeTabData: any;
  setCategory: any;
}> = ({ Category, activeTabData, setCategory }) => {
  const [activeSubTabData, setActiveSubTabData] = useState(0);
  useEffect(() => {
    setActiveSubTabData(0);
  }, [activeTabData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hovedkategorinavn: [
        {
          name: "",
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
                  delieverBy: "",
                  Labour: "",
                  LabourPris: "",
                  produktId: "",
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const produkter = form.watch(
    `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
  );

  const { remove } = useFieldArray({
    control: form.control,
    name: `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
  });

  const removeProduct = (index: number) => {
    if (produkter.length > 1) {
      remove(index);
    }
  };
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitLoading(true);

    try {
      const hovedkategorinavn = data?.hovedkategorinavn;

      if (
        !Array.isArray(hovedkategorinavn) ||
        hovedkategorinavn.length === 0 ||
        !hovedkategorinavn[activeTabData]
      ) {
        toast.error("Ingen gyldig kategori funnet.");
        return;
      }

      const mainCategory = hovedkategorinavn[activeTabData];
      const { name, isSelected, Kategorinavn = [] } = mainCategory;

      if (!name) return;

      const inventoryId =
        form.getValues("hovedkategorinavn")?.[activeTabData]?.id || uuidv4();

      const inventoryDocRef = doc(db, "inventory", inventoryId);

      const inventorySnap = await getDoc(inventoryDocRef);

      await setDoc(
        inventoryDocRef,
        {
          id: inventoryId,
          name,
          isSelected,
          [inventorySnap.exists() ? "updatedAt" : "createdAt"]:
            new Date().toISOString(),
        },
        { merge: true }
      );
      // -----

      const validKategorinavn: any = Kategorinavn.filter(
        (cat: any) =>
          typeof cat.navn === "string" &&
          cat.navn.trim() !== "" &&
          Array.isArray(cat.produkter) &&
          cat.produkter.length > 0
      );

      const subCollectionRef = collection(inventoryDocRef, "Kategorinavn");

      for (const cat of validKategorinavn) {
        const kategoriId = cat.id || uuidv4();
        const kategoriDocRef = doc(subCollectionRef, kategoriId);

        const kategoriData = {
          id: kategoriId,
          navn: cat.navn,
          timestamp: new Date().toISOString(),
          produkter: cat.produkter.map((produkt: any) => {
            const isExisting = !!produkt.produktId;

            return {
              ...produkt,
              produktId: isExisting ? produkt.produktId : uuidv4(),
              timestamp: new Date().toISOString(),
            };
          }),
        };

        if (!cat.id) {
          await setDoc(kategoriDocRef, kategoriData);
        } else {
          await setDoc(kategoriDocRef, kategoriData, { merge: true });
        }
      }

      toast.success("Kategori oppdatert!", { position: "top-right" });
    } catch (error) {
      console.error("Firestore update failed:", error);
      toast.error("Noe gikk galt. Prøv igjen.", { position: "top-right" });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const [AddSubCategory, setAddSubCategory] = useState(false);

  useEffect(() => {
    if (Array.isArray(Category) && Category.length > 0) {
      form.setValue("hovedkategorinavn", Category);
    }
  }, [form, Category]);

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
              Labour: product.Labour || "",
              LabourPris: product.LabourPris || "",
              produktId: product.produktId || "",
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
  const [editSubCatIndex, setEditSubCatIndex] = useState<number | null>(null);

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
  const handleCloseSubCategoryDrawer = () => {
    setEditSubCatIndex(null);
    setAddSubCategory(false);
  };

  const [isEditProductDrawerOpen, setIsEditProductDrawerOpen] = useState(false);
  const [EditProductIndex, setEditProductIndex] = useState<any>(null);
  const [editProductData, setEditProductData] = useState<any>(null);

  const handleEditproductDrawer = () => {
    if (isEditProductDrawerOpen) {
      setIsEditProductDrawerOpen(false);
      setEditProductData(null);
      setEditProductIndex(null);
    } else {
      setIsEditProductDrawerOpen(true);
    }
  };

  return (
    <>
      {isSubmitLoading && <Spinner />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-darkBlack font-semibold text-lg">
                  Customisation
                </h4>
              </div>
            </div>
            <div className="border-t border-gray2"></div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-6 h-[48px] mb-8 border border-[#EFF1F5] rounded-lg bg-[#F9F9FB] p-2">
                {hovedkategorinavn?.length > 0 ? (
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
                          onClick={async (e) => {
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

                            try {
                              const inventoryId =
                                form.getValues("hovedkategorinavn")?.[
                                  activeTabData
                                ]?.id;
                              if (inventoryId) {
                                const inventoryDocRef = doc(
                                  db,
                                  "inventory",
                                  inventoryId
                                );
                                const subCollectionRef = collection(
                                  inventoryDocRef,
                                  "Kategorinavn"
                                );

                                if (cat?.id) {
                                  const categoryDocRef = doc(
                                    subCollectionRef,
                                    cat.id
                                  );
                                  await deleteDoc(categoryDocRef);
                                }
                              }
                            } catch (error) {
                              console.error(
                                "Failed to delete category from Firestore:",
                                error
                              );
                            }
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-secondary text-sm">
                    Ingen tilpasningskategori lagt til
                  </p>
                )}

                <div
                  className="text-purple font-semibold text-sm flex items-center gap-1 cursor-pointer h-full whitespace-nowrap"
                  onClick={() => setAddSubCategory(true)}
                >
                  <Plus />
                  Legg til produkt
                </div>
              </div>
              {hovedkategorinavn.length > 0 ? (
                <>
                  <div className="flex items-center gap-3 justify-between mb-5">
                    <h4 className="text-darkBlack text-base font-semibold">
                      {title} options
                    </h4>
                    <div
                      className="text-purple border-2 border-purple rounded-[40px] py-2 px-4 font-semibold text-base flex items-center gap-1 cursor-pointer h-full"
                      onClick={() => {
                        setIsProductDrawerOpen(true);
                      }}
                    >
                      <Plus />
                      Legge til {title}
                    </div>
                  </div>
                  <div className="">
                    <div className="grid grid-cols-2 gap-6">
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
                              <div className="w-[20%]">
                                <img
                                  src={`${product?.Hovedbilde[0]}`}
                                  alt="floor"
                                  className="w-full h-full border border-[#EFF1F5] rounded-[4px]"
                                />
                              </div>
                              <div className="w-[80%]">
                                <div className="flex items-center gap-1 justify-between mb-2">
                                  <h4 className="text-darkBlack text-sm truncate">
                                    {product?.Produktnavn}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Pencil
                                      className="text-purple w-5 h-5 cursor-pointer"
                                      onClick={() => {
                                        setEditProductIndex(index);
                                        setEditProductData(product);
                                        setIsEditProductDrawerOpen(true);
                                      }}
                                    />
                                    <Trash2
                                      className="text-red w-5 h-5 cursor-pointer"
                                      onClick={async () => {
                                        const productId = product?.produktId;

                                        removeProduct(index);

                                        try {
                                          if (productId) {
                                            const inventoryId =
                                              form.getValues(
                                                "hovedkategorinavn"
                                              )?.[activeTabData]?.id;
                                            const categoryData = form.getValues(
                                              `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}`
                                            );
                                            const categoryId = categoryData?.id;

                                            if (
                                              !inventoryId ||
                                              !categoryId ||
                                              !productId
                                            ) {
                                              console.warn(
                                                "Missing inventoryId, categoryId, or productId"
                                              );
                                              return;
                                            }

                                            const inventoryDocRef = doc(
                                              db,
                                              "inventory",
                                              inventoryId
                                            );
                                            const categoryDocRef = doc(
                                              inventoryDocRef,
                                              "Kategorinavn",
                                              categoryId
                                            );

                                            const categorySnap = await getDoc(
                                              categoryDocRef
                                            );
                                            if (!categorySnap.exists()) {
                                              console.error(
                                                "Category doc not found"
                                              );
                                              return;
                                            }

                                            const categoryDocData =
                                              categorySnap.data();
                                            const existingProdukter =
                                              categoryDocData.produkter || [];

                                            const updatedProdukter =
                                              existingProdukter.filter(
                                                (prod: any) =>
                                                  prod.produktId !== productId
                                              );

                                            await setDoc(
                                              categoryDocRef,
                                              {
                                                produkter: updatedProdukter,
                                                updatedAt:
                                                  new Date().toISOString(),
                                              },
                                              { merge: true }
                                            );
                                          }
                                        } catch (error) {
                                          console.error(
                                            "Failed to delete product from Firestore:",
                                            error
                                          );
                                        }
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="mb-3 flex items-center gap-2">
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

                    <div
                      className="flex justify-end gap-5 items-center bg-white border-t border-gray2 p-4 left-0 mt-6 pb-0"
                      style={{
                        zIndex: 99999,
                      }}
                    >
                      <Button
                        text="Avbryt"
                        className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2 flex items-center gap-2"
                      />
                      <Button
                        text="Neste"
                        className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-10 py-2"
                        type="submit"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-full flex items-center justify-center px-6 py-[54px]">
                    <div className="flex flex-col items-center justify-center">
                      <img src={Img_noTask} alt="no_data" />
                      <h3 className="text-black font-semibold text-center mb-1.5">
                        No Customisation Category added
                      </h3>
                      <p className="text-sm text-center text-secondary">
                        Når du har lagt til tilpasningskategorien, kan du legge{" "}
                        <br /> til forskjellige produktalternativer.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>
      </Form>

      <Drawer isOpen={AddSubCategory} onClose={handleCloseSubCategoryDrawer}>
        <h4 className="text-darkBlack font-medium text-lg md:text-xl lg:text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-4 md:p-6">
          {editSubCatIndex !== null
            ? "Rediger underkategori"
            : "Legg til ny underkategori"}
          <X
            onClick={() => setAddSubCategory(false)}
            className="text-primary cursor-pointer"
          />
        </h4>
        {AddSubCategory && (
          <AddNewSubCat
            onClose={() => {
              setEditSubCatIndex(null);
              setAddSubCategory(false);
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
        )}
      </Drawer>
      <Drawer isOpen={isProductDrawerOpen} onClose={handleproductDrawer}>
        <h4 className="text-darkBlack font-medium text-lg md:text-xl lg:text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-4 md:p-6">
          Legg til nye gulvfliser
          <X
            onClick={() => setIsProductDrawerOpen(false)}
            className="text-primary cursor-pointer"
          />
        </h4>
        {isProductDrawerOpen && (
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
        )}
      </Drawer>
      <Drawer
        isOpen={isEditProductDrawerOpen}
        onClose={handleEditproductDrawer}
      >
        <h4 className="text-darkBlack font-medium text-lg md:text-xl lg:text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-4 md:p-6">
          Legg til nye gulvfliser
          <X
            onClick={() => setIsEditProductDrawerOpen(false)}
            className="text-primary cursor-pointer"
          />
        </h4>
        {isEditProductDrawerOpen && (
          <EditProductFormDrawer
            onClose={() => setIsEditProductDrawerOpen(false)}
            defaultValues={editProductData}
            onSubmit={(formData) => {
              const existingProducts = form.getValues(
                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`
              );

              const updatedProducts = existingProducts.map((product, idx) =>
                idx === EditProductIndex ? formData : product
              );

              form.setValue(
                `hovedkategorinavn.${activeTabData}.Kategorinavn.${activeSubTabData}.produkter`,
                updatedProducts
              );

              handleEditproductDrawer();
            }}
          />
        )}
      </Drawer>
    </>
  );
};
