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
//   BjelkelagForsterkesFølgende: z.string().optional(),
//   DetaljnummerPåstøp: z.number().optional(),
//   IkkeRelevantTiltak: z.boolean().optional(),
//   StandardUtførelse: z.boolean().optional(),
//   RomskjemaOverflateskjema: z.boolean().optional(),
//   LydgulvDetaljNr: z.boolean().optional(),
//   Thermogulv: z.boolean().optional(),
//   ThermogulvText: z.string().optional(),
//   ThermogulvEkstra: z.boolean().optional(),
//   ThermogulvEkstraText: z.string().optional(),
//   LoftSkalInnredes: z.boolean().optional(),
//   GulvplaterEkstra: z.boolean().optional(),
//   AltGulv: z.string().optional(),
//   HimlingStandard: z.boolean().optional(),
//   RomskjemaOverflateskjemaHimling: z.boolean().optional(),
//   HimlingDatert: z.string().optional(),
//   LydhimlingDetalj: z.boolean().optional(),
// });

// export const GulvBjelkelagHimling = forwardRef(
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
//       localStorage.setItem("currVerticalIndex", String(5));
//     };
//     const Thermogulv = form.watch("Thermogulv");
//     const ThermogulvEkstra = form.watch("ThermogulvEkstra");

//     return (
//       <>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
//             <div className="border border-[#B9C0D4] rounded-lg">
//               <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
//                 Gulv, bjelkelag og himling
//               </div>
//               <div className="p-4 md:p-5">
//                 <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="BjelkelagForsterkesFølgende"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Bjelkelag forsterkes for påstøp i følgende rom
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv her"
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
//                       name="DetaljnummerPåstøp"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Detaljnummer (påstøp)
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv detaljnummer"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="number"
//                                 onChange={(e: any) =>
//                                   field.onChange(Number(e.target.value) || "")
//                                 }
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
//                       name="IkkeRelevantTiltak"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="IkkeRelevantTiltak"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Ikke relevant for dette tiltak
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="StandardUtførelse"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="StandardUtførelse"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Standard utførelse
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="RomskjemaOverflateskjema"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="RomskjemaOverflateskjema"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Se romskjema/overflateskjema
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="LydgulvDetaljNr"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="LydgulvDetaljNr"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Lydgulv iht. detalj nr. 1431
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="Thermogulv"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="Thermogulv"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Thermogulv «Standard» 22x620x1820mm
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="ThermogulvText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={Thermogulv}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Velg tykkelse" />
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
//                       name="ThermogulvEkstra"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`mb-[6px] text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="ThermogulvEkstra"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Thermogulv «Ekstra» 25 mm
//                           </p>
//                         </FormItem>
//                       )}
//                     />

//                     <FormField
//                       control={form.control}
//                       name="ThermogulvEkstraText"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <FormControl>
//                             <div className="relative">
//                               <Select
//                                 onValueChange={(value) => {
//                                   field.onChange(value);
//                                 }}
//                                 value={field.value}
//                                 disabled={ThermogulvEkstra}
//                               >
//                                 <SelectTrigger
//                                   className={`bg-white rounded-[8px] border text-black
//                               ${
//                                 fieldState?.error
//                                   ? "border-red"
//                                   : "border-gray1"
//                               } `}
//                                 >
//                                   <SelectValue placeholder="Velg tykkelse" />
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
//                       name="LoftSkalInnredes"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="LoftSkalInnredes"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Loft skal innredes
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="GulvplaterEkstra"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="GulvplaterEkstra"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Gulvplater «Ekstra» 22 mm
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="AltGulv"
//                       render={({ field, fieldState }) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : "text-black"
//                             } mb-[6px] text-sm`}
//                           >
//                             Alt (gulv)
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Skriv her"
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
//                       name="HimlingStandard"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="HimlingStandard"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Himling standard (ubehandlet gips)
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name="RomskjemaOverflateskjemaHimling"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="RomskjemaOverflateskjemaHimling"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Se romskjema/overflateskjema (himling)
//                           </p>
//                         </FormItem>
//                       )}
//                     />
//                   </div>
//                   <div>
//                     <FormField
//                       control={form.control}
//                       name={`HimlingDatert`}
//                       render={({ field, fieldState }: any) => (
//                         <FormItem>
//                           <p
//                             className={`${
//                               fieldState.error ? "text-red" : ""
//                             } mb-[6px] text-sm`}
//                           >
//                             Himling datert
//                           </p>
//                           <FormControl>
//                             <div className="relative">
//                               <Input
//                                 placeholder="Velg dato"
//                                 {...field}
//                                 className={`bg-white rounded-[8px] border text-black
//                                           ${
//                                             fieldState?.error
//                                               ? "border-red"
//                                               : "border-gray1"
//                                           } `}
//                                 type="date"
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
//                       name="LydhimlingDetalj"
//                       render={({ field }) => (
//                         <FormItem>
//                           <p
//                             className={`text-sm flex gap-2 items-baseline ${
//                               field.value ? "text-black" : "text-black"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               id="LydhimlingDetalj"
//                               checked={field.value || false}
//                               onChange={(e) => field.onChange(e.target.checked)}
//                             />
//                             Lydhimling iht. detalj 1431
//                           </p>
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
//                     localStorage.setItem("currVerticalIndex", String(3));
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
import { TextArea } from "../../../../components/ui/textarea";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { removeUndefinedOrNull } from "./Yttervegger";

const formSchema = z.object({
  BjelkelagForsterkesFølgende: z.string().optional(),
  IkkeRelevantTiltak: z.boolean().optional(),
  RomskjemaOverflateskjema: z.boolean().optional(),
  LydgulvDetaljNr: z.boolean().optional(),
  Thermogulv: z.boolean().optional(),
  ThermogulvEkstra: z.boolean().optional(),
  GulvplaterEkstra: z.boolean().optional(),
  IkkeRelevantTiltakLoft: z.boolean().optional(),
  Tekstboks: z.string().optional(),
  Alt: z.string().optional(),
});

export const GulvBjelkelagHimling = forwardRef(
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
          GulvBjelkelagHimling: filteredData,
          id: id,
          updatedAt: formatDate(new Date()),
        };
        setRoomsData(mergedData);

        await updateDoc(husmodellDocRef, mergedData);
        toast.success("Lagret", {
          position: "top-right",
        });
        handleNext();
        localStorage.setItem("currVerticalIndex", String(5));
      } catch (error) {
        console.error("error:", error);
        toast.error("Something went wrong!", {
          position: "top-right",
        });
      }
    };
    useEffect(() => {
      if (roomsData && roomsData?.GulvBjelkelagHimling) {
        Object.entries(roomsData?.GulvBjelkelagHimling).forEach(
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
                Bjelkelag, gulv, himling, pkt. 3 i leveransebeskrivelse
              </div>
              <div className="p-4 md:p-5">
                <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                  <div>
                    <FormField
                      control={form.control}
                      name="BjelkelagForsterkesFølgende"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Bjelkelag forsterkes for påstøp i følgende rom
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
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Bjelkelag over kjeller/underetg., pkt.3.1
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="IkkeRelevantTiltak"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="IkkeRelevantTiltak"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ikke relevant for dette tiltak
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="RomskjemaOverflateskjema"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="RomskjemaOverflateskjema"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Se romskjema/overflateskjema
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="LydgulvDetaljNr"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="LydgulvDetaljNr"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Lydgulv (kt. detail) nr. 251-110 fig.B
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Thermogulv"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="Thermogulv"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Thermogulv oStandard: 22 x 620 x 1820 mm
                            [Pristtillegg]
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="ThermogulvEkstra"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`mb-[6px] text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="ThermogulvEkstra"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Thermogulv ekstrem: 25 mm [Pristtillegg]
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="my-1 border-t border-[#DCDFEA] col-span-3"></div>
                  <div className="col-span-3 text-darkBlack font-medium text-base">
                    Loft skal innredes, pkt. 3.3
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="IkkeRelevantTiltakLoft"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="IkkeRelevantTiltakLoft"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Ikke relevant for dette tiltak
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="GulvplaterEkstra"
                      render={({ field }) => (
                        <FormItem>
                          <p
                            className={`text-sm flex gap-2 items-baseline ${
                              field.value ? "text-black" : "text-black"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="GulvplaterEkstra"
                              checked={field.value || false}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            Gulvplater oEkstra: 22 mm (Standard)
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={form.control}
                      name="Alt"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <p
                            className={`${
                              fieldState.error ? "text-red" : "text-black"
                            } mb-[6px] text-sm`}
                          >
                            Alt.
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
                  <div className="col-span-3">
                    <FormField
                      control={form.control}
                      name={`Tekstboks`}
                      render={({ field, fieldState }) => {
                        const initialValue = form.getValues(`Tekstboks`) || "";
                        return (
                          <FormItem>
                            <p
                              className={`${
                                fieldState.error ? "text-red" : "text-black"
                              } mb-[6px] text-sm font-medium`}
                            >
                              Tekstboks
                            </p>
                            <FormControl>
                              <div className="relative">
                                <TextArea
                                  placeholder="Skriv inn"
                                  {...field}
                                  className={`h-[130px] bg-white rounded-[8px] border text-black
                                  ${
                                    fieldState?.error
                                      ? "border-red"
                                      : "border-gray1"
                                  } `}
                                  value={initialValue}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
                <div
                  onClick={() => {
                    form.reset();
                    handlePrevious();
                    localStorage.setItem("currVerticalIndex", String(3));
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
