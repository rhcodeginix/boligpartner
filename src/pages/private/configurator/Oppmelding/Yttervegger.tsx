// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "../../../../components/ui/form";
// import Button from "../../../../components/common/button";
// import { Input } from "../../../../components/ui/input";
// import { z } from "zod";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../../../components/ui/select";
// import { forwardRef, useImperativeHandle } from "react";

// const formSchema = z.object({
//   StandardLeveranse: z.boolean().optional(),
//   PanelMaskinbeisetGrunnet: z.boolean().optional(),
//   ResterendeKledningMaskinbeiset: z.boolean().optional(),
//   Fargekode: z.string().optional(),
//   mellomstrøkMaskinbeisetFabrikk: z.boolean().optional(),
//   Ultimalt: z.boolean().optional(),
//   UltimaltText: z.string().optional(),
//   mellomstrøk: z.boolean().optional(),
//   mellomstrøkText: z.string().optional(),
//   YtterveggGarasjeUisolertBod: z.boolean().optional(),
//   AsfaltVindtettBodGarasjeUtlekting: z.boolean().optional(),
//   AsfaltVindtettBodGarasjeUtlektingText: z.string().optional(),
//   KommentarTekstboks: z.string().optional(),
// });

// export const Yttervegger = forwardRef(
//   (
//     {
//       handleNext,
//       handlePrevious,
//     }: { handleNext: () => void; handlePrevious: () => void },
//     ref
//   ) => {
//     const form = useForm<z.infer<typeof formSchema>>({
//       resolver: zodResolver(formSchema),
//     });
//     useImperativeHandle(ref, () => ({
//       validateForm: async () => {
//         const valid = await form.trigger();
//         return valid;
//       },
//     }));

//     const onSubmit = async (data: z.infer<typeof formSchema>) => {
//       console.log(data);
//       handleNext();
//       localStorage.setItem("currVerticalIndex", String(6));
//     };
//     const Ultimalt = form.watch("Ultimalt");
//     const AsfaltVindtettBodGarasjeUtlekting = form.watch(
//       "AsfaltVindtettBodGarasjeUtlekting"
//     );
//     const mellomstrøk = form.watch("mellomstrøk");

//     return (
//       <>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
//             <div className="border border-[#B9C0D4] rounded-lg">
//               <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
//                 Yttervegger
//               </div>
//               <div className="p-4 md:p-5">
//                 <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="StandardLeveranse"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="StandardLeveranse"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Standard leveranse 198+48mm
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="PanelMaskinbeisetGrunnet"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="PanelMaskinbeisetGrunnet"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Panel maskinbeiset grunnet (farge hvit)
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="ResterendeKledningMaskinbeiset"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="ResterendeKledningMaskinbeiset"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Resterende kledning maskinbeiset
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="Fargekode"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Fargekode
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv fargekode"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="mellomstrøkMaskinbeisetFabrikk"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="mellomstrøkMaskinbeisetFabrikk"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             1 mellomstrøk maskinbeiset fra fabrikk
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="Ultimalt"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="Ultimalt"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Ultimalt (sopp/råte + grunning)
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="UltimaltText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={Ultimalt}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Velg fargekode" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-white">
//                                   <SelectGroup>
//                                     <SelectItem value="Abc">Abc</SelectItem>
//                                     <SelectItem value="Xyz">Xyz</SelectItem>
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="YtterveggGarasjeUisolertBod"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="YtterveggGarasjeUisolertBod"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Yttervegg i garasje og uisolert bod
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="mellomstrøk"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="mellomstrøk"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             1 mellomstrøk
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="mellomstrøkText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={mellomstrøk}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Velg" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-white">
//                                   <SelectGroup>
//                                     <SelectItem value="Abc">Abc</SelectItem>
//                                     <SelectItem value="Xyz">Xyz</SelectItem>
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="AsfaltVindtettBodGarasjeUtlekting"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="AsfaltVindtettBodGarasjeUtlekting"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Asfalt vindtett bod/garasje inkl. utlekting
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="AsfaltVindtettBodGarasjeUtlektingText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={AsfaltVindtettBodGarasjeUtlekting}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Velg" />
//                                 </SelectTrigger>
//                                 <SelectContent className="bg-white">
//                                   <SelectGroup>
//                                     <SelectItem value="Abc">Abc</SelectItem>
//                                     <SelectItem value="Xyz">Xyz</SelectItem>
//                                   </SelectGroup>
//                                 </SelectContent>
//                               </Select>
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="KommentarTekstboks"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Kommentar (tekstboks)
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv inn kommentar"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="text"
//                               />
//                             </div>
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
//                 <div
//                   onClick={() => {
//                     form.reset();
//                     handlePrevious();
//                     localStorage.setItem("currVerticalIndex", String(4));
//                   }}
//                 >
//                   <Button
//                     text="Tilbake"
//                     className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
//                   />
//                 </div>
//                 <Button
//                   text="Neste"
//                   className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
//                   type="submit"
//                 />
//               </div>
//             </div>
//           </form>
//         </Form>
//       </>
//     );
//   }
// );

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
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";

const formSchema = z.object({
  Standardlevering: z.object({
    StandardLeveranse: z.array(z.string()).optional(),
  }),
  MaskinmaltPanel: z.object({
    StandardGrunnet: z.array(z.string()).optional(),
    Fargekode: z.string().optional(),
    mellomstrøkMaskinbeisetFabrikk: z.boolean().optional(),
  }),
  ResterendeKledningMaskinbeiset: z.boolean().optional(),
  Ultimalt: z.boolean().optional(),
  mellomstrøk: z.boolean().optional(),
  YtterveggGarasjeUisolertBod: z.boolean().optional(),
  AsfaltVindtettBodGarasjeUtlekting: z.boolean().optional(),
  Diverse: z.string().optional(),
});

export function removeUndefinedOrNull(obj: any): any {
  if (Array.isArray(obj)) {
    return obj
      .map(removeUndefinedOrNull)
      .filter((item) => item !== undefined && item !== null);
  } else if (typeof obj === "object" && obj !== null) {
    const cleanedObj: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const cleanedValue = removeUndefinedOrNull(value);
      if (
        cleanedValue !== undefined &&
        cleanedValue !== null &&
        !(
          typeof cleanedValue === "object" &&
          Object.keys(cleanedValue).length === 0
        )
      ) {
        cleanedObj[key] = cleanedValue;
      }
    }
    return cleanedObj;
  } else {
    return obj;
  }
}

export const Yttervegger = forwardRef(
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
          Yttervegger: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(6));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    };
    const StandardLeveranse = [
      "Boliger: 198 + 48 mm bindingsverk.",
      "Hytte: 148 + 48 mm bindingsverk.",
    ];
    const StandardGrunnet = [
      "norwegian wood",
      "vindskier, gesims, hjørnekasser osv.",
    ];
    useEffect(() => {
      if (roomsData && roomsData?.Yttervegger) {
        Object.entries(roomsData?.Yttervegger).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    }, [roomsData, StandardLeveranse, StandardGrunnet]);
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
                Yttervegger i tre, pkt. 4 i leveransebeskrivelse
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Standardlevering
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`Standardlevering.StandardLeveranse`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Standard leveranse iht leveransebeskrivelse
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {StandardLeveranse.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    const currentValues = field.value || [];
                                    const isChecked =
                                      currentValues.includes(option);

                                    const newValues = isChecked
                                      ? currentValues.filter(
                                          (val) => val !== option
                                        )
                                      : [...currentValues, option];

                                    form.setValue(
                                      "Standardlevering.StandardLeveranse",
                                      newValues
                                    );
                                  }}
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
                                        form.setValue(
                                          "Standardlevering.StandardLeveranse",
                                          [...currentValues, option]
                                        );
                                      } else {
                                        form.setValue(
                                          "Standardlevering.StandardLeveranse",
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
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Maskinmalt panel
                  </div>
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name="MaskinmaltPanel.StandardGrunnet"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Standard grunnet utvendig panel maskinbeiset med 1
                            strøk grunning (hovedkledningen)…
                          </p>
                          <FormControl>
                            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                              {StandardGrunnet.map((option) => (
                                <div
                                  key={option}
                                  className="relative flex items-center gap-2 cursor-pointer"
                                  onClick={() => {
                                    const currentValues = field.value || [];
                                    const isChecked =
                                      currentValues.includes(option);

                                    const newValues = isChecked
                                      ? currentValues.filter(
                                          (val) => val !== option
                                        )
                                      : [...currentValues, option];

                                    form.setValue(
                                      "MaskinmaltPanel.StandardGrunnet",
                                      newValues
                                    );
                                  }}
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
                                        form.setValue(
                                          "MaskinmaltPanel.StandardGrunnet",
                                          [...currentValues, option]
                                        );
                                      } else {
                                        form.setValue(
                                          "MaskinmaltPanel.StandardGrunnet",
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
                          <p className="text-xs text-darkBlack mt-2 font-medium">
                            Italicized note:“Impregnert virke leveres ikke
                            grunnet eller med mellomstrøk.”
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="ResterendeKledningMaskinbeiset"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="ResterendeKledningMaskinbeiset"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Resterende kledning maskinbeiset
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="MaskinmaltPanel.Fargekode"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Fargekode
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv fargekode"
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
                      name="MaskinmaltPanel.mellomstrøkMaskinbeisetFabrikk"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="MaskinmaltPanel.mellomstrøkMaskinbeisetFabrikk"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            1 mellomstrøk (maskinbeiset fra fabrikk)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Ultimalt
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Ultimalt"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="Ultimalt"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ultimalt (sopp/råtebeh. + grunning + mellomstrøk)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Ultimalt Proff 10
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="YtterveggGarasjeUisolertBod"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="YtterveggGarasjeUisolertBod"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Yttervegg i garasje og uisolert bod. Kun
                            maskinbeiset med grunning.
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="mellomstrøk"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="mellomstrøk"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            1 mellomstrøk (maskinbeiset fra fabrikk)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="AsfaltVindtettBodGarasjeUtlekting"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline cursor-pointer ${
                              field.value ? "text-black" : "text-black"
                            }`}
                            onClick={() => field.onChange(!field.value)}
                          >
                            <input
                              type="checkbox"
                              id="AsfaltVindtettBodGarasjeUtlekting"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Asfalt vindtett frittstående bod/garasje inkl.
                            utlekting
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Diverse
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Diverse"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Diverse
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Diverse"
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
                </div>
              </div>
              <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
                <div
                  onClick={() => {
                    form.reset();
                    handlePrevious();
                    localStorage.setItem("currVerticalIndex", String(4));
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
