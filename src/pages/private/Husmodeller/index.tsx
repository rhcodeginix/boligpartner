import { useEffect, useState } from "react";
import Button from "../../../components/common/button";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { HusmodellerTable } from "./HusmodellerTable";
import Modal from "../../../components/common/modal";
import { Check, House, Store, Warehouse, X } from "lucide-react";
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
import { fetchAdminDataByEmail } from "../../../lib/utils";

const formSchema = z
  .object({
    TypeProsjekt: z.string({ required_error: "Type prosjekt er påkrevd." }),
    options: z.string().optional(),
    VelgSerie: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.TypeProsjekt === "Bolig" || data.TypeProsjekt === "Hytte") {
      if (!data.options) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Obligatorisk",
          path: ["options"],
        });
      }
      if (!data.VelgSerie) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Obligatorisk",
          path: ["VelgSerie"],
        });
      }
    }
  });

export const Husmodeller = () => {
  const navigate = useNavigate();
  const [houseModels, setHouseModels] = useState([]);

  const fetchHusmodellData = async () => {
    try {
      let q = query(
        collection(db, "housemodell_configure_broker"),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouseModels(data);
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    }
  };

  useEffect(() => {
    fetchHusmodellData();
  }, []);

  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const queryParams = [`TypeProsjekt=${data.TypeProsjekt}`];
    if (data.VelgSerie) {
      queryParams.push(`VelgSerie=${data.VelgSerie}`);
    }

    navigate(
      `/se-series/${data.options}/add-husmodell?${queryParams.join("&")}`
    );
  };

  const [currentTab, setCurrentTab] = useState<"models" | "type">("type");

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      if (form.formState.errors.options) {
        setCurrentTab("models");
      } else if (form.formState.errors.TypeProsjekt) {
        setCurrentTab("type");
      }
      return;
    }

    form.handleSubmit(onSubmit)();
  };

  const [Supplier, setSupplier] = useState<any>(null);
  const [Email, setEmail] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchAdminDataByEmail();

      if (data) {
        setEmail(data?.email);
        if (data?.supplier) {
          setSupplier(data?.supplier);
        }
      }
    };

    getData();
  }, []);

  return (
    <>
      <div className="px-4 md:px-6 py-5 md:py-8 desktop:p-8 flex flex-col md:flex-row gap-3 md:items-center justify-between bg-lightGreen">
        <div>
          <h1 className="text-darkBlack font-medium text-2xl md:text-[28px] desktop:text-[32px] mb-2">
            Romskjema
          </h1>
          <p className="text-secondary text-sm md:text-base desktop:text-lg">
            Her kan du konfigurere opp en ny kundebolig i tillegg til at finner
            du oversikt over alle kontorets lagrede konfigurasjoner
          </p>
        </div>
        <div className="flex items-center gap-4">
          {Supplier && Supplier === "9f523136-72ca-4bde-88e5-de175bc2fc71" && (
            <div
              className="text-primary text-sm md:text-base lg:text-lg font-semibold flex items-center gap-4 cursor-pointer"
              onClick={() => {
                const url = `https://admin.mintomt.no/bank-leads?email=${encodeURIComponent(
                  Email
                )}`;
                window.location.href = url;
              }}
            >
              <Button
                text="Gå til Tips til bank"
                className="border-2 border-primary text-primary text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              />
            </div>
          )}
          <Button
            text="Ny konfigurasjon"
            className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      <div className="px-4 md:px-6 py-5 md:py-8 desktop:p-8">
        <HusmodellerTable />
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} isOpen={true}>
          <div className="relative bg-white rounded-[12px] p-4 sm:p-5 w-full sm:w-[90vw] max-w-[500px]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3"
            >
              <X className="text-primary" />
            </button>
            <h3 className="text-darkBlack font-semibold text-xl mb-5">
              Velg én
            </h3>
            <div className="flex mb-5 border-b border-gray2">
              <button
                onClick={() => setCurrentTab("type")}
                className={`px-4 py-2 ${
                  currentTab === "type"
                    ? "border-b-2 border-primary font-semibold"
                    : "text-gray-500"
                }`}
              >
                Type prosjekt
              </button>
              {form.watch("TypeProsjekt") !== "Prosjekt" && (
                <button
                  onClick={() => setCurrentTab("models")}
                  className={`px-4 py-2 ${
                    currentTab === "models"
                      ? "border-b-2 border-primary font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  Serie
                </button>
              )}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative w-full"
              >
                {currentTab === "type" && (
                  <FormField
                    control={form.control}
                    name="TypeProsjekt"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm`}
                            >
                              Type prosjekt*:
                            </p>
                            <div className="flex flex-wrap gap-2 lg:gap-4 items-center">
                              {[
                                {
                                  label: "Bolig",
                                  value: "Bolig",
                                  icon: (
                                    <House
                                      className={`${
                                        field.value === "Bolig"
                                          ? "text-primary"
                                          : "text-[#5D6B98]"
                                      }`}
                                    />
                                  ),
                                },
                                {
                                  label: "Hytte",
                                  value: "Hytte",
                                  icon: (
                                    <Store
                                      className={`${
                                        field.value === "Hytte"
                                          ? "text-primary"
                                          : "text-[#5D6B98]"
                                      }`}
                                    />
                                  ),
                                },
                                {
                                  label: "Prosjekt",
                                  value: "Prosjekt",
                                  icon: (
                                    <Warehouse
                                      className={`${
                                        field.value === "Prosjekt"
                                          ? "text-primary"
                                          : "text-[#5D6B98]"
                                      }`}
                                    />
                                  ),
                                },
                              ].map((item, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    form.setValue("TypeProsjekt", item.value);
                                    form.clearErrors("TypeProsjekt");
                                    form.resetField("VelgSerie");
                                    form.resetField("options");
                                    if (
                                      form.watch("TypeProsjekt") === "Prosjekt"
                                    ) {
                                      const finalData: any = houseModels.find(
                                        (item: any) => item?.tag === "Prosjekt"
                                      );

                                      form.setValue("options", finalData?.id);
                                    }
                                  }}
                                  className={`flex items-center gap-2 border-2 rounded-lg py-2 px-3 cursor-pointer ${
                                    field.value === item.value
                                      ? "border-primary"
                                      : "border-[#EFF1F5]"
                                  }`}
                                >
                                  {item.icon}
                                  <div className="text-darkBlack text-sm text-center">
                                    {item.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("TypeProsjekt") !== "Prosjekt" && (
                  <>
                    {currentTab === "models" && (
                      <FormField
                        control={form.control}
                        name={`options`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <div className="grid grid-cols-2 gap-3">
                                {houseModels
                                  .filter(
                                    (item: any) =>
                                      item?.tag?.toLowerCase() ===
                                      (form.watch("TypeProsjekt") &&
                                        form
                                          .watch("TypeProsjekt")
                                          .toLowerCase())
                                  )
                                  .map((option: any, index: number) => {
                                    const loaded = imageLoaded[index];
                                    return (
                                      <div
                                        key={index}
                                        className="relative cursor-pointer rounded-lg"
                                        onClick={() => {
                                          form.setValue("options", option.id);
                                          form.setValue(
                                            "VelgSerie",
                                            option.husmodell_name
                                          );
                                          form.clearErrors("options");
                                          form.clearErrors("VelgSerie");
                                        }}
                                      >
                                        <div className="w-full h-[160px] mb-2.5 relative">
                                          {!loaded && (
                                            <div className="w-full h-full rounded-lg custom-shimmer"></div>
                                          )}
                                          {option?.photo && (
                                            <img
                                              src={option?.photo}
                                              alt="house"
                                              className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                                                loaded
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              }`}
                                              onLoad={() =>
                                                handleImageLoad(index)
                                              }
                                              onError={() =>
                                                handleImageLoad(index)
                                              }
                                              loading="lazy"
                                            />
                                          )}
                                        </div>
                                        <p className="mt-2">
                                          {option?.husmodell_name}
                                        </p>
                                        {field.value === option.id && (
                                          <div className="bg-white absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center">
                                            <Check className="w-5 h-5 text-primary" />
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                <div className="flex mt-4 justify-end w-full gap-5 items-center left-0">
                  <div
                    onClick={() => {
                      form.reset();
                      setIsModalOpen(false);
                    }}
                  >
                    <Button
                      text="Avbryt"
                      className="border border-lightGreen bg-lightGreen text-primary text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
                    />
                  </div>
                  <Button
                    text="Neste"
                    onClick={handleNext}
                    className="border border-primary bg-primary text-white ..."
                  />
                </div>
              </form>
            </Form>
          </div>
        </Modal>
      )}
    </>
  );
};
