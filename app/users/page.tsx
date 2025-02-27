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
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Layout } from "@/components/layout"
import { apiRequest } from "../apiconnector/api"

type User = {
  id: string
  username: string
  email: string
  status: 0 | 1 | 2  // Changed status to numerical values
  reports: number
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Username
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as number
      const statusText = status === 0 ? "Rejected" : status === 1 ? "Active" : "Pending"
      const statusColor = status === 0 ? "text-red-600" : status === 1 ? "text-green-600" : "text-yellow-600"

      return <div className={`font-medium ${statusColor}`}>{statusText}</div>
    },
  },
  {
    accessorKey: "reports",
    header: "Reports",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userId = row.original.id
      console.log("User ID:", userId)

      const handleBlockUser = async () => {

        try {
          const res = await apiRequest(`users/rejectUser/${userId}`, "PUT")
          console.log(res);

        } catch (error) {
          console.error("Failed to block user:", error)
        }
      }
      const handleApproveUser = async () => {

        try {
          const res = await apiRequest(`users/approveUser/${userId}`, "PUT")
          console.log(res);

        } catch (error) {
          console.error("Failed to block user:", error)
        }
      }
      useEffect(() => {
        handleBlockUser();
        handleBlockUser();
      }, [])

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={handleApproveUser} className="text-green-600">
              Approve User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBlockUser} className="text-red-600">
              Block User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function UsersPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [users, setUsers] = useState<User[]>([])


  const fetchUsers = async () => {
    try {
      const res = await apiRequest("users", "GET")
      setUsers(res || [])
    } catch (error) {
      console.error("Failed to fetch users:", error)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Column Definitions with Updated Action Functions
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as number
        const statusText = status === 0 ? "Blocked" : status === 1 ? "Active" : "Pending"
        const statusColor = status === 0 ? "text-red-600" : status === 1 ? "text-green-600" : "text-yellow-600"

        return <div className={`font-medium ${statusColor}`}>{statusText}</div>
      },
    },
    {
      accessorKey: "reports",
      header: "Reports",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const userId = row.original.id

        const handleBlockUser = async () => {
          try {
            await apiRequest(`users/rejectUser/${userId}`, "PUT")
            fetchUsers() // Refresh user list after blocking
          } catch (error) {
            console.error("Failed to block user:", error)
          }
        }

        const handleApproveUser = async () => {
          try {
            await apiRequest(`users/approveUser/${userId}`, "PUT")
            fetchUsers()
          } catch (error) {
            console.error("Failed to approve user:", error)
          }
        }

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem onClick={handleApproveUser} className="text-green-600">
                Approve User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBlockUser} className="text-red-600">
                Block User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
  })

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Input
            placeholder="Filter users..."
            value={(table.getColumn("username")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("username")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
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
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
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
