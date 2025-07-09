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
} from "../../../../components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import Ic_search from "../../../../assets/images/Ic_search.svg";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";
import { fetchRoomData } from "../../../../lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "../../../../components/common/modal";
import Button from "../../../../components/common/button";
import { Spinner } from "../../../../components/Spinner";

export const RoomProjectTable = () => {
  const [page, setPage] = useState(1);
  const [RoomConfigurator, setRoomConfigurator] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string>("");

  const handleDelete = async (indexToDelete: string) => {
    const husmodellDocRef = doc(db, "room_configurator", String(id));
    setIsSubmitLoading(true);

    try {
      const docSnap = await getDoc(husmodellDocRef);
      const existingData = docSnap.exists()
        ? docSnap.data().Plantegninger || []
        : [];

      const updatedData = existingData.filter(
        (item: any) => item.id !== indexToDelete
      );

      await updateDoc(husmodellDocRef, {
        Plantegninger: updatedData,
        updatedAt: new Date().toISOString(),
      });
      setConfirmDeleteId("");
      fetchRoomConfiguratorData();
      setShowConfirm(false);

      toast.success("Floor deleted successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Error deleting floor:", error);
      toast.error("Failed to delete floor", { position: "top-right" });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleConfirmPopup = () => {
    if (showConfirm) {
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const fetchRoomConfiguratorData = async () => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    const getData = async () => {
      const data = await fetchRoomData(id);

      if (data && data?.Plantegninger) {
        setRoomConfigurator(data?.Plantegninger);
      }
      setIsLoading(false);
    };
    getData();
  };

  useEffect(() => {
    fetchRoomConfiguratorData();
  }, []);

  const filteredData = useMemo(() => {
    return RoomConfigurator.filter((model: any) =>
      model.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [RoomConfigurator, searchTerm]);

  const [editId, setEditId] = useState<string | null>(null);
  const [editedFloorName, setEditedFloorName] = useState<string>("");

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "Navn",
        header: "Navn",
        cell: ({ row }) => (
          <div className="flex gap-2 items-center justify-between">
            <p className="text-sm font-medium text-black w-max">
              {row.original?.title}
            </p>
            <Pencil
              className="w-5 h-5 text-purple cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setEditId(row.original.id);
                setEditedFloorName(row.original.title || "");
              }}
            />
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
          <>
            <div className="flex items-center gap-3">
              <Pencil
                className="h-5 w-5 text-primary cursor-pointer"
                onClick={() =>
                  navigate(`/Room-Configurator/${row.original?.id}`)
                }
              />

              <Trash
                className="h-5 w-5 text-red cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(true);
                  setConfirmDeleteId(row.original.id);
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
      {isSubmitLoading && <Spinner />}

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
                    navigate(`/Room-Configurator/${row.original?.id}`)
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
                <div
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmDeleteId("");
                  }}
                >
                  <Button
                    text="Avbryt"
                    className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                  />
                </div>
                <div onClick={() => handleDelete(confirmDeleteId)}>
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

      {editId && (
        <Modal onClose={() => setEditId(null)} isOpen={true}>
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[400px] max-w-full">
              <h2 className="text-lg font-bold mb-4">Oppdater navn</h2>
              <input
                type="text"
                value={editedFloorName}
                onChange={(e) => setEditedFloorName(e.target.value)}
                className="border border-gray1 rounded px-3 py-2 w-full mb-4"
                autoFocus
              />
              <div className="flex justify-end gap-3">
                <Button
                  text="Avbryt"
                  className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px]"
                  onClick={() => setEditId(null)}
                />
                <Button
                  text="Oppdater"
                  className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-3 py-[10px]"
                  onClick={async () => {
                    try {
                      const husmodellDocRef = doc(
                        db,
                        "room_configurator",
                        String(editId)
                      );

                      const updatedRooms = [...RoomConfigurator];

                      const index = updatedRooms.findIndex(
                        (item: any) => item.id === editId
                      );
                      if (index !== -1) {
                        updatedRooms[index] = {
                          ...updatedRooms[index],
                          title: editedFloorName,
                        };
                      }

                      setRoomConfigurator(updatedRooms);

                      await updateDoc(husmodellDocRef, {
                        Plantegninger: updatedRooms,
                        updatedAt: new Date().toISOString(),
                      });

                      toast.success("Navn oppdatert!", {
                        position: "top-right",
                      });
                      setEditId(null);
                    } catch (err) {
                      console.error("Failed to update:", err);
                      toast.error("Kunne ikke oppdatere navn.", {
                        position: "top-right",
                      });
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
