'use client'

import { useQuery, type QueryKey } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useApi } from '@/providers/api-provider'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

type ListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

type DataTableProps<TData> = {
  columns: Array<ColumnDef<TData>>
  endpoint: string
  tableQuery: QueryKey
  dataKey: string
  params?: Record<string, unknown>
  onPageChange?: (page: number) => void
}

type ApiListEnvelope = {
  message?: string
  data?: Record<string, unknown>
}

function isListMeta(value: unknown): value is ListMeta {
  if (!value || typeof value !== 'object') {
    return false
  }

  const meta = value as Record<string, unknown>
  return (
    typeof meta.current_page === 'number' &&
    typeof meta.last_page === 'number' &&
    typeof meta.per_page === 'number' &&
    typeof meta.total === 'number'
  )
}

export function DataTable<TData>({
  columns,
  endpoint,
  tableQuery,
  dataKey,
  params,
  onPageChange,
}: DataTableProps<TData>) {
  const { api } = useApi()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [...tableQuery, params ?? {}],
    queryFn: async (): Promise<{ rows: TData[]; meta: ListMeta | null }> => {
      const response = await api.get<ApiListEnvelope>(endpoint, { params })
      const payload = response.data.data
      const collection = payload?.[dataKey]
      const metaValue = payload?.meta

      return {
        rows: Array.isArray(collection) ? (collection as TData[]) : [],
        meta: isListMeta(metaValue) ? metaValue : null,
      }
    },
  })

  const rows = data?.rows ?? []
  const meta = data?.meta ?? null

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
        <Spinner className="size-5" />
        Loading…
      </div>
    )
  }

  if (isError) {
    return (
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyTitle>Unable to load data</EmptyTitle>
          <EmptyDescription>
            {error instanceof Error ? error.message : 'Please try again.'}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  if (rows.length === 0) {
    return (
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyTitle>No results</EmptyTitle>
          <EmptyDescription>There are no records to display.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {meta && onPageChange ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.current_page} of {meta.last_page} · {meta.total} total
          </p>
          <Pagination className="mx-0 w-auto justify-start sm:justify-end">
            <PaginationContent>
              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  className="pl-1.5!"
                  disabled={meta.current_page <= 1}
                  onClick={() => onPageChange(meta.current_page - 1)}
                >
                  <ChevronLeftIcon data-icon="inline-start" />
                  <span className="hidden sm:inline">Previous</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="default"
                  className="pr-1.5!"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => onPageChange(meta.current_page + 1)}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRightIcon data-icon="inline-end" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  )
}
