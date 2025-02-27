"use client"

import { useEffect, useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { AlertTriangle, MoreHorizontal, Ban } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Layout } from "@/components/layout"
import type { Report } from "@/lib/types"
import { apiRequest } from "../apiconnector/api"

// Mock data
const reports: Report[] = [
  {
    id: "1",
    targetType: "user",
    targetId: "user1",
    reporterId: "reporter1",
    reason: "Inappropriate behavior",
    status: "pending",
    createdAt: new Date(),
    reporter: {
      username: "reporter1",
    },
    target: {
      username: "johndoe",
    },
  },
  {
    id: "2",
    targetType: "post",
    targetId: "post1",
    reporterId: "reporter2",
    reason: "Spam content",
    status: "pending",
    createdAt: new Date(),
    reporter: {
      username: "reporter2",
    },
    target: {
      title: "Reported Post",
    },
  },
]

const columns: ColumnDef<Report>[] = [
  {
    accessorKey: "targetType",
    header: "Type",
    // cell: ({ row }) => {
    //   const type = row.getValue("targetType") as string
    //   return type.charAt(0).toUpperCase() + type.slice(1)
    // },
  },
  {
    accessorKey: "target",
    header: "Target",
    // cell: ({ row }) => {
    //   const report = row.original
    //   return report.targetType === "user" ? report.target.username : report.target.title
    // },
  },
  {
    accessorKey: "reason",
    header: "Reason",
  },
  {
    accessorKey: "reporter.username",
    header: "Reported By",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string | undefined

      if (!status) return <div className="text-gray-400">No status</div>

      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "resolved":
            return "text-green-600"
          case "dismissed":
            return "text-red-600"
          case "pending":
            return "text-yellow-600"
          default:
            return "text-gray-600"
        }
      }

      return (
        <div className={`font-medium ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const report = row.original

      const handleWarn = () => {
        // Add warning logic here
        console.log("Warn user:", report.targetId)
      }

      const handleBlock = () => {
        // Add block logic here
        console.log("Block user:", report.targetId)
      }

      return (
        <div className="flex items-center gap-2">
          {report.targetType === "user" && report.status === "pending" && (
            <>
              <Button variant="ghost" size="icon" onClick={handleWarn} className="h-8 w-8 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleBlock} className="h-8 w-8 text-red-600">
                <Ban className="h-4 w-4" />
              </Button>
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
              <DropdownMenuItem>Dismiss Report</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

export default function ReportsPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [reports, setReports] = useState<Report[]>([])
  useEffect(() => {
    const getAllTheReports = async () => {
      try {
        const res = await apiRequest("reports", "GET")
        console.log(res);
        setReports(res || [])
      } catch (error) {
        console.error("Failed to fetch reports:", error)
      }
    }

    getAllTheReports();
  }, [])

  const table = useReactTable({
    data: reports,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter reports..."
            value={(table.getColumn("reason")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("reason")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                  
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </Layout>
  )
}

