import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import { Input } from "../../../../components/ui/input";
import { z } from "zod";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { removeUndefinedOrNull } from "./Yttervegger";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { db } from "../../../../config/firebaseConfig";

const formSchema = z.object({
  TypeGrunnFundament: z.string().optional(),
  SkorsteinType: z.string().optional(),
  SkorsteinEnkelDobbel: z.string().optional(),
  SkorsteinLeveresAv: z.string().optional(),
  IldstedType: z.string().optional(),
  IldstedLeveresAv: z.string().optional(),
  TypeGrunnmur: z.string().optional(),
  detaljnummer: z.string().optional(),
});

export const GrunnerOgSkorstein = forwardRef(
  (
    {
      handleNext,
      handlePrevious,
      roomsData,
      setRoomsData,
    }: {
      handleNext: () => void;
      handlePrevious: () => void;
      roomsData: any;
      setRoomsData: any;
    },
    ref
  ) => {
    const location = useLocation();
    const pathSegments = location.pathname.split("/");
    const id = pathSegments.length > 2 ? pathSegments[2] : null;

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
    });
    useImperativeHandle(ref, () => ({
      validateForm: async () => {
        const valid = await form.trigger();
        return valid;
      },
    }));

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
      try {
        const husmodellDocRef = doc(db, "room_configurator", String(id));

        const formatDate = (date: Date) => {
          return date
            .toLocaleString("sv-SE", { timeZone: "UTC" })
            .replace(",", "");
        };
        const husmodellSnap = await getDoc(husmodellDocRef);

        if (!husmodellSnap.exists()) {
          throw new Error("Document does not exist!");
        }
        const existingData = husmodellSnap.data();

        const filteredData = removeUndefinedOrNull(data);
        const mergedData = {
          ...existingData,
          GrunnerOgSkorstein: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(3));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    };
    const SkorsteinEnkelDobbel = ["Enkel", "Dobbel"];
    const SkorsteinLeveresAv = ["BP", "Forhandler"];
    const TypeGrunnFundament = [
      "Plate på mark (detaljnr 216-100)",
      "Sokkel/kjeller",
    ];
    const TypeGrunnmur = ["Plasstøpt betong (detaljnr 231-310)", "Termomur"];

    useEffect(() => {
      if (roomsData && roomsData?.GrunnerOgSkorstein) {
        Object.entries(roomsData?.GrunnerOgSkorstein).forEach(
          ([key, value]) => {
            if (value !== undefined && value !== null) {
              form.setValue(key as any, value);
            }
          }
        );
      }
    }, [roomsData]);

    const TypeGrunnFundamentValue = form.watch("TypeGrunnFundament");
    const TypeGrunnmurValue = form.watch("TypeGrunnmur");
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4] uppercase">
                Grunnmur og pipe
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5 items-center">
                  <div className="col-span-3 flex gap-4 md:gap-5">
                    <div>
                      <FormField
                        control={form.control}
                        name={`TypeGrunnFundament`}
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`mb-2 ${
                                fieldState.error ? "text-red" : "text-black"
                              } text-sm`}
                            >
                              Type grunn og fundament
                            </p>
                            <FormControl>
                              <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                                {TypeGrunnFundament.map((option) => (
                                  <div
                                    key={option}
                                    className="relative flex items-center gap-2"
                                  >
                                    <input
                                      className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                      type="radio"
                                      value={option}
                                      onChange={(e) => {
                                        form.setValue(
                                          `TypeGrunnFundament`,
                                          e.target.value
                                        );
                                      }}
                                      checked={field.value === option}
                                    />
                                    <p className={`text-black text-sm`}>
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
                    {TypeGrunnFundamentValue === "Sokkel/kjeller" && (
                      <div>
                        <FormField
                          control={form.control}
                          name={`TypeGrunnmur`}
                          render={({ field, fieldState }) => (
                            <FormItem>
                              <p
                                className={`mb-2 ${
                                  fieldState.error ? "text-red" : "text-black"
                                } text-sm`}
                              >
                                Type grunnmur
                              </p>
                              <FormControl>
                                <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                                  {TypeGrunnmur.map((option) => (
                                    <div
                                      key={option}
                                      className="relative flex items-center gap-2"
                                    >
                                      <input
                                        className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                        type="radio"
                                        value={option}
                                        onChange={(e) => {
                                          form.setValue(
                                            `TypeGrunnmur`,
                                            e.target.value
                                          );
                                        }}
                                        checked={field.value === option}
                                      />
                                      <p className={`text-black text-sm`}>
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
                    )}
                  </div>
                  {TypeGrunnmurValue === "Termomur" && (
                    <div>
                      <FormField
                        control={form.control}
                        name="detaljnummer"
                        render={({ field, fieldState }) => (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm`}
                            >
                              Detaljnummer for Termomur
                            </p>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv detaljnummer"
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
                  )}
                  <div className="border-t border-[#B9C0D4] col-span-3 my-1"></div>
                  <h4 className="uppercase text-darkBlack font-semibold col-span-3">
                    PIPE OG ILDSTED
                  </h4>
                  <div>
                    <FormField
                      control={form.control}
                      name="SkorsteinType"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Skorstein type
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv type"
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
                      name={`SkorsteinEnkelDobbel`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Skorstein Enkel/Dobbel
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SkorsteinEnkelDobbel.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2"
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="radio"
                                    value={option}
                                    onChange={(e) => {
                                      form.setValue(
                                        `SkorsteinEnkelDobbel`,
                                        e.target.value
                                      );
                                    }}
                                    checked={field.value === option}
                                  />
                                  <p className={`text-black text-sm`}>
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`SkorsteinLeveresAv`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Skorstein Leveres av:
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SkorsteinLeveresAv.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2"
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="radio"
                                    value={option}
                                    onChange={(e) => {
                                      form.setValue(
                                        `SkorsteinLeveresAv`,
                                        e.target.value
                                      );
                                    }}
                                    checked={field.value === option}
                                  />
                                  <p className={`text-black text-sm`}>
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
                  <div>
                    <FormField
                      control={form.control}
                      name="IldstedType"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Ildsted Type
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv type"
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
                      name={`IldstedLeveresAv`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Ildsted leveres av:
                          </p>
                          <FormControl>
                            <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                              {SkorsteinLeveresAv.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2"
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="radio"
                                    value={option}
                                    onChange={(e) => {
                                      form.setValue(
                                        `IldstedLeveresAv`,
                                        e.target.value
                                      );
                                    }}
                                    checked={field.value === option}
                                  />
                                  <p className={`text-black text-sm`}>
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
                </div>
              </div>
              <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
                <div
                  onClick={() => {
                    form.reset();
                    handlePrevious();
                    localStorage.setItem("currVerticalIndex", String(1));
                  }}
                >
                  <Button
                    text="Tilbake"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <Button
                  text="Neste"
                  className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  type="submit"
                />
              </div>
            </div>
          </form>
        </Form>
      </>
    );
  }
);
