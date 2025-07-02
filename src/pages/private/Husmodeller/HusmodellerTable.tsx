/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { Loader2, Pencil, Trash } from "lucide-react";
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
import { useEffect, useMemo, useState } from "react";
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
          husmodell_name: item.husmodell_name || null,
          parentId: item.id,
        })).filter((kunde: any) => {
          const matchesSearch =
            !searchTerm ||
            kunde.Kundenavn?.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter =
            !selectedFilter ||
            selectedFilter === "" ||
            kunde.husmodell_name === selectedFilter;

          return matchesSearch && matchesFilter;
        });
      }
      return [];
    });
  }, [houseModels, searchTerm, selectedFilter]);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
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
        accessorKey: "Mobilnummer",
        header: "Mobilnummer",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.mobileNummer}
          </p>
        ),
      },
      {
        accessorKey: "EPost",
        header: "EPost",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.EPost}
          </p>
        ),
      },
      {
        accessorKey: "Kundenummer",
        header: "Kundenummer",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.Kundenummer}
          </p>
        ),
      },
      {
        accessorKey: "Serienavn",
        header: "Serienavn",
        cell: ({ row }) => (
          <p className="text-sm font-medium text-black w-max">
            {row.original?.husmodell_name}
          </p>
        ),
      },
      {
        accessorKey: "sisteoppdatertav",
        header: "Siste oppdatert av",
        cell: ({ row }) => (
          <div className="flex items-start gap-3">
            <p className="text-sm font-medium text-black w-max">
              {formatDateTime(row.original?.updatedAt)}
            </p>
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <>
            <div className="flex items-center justify-center gap-3">
              <Pencil
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() =>
                  navigate(
                    `/se-series/${row.original.parentId}/edit-husmodell/${row.original?.uniqueId}`
                  )
                }
              />

              <Trash
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() => {
                  confirmDelete(row.original?.uniqueId);
                  setId(row.original.parentId);
                }}
              />
            </div>
          </>
        ),
      },
    ],
    [navigate]
  );

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
      <div className="mb-2 flex items-center justify-between bg-lightPurple rounded-[12px] py-3 px-4">
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
        <div className="shadow-shadow1 border border-gray1 rounded-[8px] flex flex-col sm:flex-row overflow-hidden md:w-max">
          <div
            className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-r border-gray1 cursor-pointer ${
              selectedFilter === "" && "bg-white"
            }`}
            onClick={() => setSelectedFilter("")}
          >
            Alle
          </div>{" "}
          <div
            className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
              selectedFilter === "Nostalgi" && "bg-white"
            }`}
            onClick={() => setSelectedFilter("Nostalgi")}
          >
            Nostalgi
          </div>
          <div
            className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm border-b border-t sm:border-t-0 sm:border-b-0 sm:border-r sm:border-l border-gray1 cursor-pointer ${
              selectedFilter === "Herskapelig" && "bg-white"
            }`}
            onClick={() => setSelectedFilter("Herskapelig")}
          >
            Herskapelig
          </div>
          <div
            className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer border-b sm:border-b-0 sm:border-r border-gray1 ${
              selectedFilter === "Moderne" && "bg-white"
            }`}
            onClick={() => setSelectedFilter("Moderne")}
          >
            Moderne
          </div>
          <div
            className={`p-2.5 md:py-3 md:px-4 text-black2 font-medium text-[13px] sm:text-sm cursor-pointer ${
              selectedFilter === "Funkis" && "bg-white"
            }`}
            onClick={() => setSelectedFilter("Funkis")}
          >
            Funkis
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-gray2 shadow-shadow2 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id} className="h-8 text-sm">
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
                  className="hover:bg-muted/50"
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
    </>
  );
};
