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
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Input } from "../../../../components/ui/input";
import { forwardRef, useEffect, useImperativeHandle, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";

const formSchema = z.object({
  IkkeRelevant: z.boolean().optional(),
  HåndrekkeVangerHvit: z.boolean().optional(),
  TrinnLakkertEikHelStav: z.boolean().optional(),
  TrinnLakkertEikHelStavText: z.string().optional(),
  Stålspiler: z.boolean().optional(),
  AltBad: z.string().optional(),
  Alternativ: z.string().optional(),
  Farge: z.string().optional(),
  Montering: z.array(z.string()).optional(),
  Måltaking: z.array(z.string()).optional(),
  Kommentar: z.string().optional(),
  StandardHvitgrunnet: z.boolean().optional(),
  HimlingCount: z.boolean().optional(),
  VeggCount: z.boolean().optional(),
  Furu: z.boolean().optional(),
});

export const TrappogLuker = forwardRef(
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
          TrappogLuker: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(12));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    };

    const TrinnLakkertEikHelStav = form.watch("TrinnLakkertEikHelStav");

    const Montering = useMemo(() => ["Trappeleverandør", "Lokal"], []);
    const Måltaking = useMemo(() => ["Trappeleverandør", "Lokal"], []);
    const array = useMemo(() => ["Abc", "Xyz"], []);

    useEffect(() => {
      if (roomsData && roomsData?.TrappogLuker) {
        Object.entries(roomsData?.TrappogLuker).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData, form]);
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
                Trapp og Luker
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                  <div>
                    <FormField
                      control={form.control}
                      name="IkkeRelevant"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="IkkeRelevant"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ikke relevant
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="HåndrekkeVangerHvit"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="HåndrekkeVangerHvit"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Håndrekke/vanger hvit
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="TrinnLakkertEikHelStav"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="TrinnLakkertEikHelStav"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Trinn lakkert eik / hel stav
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="TrinnLakkertEikHelStavText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                }}
                                value={field.value}
                                disabled={TrinnLakkertEikHelStav}
                              >
                                <SelectTrigger
                                  className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                                >
                                  <SelectValue placeholder="Velg" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectGroup>
                                    {array?.map((item, index) => {
                                      return (
                                        <SelectItem key={index} value={item}>
                                          {item}
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
                  <div>
                    <FormField
                      control={form.control}
                      name="Stålspiler"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Stålspiler"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Stålspiler
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="AltBad"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Alt. (Bad)
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv her"
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
                      name="Alternativ"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Alternativ
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv type takstein"
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
                      name="Farge"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Farge
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
                                  <SelectValue placeholder="Velg" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  <SelectGroup>
                                    {array?.map((item, index) => {
                                      return (
                                        <SelectItem key={index} value={item}>
                                          {item}
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`Montering`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Montering
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {Montering.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2"
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="checkbox"
                                    value={option}
                                    checked={field.value?.includes(option)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        form.setValue("Montering", [
                                          ...currentValues,
                                          option,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "Montering",
                                          currentValues.filter(
                                            (val) => val !== option
                                          )
                                        );
                                      }
                                    }}
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
                  <div>
                    <FormField
                      control={form.control}
                      name={`Måltaking`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Måltaking
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {Måltaking.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2"
                                >
                                  <input
                                    className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="checkbox"
                                    value={option}
                                    checked={field.value?.includes(option)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        form.setValue("Måltaking", [
                                          ...currentValues,
                                          option,
                                        ]);
                                      } else {
                                        form.setValue(
                                          "Måltaking",
                                          currentValues.filter(
                                            (val) => val !== option
                                          )
                                        );
                                      }
                                    }}
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
                  <div>
                    <FormField
                      control={form.control}
                      name="Kommentar"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Kommentar
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Kommentar"
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
                  <div className="col-span-3">
                    <h3 className="text-darkBlack font-semibold text-base mb-3">
                      Isolerte inspeksjonsluker:
                    </h3>
                    <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                      <div>
                        <FormField
                          control={form.control}
                          name="StandardHvitgrunnet"
                          render={({ field }) => (
                            <FormItem>
                              <p
                                className={`text-sm flex gap-2 items-baseline ${
                                  field.value ? "text-black" : "text-black"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id="StandardHvitgrunnet"
                                  checked={field.value || false}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                                Standard hvitgrunnet 55x55 (Tek 07)
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="HimlingCount"
                          render={({ field }) => (
                            <FormItem>
                              <p
                                className={`text-sm flex gap-2 items-baseline ${
                                  field.value ? "text-black" : "text-black"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id="HimlingCount"
                                  checked={field.value || false}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                                Himling [count]
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="VeggCount"
                          render={({ field }) => (
                            <FormItem>
                              <p
                                className={`text-sm flex gap-2 items-baseline ${
                                  field.value ? "text-black" : "text-black"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id="VeggCount"
                                  checked={field.value || false}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                                Vegg [count]
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="Furu"
                          render={({ field }) => (
                            <FormItem>
                              <p
                                className={`text-sm flex gap-2 items-baseline ${
                                  field.value ? "text-black" : "text-black"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  id="Furu"
                                  checked={field.value || false}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                                Furu (ikke Tek 07)
                              </p>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
                <div
                  onClick={() => {
                    form.reset();
                    handlePrevious();
                    localStorage.setItem("currVerticalIndex", String(10));
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
