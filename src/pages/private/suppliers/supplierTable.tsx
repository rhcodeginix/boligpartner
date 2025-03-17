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
import DateRangePicker from "../../../components/ui/daterangepicker";

const data = [
  {
    id: 1,
    logo: Ic_Leverandor,
    Selskapsnavn: "Fjellheimhytta AS",
    adresse: "Sokkabekveien 77",
    adresse2: "3478 Nærsnes",
    Sistendret: "5. mars 2025",
    type: "Hytte",
    Produkter: 6,
  },
  {
    id: 2,
    logo: Ic_Leverandor,
    Selskapsnavn: "Fjellheimhytta AS",
    adresse: "Sokkabekveien 77",
    adresse2: "3478 Nærsnes",
    Sistendret: "5. mars 2025",
    type: "Bolig",
    Produkter: 31,
  },
  {
    id: 3,
    logo: Ic_Leverandor,
    Selskapsnavn: "Fjellheimhytta AS",
    adresse: "Sokkabekveien 77",
    adresse2: "3478 Nærsnes",
    Sistendret: "5. mars 2025",
    type: "Bank",
    Produkter: 1,
  },
];

export const SupplierTable = () => {
  const [page, setPage] = useState(1);

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "logo",
        header: "Logo",
        cell: ({ row }) => (
          <img src={row.original.logo} alt="logo" className="h-5" />
        ),
      },
      {
        accessorKey: "selskapsnavn",
        header: "Selskapsnavn",
        cell: ({ row }) => (
          <p className="font-semibold text-sm text-darkBlack">
            {row.original.Selskapsnavn}
          </p>
        ),
      },
      {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <p className="text-sm text-darkBlack">{row.original.type}</p>
        ),
      },
      {
        accessorKey: "Produkter",
        header: "Produkter",
        cell: ({ row }) => (
          <p className="text-sm text-darkBlack">{row.original.Produkter}</p>
        ),
      },
      {
        accessorKey: "Sistendret",
        header: "Sist endret",
        cell: ({ row }) => (
          <p className="text-sm font-semibold text-black">
            {row.original.Sistendret}
          </p>
        ),
      },
      {
        accessorKey: "adresse",
        header: "Adresse",
        cell: ({ row }) => (
          <div>
            <p className="text-black text-sm mb-[2px]">
              {row.original.adresse}
            </p>
            <p className="text-sm text-black">{row.original.adresse2}</p>
          </div>
        ),
      },
      {
        id: "action",
        header: "Action",
        cell: () => (
          <button className="h-8 w-8 flex items-center justify-center">
            <Ellipsis className="h-4 w-4 text-gray-500" />
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

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <>
      <div className="mb-2 flex items-center justify-between bg-lightPurple rounded-[12px] py-3 px-4">
        <div className="flex items-center border border-gray1 shadow-shadow1 bg-[#fff] gap-2 rounded-lg py-[10px] px-[14px]">
          <img src={Ic_search} alt="search" />
          <input
            type="text"
            placeholder="Søk"
            className="focus-within:outline-none"
          />
        </div>
        <div className="flex gap-3 items-center">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={handleDateChange}
          />
          <div className="border border-gray1 rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow1 h-[40px] bg-[#fff]">
            <img src={Ic_filter} alt="" />
            <span className="text-black font-medium text-sm">Filter</span>
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
