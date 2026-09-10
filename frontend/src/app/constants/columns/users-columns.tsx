'use client'

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/auth'

const columnHelper = createColumnHelper<User>()

export type UsersColumnsHandlers = {
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function createUsersColumns(
  handlers: UsersColumnsHandlers,
): Array<ColumnDef<User>> {
  return [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: ({ getValue }) => (
        <span className="text-sm font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue()}</span>
      ),
    }),
    columnHelper.accessor('created_at', {
      header: 'Created At',
      cell: ({ getValue }) => {
        const value = getValue()
        if (!value) {
          return <span className="text-sm text-muted-foreground">—</span>
        }

        return (
          <span className="text-sm text-muted-foreground">
            {format(new Date(value), 'MMM d, yyyy')}
          </span>
        )
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlers.onEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => handlers.onDelete(row.original)}
          >
            Delete
          </Button>
        </div>
      ),
    }),
  ] as Array<ColumnDef<User>>
}
