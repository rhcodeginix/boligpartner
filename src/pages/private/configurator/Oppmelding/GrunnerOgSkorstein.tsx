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
//   TypeVegger: z.string().optional(),
//   TykkelseVegger: z.string().optional(),
//   SkorsteinType: z.string().optional(),
//   SkorsteinEnkelDobbel: z.string().optional(),
//   SkorsteinLeveresAv: z.string().optional(),
//   IldstedType: z.string().optional(),
//   IldstedLeveresAv: z.string().optional(),
//   // BoligPartnersdetaljnummer: z.string().optional(),
//   BoligPartnersdetaljnummer: z.string().optional(),
//   harMottattDetaljnummer: z.boolean().optional(),
// });

// export const GrunnerOgSkorstein = forwardRef(
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
//       localStorage.setItem("currVerticalIndex", String(4));
//     };
//     const SkorsteinEnkelDobbel = ["Enkel", "Dobbel"];
//     const SkorsteinLeveresAv = ["BP", "Forhandler"];
//     const harMottatt = form.watch("harMottattDetaljnummer");
//     return (
//       <>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
//             <div className="border border-[#B9C0D4] rounded-lg">
//               <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
//                 Grunnmur og pipe/skorstein
//               </div>
//               <div className="p-4 md:p-5">
//                 <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="TypeVegger"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Type (Vegger)
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Vegg type vegg" />
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
//                       name="TykkelseVegger"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Tykkelse (Vegger)
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Skriv tykkelse" />
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
//                       name="SkorsteinType"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Skorstein Type
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Vegg type skorstein" />
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
//                       name={`SkorsteinEnkelDobbel`}
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-2 ${
//                               fieldState.error ? "text-red" : "text-black"
//                             } text-sm`}
//                           >
//                             Skorstein Enkel/Dobbel
//                           </p>
//                           <FormControl>
//                             <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
//                               {SkorsteinEnkelDobbel.map((option) => (
//                                 <div
//                                   key={option}
//                                   className="relative flex items-center gap-2"
//                                 >
//                                   <input
//                                     className={`bg-white rounded-[8px] border text-black
//         ${
//           fieldState?.error ? "border-red" : "border-gray1"
//         } h-4 w-4 accent-[#444CE7]`}
//                                     type="radio"
//                                     value={option}
//                                     onChange={(e) => {
//                                       form.setValue(
//                                         `SkorsteinEnkelDobbel`,
//                                         e.target.value
//                                       );
//                                     }}
//                                     checked={field.value === option}
//                                   />
//                                   <p className={`text-black text-sm`}>
//                                     {option}
//                                   </p>
//                                 </div>
//                               ))}
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
//                       name={`SkorsteinLeveresAv`}
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-2 ${
//                               fieldState.error ? "text-red" : "text-black"
//                             } text-sm`}
//                           >
//                             Skorstein Leveres av:
//                           </p>
//                           <FormControl>
//                             <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
//                               {SkorsteinLeveresAv.map((option) => (
//                                 <div
//                                   key={option}
//                                   className="relative flex items-center gap-2"
//                                 >
//                                   <input
//                                     className={`bg-white rounded-[8px] border text-black
//         ${
//           fieldState?.error ? "border-red" : "border-gray1"
//         } h-4 w-4 accent-[#444CE7]`}
//                                     type="radio"
//                                     value={option}
//                                     onChange={(e) => {
//                                       form.setValue(
//                                         `SkorsteinLeveresAv`,
//                                         e.target.value
//                                       );
//                                     }}
//                                     checked={field.value === option}
//                                   />
//                                   <p className={`text-black text-sm`}>
//                                     {option}
//                                   </p>
//                                 </div>
//                               ))}
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
//                       name="IldstedType"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Ildsted Type
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Velg type ildsted" />
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
//                       name={`IldstedLeveresAv`}
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-2 ${
//                               fieldState.error ? "text-red" : "text-black"
//                             } text-sm`}
//                           >
//                             Ildsted leveres av:
//                           </p>
//                           <FormControl>
//                             <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
//                               {SkorsteinLeveresAv.map((option) => (
//                                 <div
//                                   key={option}
//                                   className="relative flex items-center gap-2"
//                                 >
//                                   <input
//                                     className={`bg-white rounded-[8px] border text-black
//         ${
//           fieldState?.error ? "border-red" : "border-gray1"
//         } h-4 w-4 accent-[#444CE7]`}
//                                     type="radio"
//                                     value={option}
//                                     onChange={(e) => {
//                                       form.setValue(
//                                         `IldstedLeveresAv`,
//                                         e.target.value
//                                       );
//                                     }}
//                                     checked={field.value === option}
//                                   />
//                                   <p className={`text-black text-sm`}>
//                                     {option}
//                                   </p>
//                                 </div>
//                               ))}
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
//                       name="harMottattDetaljnummer"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="harMottattDetaljnummer"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             BoligPartners detalj(er) nr. mottatt av tiltakshaver
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="BoligPartnersdetaljnummer"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv inn Skriv detaljnummer"
//                                 {...field}
//                                 disable={harMottatt}
//                                 className={`bg-white rounded-[8px] border text-black ${
//                                   fieldState?.error
//                                     ? "border-red"
//                                     : "border-gray1"
//                                 } `}
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
//                     localStorage.setItem("currVerticalIndex", String(2));
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
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { useLocation } from "react-router-dom";
import { removeUndefinedOrNull } from "./Yttervegger";

const formSchema = z.object({
  TypeVegger: z.string().optional(),
  TykkelseVegger: z.string().optional(),
  SkorsteinType: z.string().optional(),
  SkorsteinLeveresAvChimney: z.string().optional(),
  IldstedType: z.string().optional(),
  SkorsteinLeveresAvFireplace: z.string().optional(),
  PlateBoligPartnersdetaljnummerText: z.string().optional(),
  PlateBoligPartnersdetaljnummer: z.boolean().optional(),
  noRelevant: z.boolean().optional(),
  BoligPartnersdetaljnummer: z.boolean().optional(),
  BoligPartnersdetaljnummerText: z.string().optional(),
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
        localStorage.setItem("currVerticalIndex", String(4));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    };
    const harMottatt = form.watch("PlateBoligPartnersdetaljnummer");
    const noRelevant = form.watch("noRelevant");

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
    return (
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="border border-[#B9C0D4] rounded-lg">
              <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
                Betong- og murerarbeid, pkt. 2.3 i leveransebeskrivelse.
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                  <div>
                    <FormField
                      control={form.control}
                      name="PlateBoligPartnersdetaljnummer"
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
                              id="PlateBoligPartnersdetaljnummer"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Plate på mark iht BoligPartners detalj(er) nr.
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="PlateBoligPartnersdetaljnummerText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn Skriv detaljnummer"
                                {...field}
                                disable={harMottatt}
                                className={`bg-white rounded-[8px] border text-black ${
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
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Vegger grunnmur pkt 2.3
                  </div>
                  <div className="col-span-3">
                    <div>
                      <FormField
                        control={form.control}
                        name="noRelevant"
                        render={({ field }) => (
                          <FormItem>
                            <p
                              className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                                field.value ? "text-black" : "text-black"
                              }`}
                            >
                              <input
                                type="checkbox"
                                id="noRelevant"
                                checked={field.value || false}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                              />
                              Ikke relevant for dette tiltak.
                            </p>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="TypeVegger"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Type
                          </p>
                          <FormItem>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn"
                                  {...field}
                                  className={`bg-white rounded-[8px] border text-black ${
                                    fieldState?.error
                                      ? "border-red"
                                      : "border-gray1"
                                  } `}
                                  type="text"
                                  disable={
                                    noRelevant && noRelevant === true
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="TykkelseVegger"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Tykkelse
                          </p>
                          <FormControl>
                            <div className="relative">
                              <div className="relative">
                                <Input
                                  placeholder="Skriv inn"
                                  {...field}
                                  disable={
                                    noRelevant && noRelevant === true
                                      ? true
                                      : false
                                  }
                                  className={`bg-white rounded-[8px] border text-black ${
                                    fieldState?.error
                                      ? "border-red"
                                      : "border-gray1"
                                  } `}
                                  type="text"
                                />
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Skorstein pkt 2.3
                  </div>
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
                            Type
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
                                {...field}
                                disable={harMottatt}
                                className={`bg-white rounded-[8px] border text-black ${
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
                      name={`SkorsteinLeveresAvChimney`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Leveres av (chimney)
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
                                {...field}
                                disable={harMottatt}
                                className={`bg-white rounded-[8px] border text-black ${
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
                                placeholder="Skriv inn"
                                {...field}
                                disable={harMottatt}
                                className={`bg-white rounded-[8px] border text-black ${
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
                      name={`SkorsteinLeveresAvFireplace`}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`mb-2 ${
                              fieldState.error ? "text-red" : "text-black"
                            } text-sm`}
                          >
                            Leveres av (fireplace)
                          </p>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn"
                                {...field}
                                disable={harMottatt}
                                className={`bg-white rounded-[8px] border text-black ${
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
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Søylefundamenter
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="BoligPartnersdetaljnummer"
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
                              id="BoligPartnersdetaljnummer"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            BoligPartners detalj(er) nr.
                          </p>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="BoligPartnersdetaljnummerText"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Skriv inn detaljnummer"
                                {...field}
                                disable={harMottatt}
                                className={`bg-white rounded-[8px] border text-black ${
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
                    localStorage.setItem("currVerticalIndex", String(2));
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
