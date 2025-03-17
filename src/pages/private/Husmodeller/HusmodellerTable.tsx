import { Ellipsis, Loader2 } from "lucide-react";
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
import { useMemo, useState } from "react";
import Ic_Leverandor from "../../../assets/images/Ic_Leverandor.svg";
import Ic_search from "../../../assets/images/Ic_search.svg";
import Ic_filter from "../../../assets/images/Ic_filter.svg";
import Ic_husmodell from "../../../assets/images/Ic_husmodell.svg";
import Ic_Avatar from "../../../assets/images/Ic_Avatar.svg";

const data = [
  {
    id: 1,
    leverandor: Ic_Leverandor,
    Husmodell: Ic_husmodell,
    husmodell: "Almagard",
    Kategori: "Herskapelig",
    m2: 233,
    soverom: 5,
    bad: 3,
    avatar: Ic_Avatar,
    SisteOppdatert: "Lars Nilsen",
    time: "04.03.2025 13:45:22",
  },
  {
    id: 2,
    leverandor: Ic_Leverandor,
    Husmodell: Ic_husmodell,
    Kategori: "Herskapelig",
    husmodell: "ST 66",
    m2: 233,
    soverom: 5,
    bad: 3,
    avatar: Ic_Avatar,
    SisteOppdatert: "Lars Nilsen",
    time: "04.03.2025 13:45:22",
  },
  {
    id: 3,
    leverandor: Ic_Leverandor,
    Kategori: "Herskapelig",
    Husmodell: Ic_husmodell,
    husmodell: "ST 66",
    m2: 233,
    soverom: 5,
    bad: 3,
    avatar: Ic_Avatar,
    SisteOppdatert: "Lars Nilsen",
    time: "04.03.2025 13:45:22",
  },
];

export const HusmodellerTable = () => {
  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "husmodell",
        header: "Husmodell",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.Husmodell}
              alt="Husmodell"
              className="w-8 h-8 rounded-full"
            />
            <p className="font-medium text-sm text-purple">
              {row.original.husmodell}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "leverandor",
        header: "Leverandør",
        cell: ({ row }) => (
          <img src={row.original.leverandor} alt="leverandor" className="h-5" />
        ),
      },
      {
        accessorKey: "kategori",
        header: "Kategori",
        cell: ({ row }) => (
          <p className="text-sm text-gray">{row.original.Kategori}</p>
        ),
      },
      {
        accessorKey: "husdetaljer",
        header: "Husdetaljer",
        cell: ({ row }) => (
          <p className="text-sm text-gray">
            <span className="font-bold">{row.original.m2}</span> m2.{" "}
            <span className="font-bold">{row.original.soverom}</span> soverom,{" "}
            <span className="font-bold">{row.original.bad}</span> bad
          </p>
        ),
      },
      {
        accessorKey: "sisteoppdatertav",
        header: "Siste oppdatert av",
        cell: ({ row }) => (
          <div className="flex items-start gap-3">
            <img
              src={row.original.avatar}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium text-black text-sm mb-[2px]">
                {row.original.SisteOppdatert}
              </p>
              <p className="text-xs text-gray">{row.original.time}</p>
            </div>
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: () => (
          <button className="h-8 w-8 flex items-center justify-center">
            <Ellipsis className="h-4 w-4 text-gray-500" />
            {/* se-husmodell */}
          </button>
        ),
      },
    ],
    []
  );

  const pageSize = 10;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [page]);

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
    pageCount: Math.ceil(data.length / pageSize),
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
          />
        </div>

        <div className="border border-gray1 rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow1 h-[40px] bg-[#fff]">
          <img src={Ic_filter} alt="" />
          <span className="text-black font-medium text-sm">Filter</span>
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
            {data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
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
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
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
    </>
  );
};
