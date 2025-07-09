/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Download, Loader2, Pencil, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import Ic_search from "../../../assets/images/Ic_search.svg";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { formatDateTime } from "../../../lib/utils";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../../../components/common/modal";
import Button from "../../../components/common/button";
import { ExportView } from "../configurator/Oppsummering/exportView";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const HusmodellerTable = () => {
  const [page, setPage] = useState(1);
  const [houseModels, setHouseModels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"Bolig" | "Hytte" | "Prosjekt">(
    "Bolig"
  );

  const handleDelete = async (entryId: string) => {
    try {
      const docRef = doc(db, "housemodell_configure_broker", String(id));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentKundeInfo = data?.KundeInfo || [];

        const updatedKundeInfo = currentKundeInfo.filter(
          (entry: any) => entry.uniqueId !== entryId
        );

        await updateDoc(docRef, {
          KundeInfo: updatedKundeInfo,
          updatedAt: new Date().toISOString(),
        });
        setId(null);
        toast.success("Slettet", { position: "top-right" });
        fetchHusmodellData();
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Error deleting entry from KundeInfo:", error);
      toast.error("Noe gikk galt ved sletting.");
    }
  };

  const handleConfirmPopup = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const fetchHusmodellData = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHusmodellData();
  }, []);
  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const filteredData = useMemo(() => {
    return houseModels.flatMap((item: any) => {
      if (
        item?.KundeInfo &&
        item?.KundeInfo.length > 0 &&
        Array.isArray(item.KundeInfo)
      ) {
        return item.KundeInfo.map((kunde: any) => ({
          ...kunde,
          photo: item.photo || null,
          husmodell_name: item?.husmodell_name || null,
          parentId: item.id,
          createDataBy: item?.createDataBy || null,
          tag: item?.tag || null,
          placeOrder: item?.placeOrder || false,
          configurator:
            kunde?.Plantegninger &&
            kunde?.Plantegninger.length > 0 &&
            kunde?.Plantegninger.some((room: any) => !room.configurator)
              ? false
              : true,
        })).filter((kunde: any) => {
          const matchesSearch =
            !searchTerm ||
            kunde.Kundenavn?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter =
            !selectedFilter ||
            selectedFilter === "" ||
            kunde.husmodell_name === selectedFilter;
          const matchesTypeProsjekt =
            !activeTab || kunde.tag.toLowerCase() === activeTab.toLowerCase();

          return matchesSearch && matchesFilter && matchesTypeProsjekt;
        });
      }
      return [];
    });
  }, [houseModels, searchTerm, selectedFilter, activeTab]);

  const [isExporting, setIsExporting] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    const baseColumns: ColumnDef<any>[] = [
      {
        accessorKey: "Kundenavn",
        header: "Kundenavn",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Kundenavn}
          </p>
        ),
      },
      {
        accessorKey: "Anleggsadresse",
        header: "Anleggsadresse",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Anleggsadresse}
          </p>
        ),
      },
      {
        accessorKey: "Kundenummer",
        header: "BP prosjektnummer",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Kundenummer}
          </p>
        ),
      },
      {
        accessorKey: "Boligkonsulent",
        header: "Boligkonsulent",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.createDataBy?.name}
          </p>
        ),
      },
      {
        accessorKey: "TypeProsjekt",
        header: "TypeProsjekt",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.TypeProsjekt ?? "-"}
          </p>
        ),
      },
      {
        accessorKey: "Status",
        header: "Status",
        cell: ({ row }) => (
          <>
            {row.original?.placeOrder ? (
              <p className="text-sm font-medium text-green w-max bg-lightGreen py-1 px-2 rounded-full">
                Overført til oppmelding
              </p>
            ) : row.original?.configurator ? (
              <p className="text-sm font-medium text-primary w-max bg-lightPurple py-1 px-2 rounded-full">
                Ferdig konfiguert
              </p>
            ) : (
              <p className="text-sm font-medium text-black w-max bg-gray2 py-1 px-2 rounded-full">
                Under behandling
              </p>
            )}
          </>
        ),
      },
      {
        accessorKey: "sisteoppdatertav",
        header: "Siste oppdatert av",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {formatDateTime(row.original?.updatedAt)}
          </p>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-3">
            {row.original?.Plantegninger &&
              row.original?.Plantegninger?.length > 0 &&
              row.original?.Plantegninger?.filter(
                (p: any) => p?.rooms && p.rooms.length > 0
              ) && (
                <Download
                  className="h-5 w-5 text-primary cursor-pointer"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    try {
                      setSelectedData(row.original);
                      setIsExporting(true);

                      await new Promise((resolve) => setTimeout(resolve, 500));

                      const element = previewRef.current;
                      if (!element)
                        throw new Error("Preview element not found");

                      const canvas = await html2canvas(element, {
                        scale: 2,
                        useCORS: true,
                      });

                      const imgData = canvas.toDataURL("image/png");
                      const pdf = new jsPDF("p", "mm", "a4");
                      const pdfWidth = pdf.internal.pageSize.getWidth();
                      const pdfHeight = pdf.internal.pageSize.getHeight();
                      const imgWidth = pdfWidth;
                      const imgHeight =
                        (canvas.height * pdfWidth) / canvas.width;

                      let position = 0;
                      pdf.addImage(
                        imgData,
                        "PNG",
                        0,
                        position,
                        imgWidth,
                        imgHeight
                      );

                      if (imgHeight > pdfHeight) {
                        while (position + imgHeight > pdfHeight) {
                          position -= pdfHeight;
                          pdf.addPage();
                          pdf.addImage(
                            imgData,
                            "PNG",
                            0,
                            position,
                            imgWidth,
                            imgHeight
                          );
                        }
                      }

                      pdf.save(
                        `lead-${
                          row.original?.Kundenavn || "kunde"
                        }-${Date.now()}.pdf`
                      );
                    } catch (err) {
                      console.error("Failed to generate PDF:", err);
                      toast.error("Kunne ikke laste ned PDF.");
                    } finally {
                      setIsExporting(false);
                      setSelectedData(null);
                    }
                  }}
                />
              )}
            <Pencil
              className="h-5 w-5 text-primary cursor-pointer"
              onClick={() =>
                navigate(
                  `/se-series/${row.original.parentId}/edit-husmodell/${row.original?.uniqueId}`
                )
              }
            />
            <Trash
              className="h-5 w-5 text-red cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                confirmDelete(row.original?.uniqueId);
                setId(row.original.parentId);
              }}
            />
          </div>
        ),
      },
    ];

    if (activeTab !== "Prosjekt") {
      baseColumns.splice(3, 0, {
        accessorKey: "Serienavn",
        header: "Serienavn",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.husmodell_name}
          </p>
        ),
      });
    }

    return baseColumns;
  }, [navigate, activeTab]);

  const pageSize = 10;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
    },
    pageCount: Math.ceil(filteredData.length / pageSize),
    manualPagination: true,
    onPaginationChange: (updater: any) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: page - 1,
          pageSize,
        });
        setPage(newState.pageIndex + 1);
      }
    },
  });

  return (
    <>
      <div className="mb-5 flex justify-center">
        <div className="flex gap-1.5">
          {["Bolig", "Hytte", "Prosjekt"].filter(Boolean).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab as "Bolig" | "Hytte" | "Prosjekt");
                setSelectedFilter("");
              }}
              className={`px-2 md:px-4 py-2 text-sm font-medium ${
                activeTab === tab
                  ? "border-b-2 border-purple text-purple"
                  : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-2 flex gap-2 flex-col lg:flex-row lg:items-center justify-between bg-lightPurple rounded-[12px] py-3 px-4">
        <div className="flex items-center border border-gray1 shadow-shadow1 bg-[#fff] gap-2 rounded-lg py-[10px] px-[14px]">
          <img src={Ic_search} alt="search" />
          <input
            type="text"
            placeholder="Søk etter lead"
            className="focus-within:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="shadow-shadow1 border border-gray1 rounded-[8px] flex flex-col sm:flex-row overflow-hidden sm:w-max">
          {activeTab !== "Prosjekt" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-b sm:border-b-0 sm:border-r border-gray1 cursor-pointer ${
                selectedFilter === "" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("")}
            >
              Alle
            </div>
          )}
          {activeTab === "Bolig" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "Nostalgi" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("Nostalgi")}
            >
              Nostalgi
            </div>
          )}
          {activeTab === "Hytte" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "Karakter" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("Karakter")}
            >
              Karakter
            </div>
          )}
          {activeTab === "Bolig" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-b border-t sm:border-t-0 sm:border-b-0 sm:border-r sm:border-l border-gray1 cursor-pointer ${
                selectedFilter === "Herskapelig" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("Herskapelig")}
            >
              Herskapelig
            </div>
          )}
          {activeTab === "Hytte" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-b border-t sm:border-t-0 sm:border-b-0 sm:border-r sm:border-l border-gray1 cursor-pointer ${
                selectedFilter === "Tur" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("Tur")}
            >
              Tur
            </div>
          )}
          {activeTab !== "Prosjekt" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer border-b sm:border-b-0 sm:border-r border-gray1 ${
                selectedFilter === "Moderne" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("Moderne")}
            >
              Moderne
            </div>
          )}
          {activeTab === "Bolig" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "Funkis" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("Funkis")}
            >
              Funkis
            </div>
          )}
          {activeTab === "Hytte" && (
            <div
              className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
                selectedFilter === "V-serie" && "bg-white"
              }`}
              onClick={() => setSelectedFilter("V-serie")}
            >
              V-serie
            </div>
          )}
        </div>
      </div>
      <div className="rounded-lg border border-gray2 shadow-shadow2 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header: any) => (
                  <TableHead
                    key={header.id}
                    className="h-8 text-sm whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows?.length &&
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/se-series/${row.original.parentId}/edit-husmodell/${row.original?.uniqueId}`
                    )
                  }
                >
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className="px-6 py-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between items-center py-4 px-6 border-t border-gray2">
          <button
            className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray1 text-black font-semibold text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Forrige
          </button>
          <span className="text-black text-sm">
            Side <span className="font-semibold">{page}</span> av{" "}
            <span className="font-semibold">{table.getPageCount()}</span>
          </span>
          <button
            className="px-[14px] py-2 rounded-lg disabled:opacity-50 shadow-shadow1 border border-gray1 text-black font-semibold text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Neste
          </button>
        </div>
      </div>
      {showConfirm && (
        <Modal onClose={handleConfirmPopup} isOpen={true}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-lg font-bold">
                Er du sikker på at du vil slette?
              </p>
              <div className="flex justify-center mt-5 w-full gap-5 items-center">
                <div onClick={() => setShowConfirm(false)}>
                  <Button
                    text="Avbryt"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <div onClick={() => handleDelete(selectedId)}>
                  <Button
                    text="Bekreft"
                    className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

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
            rooms={selectedData?.Plantegninger}
            kundeInfo={selectedData}
            roomsData={selectedData}
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
