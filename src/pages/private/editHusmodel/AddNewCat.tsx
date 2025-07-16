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
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { useLocation } from "react-router-dom";

const formSchema = z.object({
  Hovedkategoriname: z.string().min(1, {
    message: "Hovedkategoriname må bestå av minst 2 tegn.",
  }),
  isSelected: z.boolean().optional(),
});

const requiredCategoriesWithProducts = {
  Himlling: [
    {
      Produktnavn: "Mdf panel",
      isSelected: true,
      InfoText: "Beskriv type og farge",
    },
    {
      Produktnavn: "Takplater",
      isSelected: false,
      InfoText: "Beskriv evt avvik fra standard",
    },
    {
      Produktnavn: "Gips",
      isSelected: false,
      InfoText: "Beskriv evt avvik fra standard gips",
    },
    {
      Produktnavn: "Panel",
      isSelected: false,
      InfoText: "Beskriv type og farge",
    },
  ],
  Vegger: [
    {
      Produktnavn: "Ubehandlet sponplate",
      isSelected: true,
      InfoText: "Beskriv evt avvik fra standard",
    },
    {
      Produktnavn: "Gips",
      isSelected: false,
      InfoText: "Beskriv evt avvik fra standard gips",
    },
    {
      Produktnavn: "Mdf panelplater",
      isSelected: false,
      InfoText: "Beskriv type og farge",
    },
    {
      Produktnavn: "Panel",
      isSelected: false,
      InfoText: "Beskriv type og farge",
    },
    {
      Produktnavn: "Annet",
      isSelected: false,
      InfoText: "Beskriv type og farge",
    },
  ],
  Gulv: [
    {
      Produktnavn: "Parkett (leveres av forhandler)",
      isSelected: true,
      InfoText: "Beskriv type og farge",
    },
    {
      Produktnavn: "Laminat",
      isSelected: false,
      InfoText: "Beskriv type og farge",
    },
    {
      Produktnavn: "Annet",
      isSelected: false,
      InfoText: "Beskriv type og farge",
    },
  ],
  Talklist: [
    {
      Produktnavn: "I henhold til serie",
      isSelected: true,
    },
    {
      Produktnavn: "Annen type list",
      isSelected: false,
      Type: "HelpText",
    },
    {
      Produktnavn: "Listefritt",
      isSelected: false,
    },
  ],
  Gerikt: [
    {
      Produktnavn: "I henhold til serie",
      isSelected: true,
    },
    {
      Produktnavn: "Annen type list",
      isSelected: false,
      Type: "HelpText",
    },
    {
      Produktnavn: "Listefritt",
      isSelected: false,
    },
  ],
  Gulvlist: [
    {
      Produktnavn: "I henhold til serie",
      isSelected: true,
    },
    {
      Produktnavn: "Annen type list",
      isSelected: false,
      Type: "HelpText",
    },
  ],
};

export const AddNewCat: React.FC<{
  onClose: any;
  setCategory: any;
  editData: any;
  Category: any;
  EditTabData?: any;
}> = ({ onClose, setCategory, editData, Category, EditTabData }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const kundeId = pathSegments.length > 4 ? pathSegments[4] : null;

  useEffect(() => {
    const data = editData?.data;

    if (data) {
      const hovedKategoriValue = data.name_no?.trim()
        ? data.name_no
        : data.name?.trim() || "";

      if (hovedKategoriValue) {
        form.setValue("Hovedkategoriname", hovedKategoriValue);
      }

      if (typeof data.isSelected !== "undefined") {
        form.setValue("isSelected", data.isSelected);
      }
    }
  }, [
    form,
    editData?.data?.name_no,
    editData?.data?.name,
    editData?.data?.isSelected,
  ]);
  const [pdfId, setPdfId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPdfId(params.get("pdf_id"));
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const isDuplicate = Category.some((cat: any, idx: number) => {
      if (editData) {
        return (
          idx !== editData.index &&
          (cat.name_no.toLowerCase() || cat.name.toLowerCase()) ===
            data.Hovedkategoriname.toLowerCase()
        );
      }
      return (
        (cat.name_no.toLowerCase() || cat.name.toLowerCase()) ===
        data.Hovedkategoriname.toLowerCase()
      );
    });

    if (isDuplicate) {
      form.setError("Hovedkategoriname", {
        type: "manual",
        message: "Kategorinavnet finnes allerede.",
      });
      return;
    }

    onClose();
    if (editData) {
      setCategory((prev: any) =>
        prev.map((cat: any, idx: any) =>
          idx === editData.index
            ? {
                ...cat,
                name_no: data.Hovedkategoriname,
                name: data.Hovedkategoriname,
                isSelected: data.isSelected ?? false,
              }
            : cat
        )
      );
    } else {
      setCategory((prev: any) => [
        ...prev,
        {
          name_no: data.Hovedkategoriname,
          name: data.Hovedkategoriname,
          isSelected: data.isSelected ?? false,
          Kategorinavn: Object.entries(requiredCategoriesWithProducts).map(
            ([name, produkter]) => ({
              navn: name,
              productOptions: name === "Kommentar" ? "Text" : "Single Select",
              produkter,
              comment: "",
            })
          ),
        },
      ]);
    }

    try {
      const husmodellDocRef = doc(
        db,
        "housemodell_configure_broker",
        String(id)
      );
      const docSnap = await getDoc(husmodellDocRef);

      if (docSnap.exists()) {
        const houseData = docSnap.data();

        const kundeList = houseData?.KundeInfo || [];

        const targetKundeIndex = kundeList.findIndex(
          (k: any) => String(k.uniqueId) === String(kundeId)
        );
        if (targetKundeIndex === -1) return;

        const targetKunde = kundeList[targetKundeIndex];
        const existingPlantegninger = targetKunde?.Plantegninger || [];

        const itemToUpdate = existingPlantegninger.find(
          (item: any) => String(item?.pdf_id) === String(pdfId)
        );

        const roomsList = itemToUpdate?.rooms || [];
        const targetRoomIndex = roomsList.findIndex(
          (_: any, index: number) => index === EditTabData
        );

        if (targetRoomIndex === -1) {
          roomsList.push({
            name: data.Hovedkategoriname,
            name_no: data.Hovedkategoriname,
            isSelected: data.isSelected ?? false,
            Kategorinavn: Object.entries(requiredCategoriesWithProducts).map(
              ([name, produkter]) => ({
                navn: name,
                productOptions: name === "Kommentar" ? "Text" : "Multi Select",
                produkter,
                comment: "",
              })
            ),
          });
        } else {
          roomsList[targetRoomIndex].name = data.Hovedkategoriname;
          roomsList[targetRoomIndex].name_no = data.Hovedkategoriname;
        }

        itemToUpdate.rooms = roomsList;
        targetKunde.Plantegninger = existingPlantegninger;
        kundeList[targetKundeIndex] = targetKunde;

        await updateDoc(husmodellDocRef, {
          KundeInfo: kundeList,
        });
      } else {
        console.error("Document does not exist");
      }
    } catch (error) {
      console.error("Error updating Firestore:", error);
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full"
        >
          <div>
            <FormField
              control={form.control}
              name="Hovedkategoriname"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    className={`${
                      fieldState.error ? "text-red" : "text-black"
                    } mb-[6px] text-sm font-medium`}
                  >
                    Hovedkategoriname
                  </p>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Skriv inn Hovedkategoriname"
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
              name={`isSelected`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className="relative flex items-center gap-2 mt-3 cursor-pointer"
                      onClick={() => {
                        form.setValue("isSelected", !field.value);
                      }}
                    >
                      <input
                        className={`bg-white rounded-[8px] accent-primary border text-black
                                  ${
                                    fieldState?.error
                                      ? "border-red"
                                      : "border-gray1"
                                  } h-4 w-4`}
                        type="radio"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            form.setValue("isSelected", isChecked);
                          }
                        }}
                        checked={field.value}
                      />
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } text-sm font-medium`}
                      >
                        Er obligatorisk
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end w-full gap-5 items-center left-0 mt-8">
            <div
              onClick={() => {
                form.reset();
                onClose();
              }}
            >
              <Button
                text="Avbryt"
                className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              />
            </div>
            <Button
              text="Neste"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </>
  );
};
