import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import { Input } from "../../../../components/ui/input";
import { parsePhoneNumber } from "react-phone-number-input";
import { fetchRoomData, phoneNumberValidations } from "../../../../lib/utils";
import { InputMobile } from "../../../../components/ui/inputMobile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { useLocation } from "react-router-dom";
import { removeUndefinedOrNull } from "../Oppmelding/Yttervegger";
import { toast } from "react-hot-toast";
import { useEffect, useRef } from "react";
import { Preview } from "./preview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const formSchema = z.object({
  Kundenavn: z.string({
    required_error: "Kundenavn must må spesifiseres.",
  }),
  mobile: z.string().refine(
    (value) => {
      const parsedNumber = parsePhoneNumber(value);
      const countryCode = parsedNumber?.countryCallingCode
        ? `+${parsedNumber.countryCallingCode}`
        : "";
      const phoneNumber = parsedNumber?.nationalNumber || "";
      if (countryCode !== "+47") {
        return false;
      }
      const validator = phoneNumberValidations[countryCode];
      return validator ? validator(phoneNumber) : false;
    },
    {
      message:
        "Vennligst skriv inn et gyldig telefonnummer for det valgte landet.",
    }
  ),
  Serie: z.string({
    required_error: "Serie must må spesifiseres.",
  }),
  Kundenummer: z.number({ required_error: "Kundenummer er påkrevd." }),
  Husmodell: z.string({
    required_error: "Husmodell må spesifiseres.",
  }),
  exportType: z.string({ required_error: "Required" }),
});

export const AddFinalSubmission: React.FC<{
  onClose: any;
  rooms: any;
}> = ({ onClose, rooms }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

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
        FinalSubmission: filteredData,
        id: id,
        updatedAt: formatDate(new Date()),
      };

      await updateDoc(husmodellDocRef, mergedData);

      if (data.exportType === "PDF") {
        const element = previewRef.current;
        if (!element) throw new Error("Preview element not found");

        const toDataURL = (url: string): Promise<string> =>
          fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              });
            });

        const replaceFirebaseImagesWithBase64 = async () => {
          const images = element.querySelectorAll("img");
          await Promise.all(
            Array.from(images).map(async (img) => {
              const src = img.getAttribute("src");
              if (src && src.includes("firebasestorage.googleapis.com")) {
                try {
                  const dataUrl = await toDataURL(src);
                  img.setAttribute("src", dataUrl);
                } catch (err) {
                  console.warn(
                    "Could not convert Firebase image to base64",
                    err
                  );
                }
              }
            })
          );
        };

        await replaceFirebaseImagesWithBase64();

        const canvas = await html2canvas(element, {
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          scale: 2,
        });

        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const padding = 5;
        const usableWidth = pdfWidth - padding * 2;
        const usableHeight = pdfHeight - padding * 2;

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = usableWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = padding;

        pdf.addImage(imgData, "PNG", padding, padding, imgWidth, imgHeight);
        heightLeft -= usableHeight;

        while (heightLeft > 0) {
          pdf.addPage();
          position = padding - (imgHeight - heightLeft);
          pdf.addImage(imgData, "PNG", padding, position, imgWidth, imgHeight);
          heightLeft -= usableHeight;
        }

        pdf.save(`preview-${Date.now()}.pdf`);
      }

      // if (data.exportType === "PPT") {
      //   const element = previewRef.current;
      //   if (!element) return;

      //   const htmlContent = element.innerHTML;
      //   const blob = new Blob([htmlContent], {
      //     type: "application/vnd.ms-powerpoint",
      //   });
      //   const url = URL.createObjectURL(blob);

      //   const link = document.createElement("a");
      //   link.href = url;
      //   link.download = `export-${Date.now()}.ppt`;
      //   link.click();
      // }

      toast.success("Lagret", {
        position: "top-right",
      });
      onClose();
    } catch (error) {
      console.error("error:", error);
      toast.error("Something went wrong!", {
        position: "top-right",
      });
    }
  };

  const exportType = ["PDF", "PPT", "Excel"];
  const array = ["BoligPartner Herskapelig", "Abc", "Xyz"];

  useEffect(() => {
    if (!id) {
      return;
    }
    const getData = async () => {
      const data = await fetchRoomData(id);

      if (data && data?.FinalSubmission) {
        Object.entries(data?.FinalSubmission).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            form.setValue(key as any, value);
          }
        });
      }
    };

    getData();
  }, [id]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full"
        >
          <div className="p-6 grid grid-cols-2 gap-4">
            <div>
              <FormField
                control={form.control}
                name="Kundenavn"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : "text-black"
                      } mb-[6px] text-sm font-medium`}
                    >
                      Kundenavn
                    </p>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Skriv inn Kundenavn"
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
                name={`mobile`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : ""
                      } mb-[6px] text-sm`}
                    >
                      Mobile:
                    </p>
                    <FormControl>
                      <div className="relative flex gap-1.5 items-center">
                        <InputMobile
                          placeholder="Skriv inn Telefon"
                          {...field}
                          className={`bg-white rounded-[8px] border text-black
                              ${
                                fieldState?.error
                                  ? "border-red"
                                  : "border-gray1"
                              } `}
                          type="tel"
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
                name="Serie"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : "text-black"
                      } mb-[6px] text-sm`}
                    >
                      Serie:
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
                name="Kundenummer"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : "text-black"
                      } mb-[6px] text-sm`}
                    >
                      Kundenummer*
                    </p>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Skriv inn Kundenummer"
                          {...field}
                          className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                          type="number"
                          onChange={(e: any) =>
                            field.onChange(Number(e.target.value) || "")
                          }
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
                name="Husmodell"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`${
                        fieldState.error ? "text-red" : "text-black"
                      } mb-[6px] text-sm font-medium`}
                    >
                      Husmodell:
                    </p>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Skriv inn Husmodell"
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
                name={`exportType`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`mb-2 ${
                        fieldState.error ? "text-red" : "text-black"
                      } text-sm`}
                    >
                      Velg type export av tiltak:
                    </p>
                    <FormControl>
                      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                        {exportType.map((option) => (
                          <div
                            key={option}
                            className="relative flex items-center gap-2 cursor-pointer"
                            onClick={() => {
                              form.setValue("exportType", option);
                            }}
                          >
                            <input
                              className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                              type="radio"
                              value={option}
                              onChange={(e) => {
                                form.setValue(`exportType`, e.target.value);
                              }}
                              checked={field.value === option}
                            />
                            <p className={`text-black text-sm`}>{option}</p>
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
          <div
            className="flex fixed bottom-0 justify-end w-full gap-5 items-center left-0 px-8 py-4"
            style={{
              boxShadow:
                "0px -3px 4px -2px #1018280F, 0px -4px 8px -2px #1018281A",
            }}
          >
            <div onClick={() => form.reset()}>
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

      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={previewRef}>
          <Preview rooms={rooms} />
        </div>
      </div>
    </>
  );
};
