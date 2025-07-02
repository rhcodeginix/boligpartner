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
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PptxGenJS from "pptxgenjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Modal from "../../../../components/common/modal";
import { ExportView } from "./exportView";

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
  roomsData: any;
}> = ({ onClose, rooms, roomsData }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const [isExporting, setIsExporting] = useState(false);

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
      onClose();
      toast.success("Lagret", {
        position: "top-right",
      });

      // if (data.exportType === "PDF") {
      //   setIsExporting(true);
      //   const element = previewRef.current;
      //   if (!element) throw new Error("Preview element not found");

      //   const toDataURL = (url: string): Promise<string> =>
      //     fetch(url)
      //       .then((response) => response.blob())
      //       .then((blob) => {
      //         return new Promise<string>((resolve, reject) => {
      //           const reader = new FileReader();
      //           reader.onloadend = () => resolve(reader.result as string);
      //           reader.onerror = reject;
      //           reader.readAsDataURL(blob);
      //         });
      //       });

      //   const replaceFirebaseImagesWithBase64 = async () => {
      //     const images = element.querySelectorAll("img");
      //     await Promise.all(
      //       Array.from(images).map(async (img) => {
      //         const src = img.getAttribute("src");
      //         if (src && src.includes("firebasestorage.googleapis.com")) {
      //           try {
      //             const dataUrl = await toDataURL(src);
      //             img.setAttribute("src", dataUrl);
      //           } catch (err) {
      //             console.warn(
      //               "Could not convert Firebase image to base64",
      //               err
      //             );
      //           }
      //         }
      //       })
      //     );
      //   };

      //   await replaceFirebaseImagesWithBase64();

      //   const canvas = await html2canvas(element, {
      //     useCORS: true,
      //     allowTaint: false,
      //     backgroundColor: "#ffffff",
      //     scale: 2,
      //   });

      //   const imgData = canvas.toDataURL("image/png");

      //   const pdf = new jsPDF("p", "mm", "a4");
      //   const pdfWidth = pdf.internal.pageSize.getWidth();
      //   const pdfHeight = pdf.internal.pageSize.getHeight();

      //   const padding = 5;
      //   const usableWidth = pdfWidth - padding * 2;
      //   const usableHeight = pdfHeight - padding * 2;

      //   const imgProps = pdf.getImageProperties(imgData);
      //   const imgWidth = usableWidth;
      //   const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      //   let heightLeft = imgHeight;
      //   let position = padding;

      //   pdf.addImage(imgData, "PNG", padding, padding, imgWidth, imgHeight);
      //   heightLeft -= usableHeight;

      //   while (heightLeft > 0) {
      //     pdf.addPage();
      //     position = padding - (imgHeight - heightLeft);
      //     pdf.addImage(imgData, "PNG", padding, position, imgWidth, imgHeight);
      //     heightLeft -= usableHeight;
      //   }

      //   pdf.save(`preview-${Date.now()}.pdf`);
      // }

      // ---

      //   const element = previewRef.current;
      //   if (!element) return;

      //   // Convert DOM to image
      //   const canvas = await html2canvas(element);
      //   const imgData = canvas.toDataURL("image/png");

      //   // Create PowerPoint
      //   const pptx = new PptxGenJS();
      //   const slide = pptx.addSlide();

      //   // Add image to slide (optional: scale size to fit slide)
      //   slide.addImage({
      //     data: imgData,
      //     x: 0.5,
      //     y: 0.5,
      //     w: 8,
      //     h: 5, // adjust size as needed
      //   });

      //   // Download PPT
      //   pptx.writeFile({ fileName: `export-${Date.now()}.pptx` });
      // };

      // if (data.exportType === "PDF") {
      //   setIsExporting(true);
      //   const element = previewRef.current;
      //   if (!element) throw new Error("Preview element not found");

      //   // Force fixed width for consistent capture
      //   const originalWidth = element.style.width;
      //   element.style.width = "794px"; // ≈210mm at 96dpi

      //   const totalHeight = element.scrollHeight;
      //   const pageHeightPx = 1123; // ≈297mm at 96dpi

      //   const totalPages = Math.ceil(totalHeight / pageHeightPx);

      //   const pdf = new jsPDF("p", "mm", "a4");
      //   for (let page = 0; page < totalPages; page++) {
      //     element.scrollTop = page * pageHeightPx;

      //     // Give browser time to render scrolled content
      //     // eslint-disable-next-line no-await-in-loop
      //     await new Promise((res) => setTimeout(res, 300));

      //     const canvas = await html2canvas(element, {
      //       useCORS: true,
      //       backgroundColor: "#ffffff",
      //       scale: 2,
      //       height: pageHeightPx,
      //       y: page * pageHeightPx,
      //     });

      //     const imgData = canvas.toDataURL("image/png");

      //     if (page > 0) pdf.addPage();
      //     pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
      //   }

      //   pdf.save(`preview-${Date.now()}.pdf`);
      //   element.style.width = originalWidth; // restore original width
      // }
      if (data.exportType === "PDF") {
        setIsExporting(true);
        const element = previewRef.current;
        if (!element) throw new Error("Preview element not found");

        const originalWidth = element.style.width;
        element.style.width = "794px";

        const totalHeight = element.scrollHeight;
        const pageHeightPx = 1123;

        const totalPages = Math.ceil(totalHeight / pageHeightPx);

        const pdf = new jsPDF("p", "mm", "a4");

        const marginTop = 10;
        const marginLeft = 0;
        const marginRight = 0;
        const marginBottom = 15;

        const usableWidth = 210 - marginLeft - marginRight;
        const usableHeight = 297 - marginTop - marginBottom;

        for (let page = 0; page < totalPages; page++) {
          element.scrollTop = page * pageHeightPx;

          // eslint-disable-next-line no-await-in-loop
          await new Promise((res) => setTimeout(res, 300));

          const canvas = await html2canvas(element, {
            useCORS: true,
            backgroundColor: "#ffffff",
            scale: 2,
            height: pageHeightPx,
            y: page * pageHeightPx,
          });

          const imgData = canvas.toDataURL("image/png");

          if (page > 0) pdf.addPage();

          pdf.addImage(
            imgData,
            "PNG",
            marginLeft,
            marginTop,
            usableWidth,
            usableHeight
          );

          pdf.setFontSize(12);
          pdf.text("", 105, 10, { align: "center" });

          pdf.setFontSize(10);
          pdf.text(`Page ${page + 1} of ${totalPages}`, 105, 290, {
            align: "center",
          });
        }

        pdf.save(`preview-${Date.now()}.pdf`);
        element.style.width = originalWidth;
      }

      if (data.exportType === "PPT") {
        setIsExporting(true);
        const exportToPpt = async () => {
          const element = previewRef.current;
          if (!element) return;

          const fullCanvas = await html2canvas(element, {
            scale: 1,
            useCORS: true,
          });

          const slideWidthInches = 10;
          const slideHeightInches = 5.625;
          const paddingInches = 0.2;
          const usableWidthInches = slideWidthInches - 2 * paddingInches;
          const usableHeightInches = slideHeightInches - 2 * paddingInches;
          const DPI = 96;

          const totalHeightPx = fullCanvas.height;
          const totalWidthPx = fullCanvas.width;
          const sliceHeightPx = usableHeightInches * DPI;

          const pptx = new PptxGenJS();
          let offsetY = 0;

          while (offsetY < totalHeightPx) {
            const sliceCanvas = document.createElement("canvas");
            sliceCanvas.width = totalWidthPx;
            const currentSliceHeight = Math.min(
              sliceHeightPx,
              totalHeightPx - offsetY
            );
            sliceCanvas.height = currentSliceHeight;

            const ctx = sliceCanvas.getContext("2d");
            if (ctx) {
              ctx.drawImage(
                fullCanvas,
                0,
                offsetY,
                totalWidthPx,
                currentSliceHeight,
                0,
                0,
                totalWidthPx,
                currentSliceHeight
              );
            }

            const imgData = sliceCanvas.toDataURL("image/png");

            const imageWidthInches = totalWidthPx / DPI;
            const imageHeightInches = currentSliceHeight / DPI;

            let scaledWidth = usableWidthInches;
            let scaledHeight =
              imageHeightInches * (scaledWidth / imageWidthInches);

            if (scaledHeight > usableHeightInches) {
              scaledHeight = usableHeightInches;
              scaledWidth =
                imageWidthInches * (scaledHeight / imageHeightInches);
            }

            const slide = pptx.addSlide();
            slide.addImage({
              data: imgData,
              x: paddingInches + (usableWidthInches - scaledWidth) / 2,
              y: paddingInches + (usableHeightInches - scaledHeight) / 2,
              w: scaledWidth,
              h: scaledHeight,
            });

            offsetY += currentSliceHeight;
          }

          pptx.writeFile({ fileName: `export-${Date.now()}.pptx` });
        };
        exportToPpt();
      }

      if (data.exportType === "Excel") {
        setIsExporting(true);
        const exportToExcel = () => {
          const rows: any[] = [];

          rooms.forEach((room: any) => {
            room.rooms?.forEach((innerRoom: any) => {
              innerRoom.Kategorinavn?.forEach((kat: any) => {
                if (kat.productOptions === "Text") return;

                kat.produkter?.forEach((prod: any) => {
                  if (!prod?.isSelected) return;

                  rows.push({
                    RoomTitle: room?.title,
                    RoomName: innerRoom?.name_no || innerRoom?.name,
                    Category: kat?.navn,
                    Product: prod?.Produktnavn,
                    Price: prod?.IncludingOffer
                      ? "Standard"
                      : prod?.pris || "-",
                    DeliveredBy: prod?.delieverBy || "Boligpartner",
                  });
                });
              });
            });
          });

          const worksheet = XLSX.utils.json_to_sheet(rows);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Customisation Summary"
          );

          const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
          });
          const blob = new Blob([excelBuffer], {
            type: "application/octet-stream",
          });

          saveAs(blob, `customisation-summary-${Date.now()}.xlsx`);
        };
        exportToExcel();
      }
      setIsExporting(false);
    } catch (error) {
      console.error("error:", error);
      toast.error("Something went wrong!", {
        position: "top-right",
      });
    } finally {
      setIsExporting(false);
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

  useEffect(() => {
    const navbar = document.getElementById("navbar");
    const exportDiv = document.getElementById("export_div");

    if (navbar) {
      navbar.style.zIndex = isExporting ? "-1" : "999";
    }

    if (exportDiv) {
      exportDiv.style.zIndex = isExporting ? "-1" : "999";
    }
  }, [isExporting]);

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
            id="export_div"
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
          <ExportView
            rooms={rooms}
            kundeInfo={form.getValues()}
            roomsData={roomsData}
          />
        </div>
      </div>

      {isExporting && (
        <Modal
          onClose={() => setIsExporting(false)}
          isOpen={true}
          outSideClick={false}
        >
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="flex flex-col items-center gap-4 bg-white p-3 rounded-lg">
              <span className="text-purple text-base font-medium">
                Eksporterer...
              </span>
              <div className="w-48 h-1 overflow-hidden rounded-lg">
                <div className="w-full h-full bg-purple animate-[progress_1.5s_linear_infinite] rounded-lg" />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
