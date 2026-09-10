'use client'

import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import { format, parseISO } from 'date-fns'
import { ArrowDownIcon, ArrowUpIcon, ArrowUpDownIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type {
  Project,
  ProjectPriority,
  ProjectSortBy,
  ProjectSortDir,
  ProjectStatus,
} from '@/types/project'

const columnHelper = createColumnHelper<Project>()

export type ProjectsColumnsHandlers = {
  onEdit: (project: Project) => void
  onDelete: (project: Project) => void
  sortBy: ProjectSortBy
  sortDir: ProjectSortDir
  onSort: (column: ProjectSortBy) => void
}

function formatDate(value: string | null): string {
  if (!value) {
    return '—'
  }

  try {
    return format(parseISO(value), 'MMM d, yyyy')
  } catch {
    return value
  }
}

function statusVariant(
  status: ProjectStatus,
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (status) {
    case 'Completed':
      return 'default'
    case 'In Progress':
      return 'secondary'
    case 'On Hold':
      return 'destructive'
    default:
      return 'outline'
  }
}

function priorityVariant(
  priority: ProjectPriority,
): 'default' | 'secondary' | 'outline' | 'destructive' {
  switch (priority) {
    case 'High':
      return 'destructive'
    case 'Medium':
      return 'secondary'
    default:
      return 'outline'
  }
}

function SortableHeader({
  label,
  column,
  sortBy,
  sortDir,
  onSort,
}: {
  label: string
  column: ProjectSortBy
  sortBy: ProjectSortBy
  sortDir: ProjectSortDir
  onSort: (column: ProjectSortBy) => void
}) {
  const isActive = sortBy === column

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 h-8 px-2"
      onClick={() => onSort(column)}
    >
      {label}
      {isActive ? (
        sortDir === 'asc' ? (
          <ArrowUpIcon data-icon="inline-end" />
        ) : (
          <ArrowDownIcon data-icon="inline-end" />
        )
      ) : (
        <ArrowUpDownIcon data-icon="inline-end" className="opacity-40" />
      )}
    </Button>
  )
}

export function createProjectsColumns(
  handlers: ProjectsColumnsHandlers,
): Array<ColumnDef<Project>> {
  const { sortBy, sortDir, onSort } = handlers

  return [
    columnHelper.accessor('client_name', {
      header: () => (
        <SortableHeader
          label="Client"
          column="client_name"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm font-medium">{getValue()}</span>
      ),
    }),
    columnHelper.accessor('project_name', {
      header: () => (
        <SortableHeader
          label="Project"
          column="project_name"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }) => <span className="text-sm">{getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: () => (
        <SortableHeader
          label="Status"
          column="status"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }) => {
        const status = getValue()
        return <Badge variant={statusVariant(status)}>{status}</Badge>
      },
    }),
    columnHelper.accessor('priority', {
      header: () => (
        <SortableHeader
          label="Priority"
          column="priority"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }) => {
        const priority = getValue()
        return <Badge variant={priorityVariant(priority)}>{priority}</Badge>
      },
    }),
    columnHelper.accessor('start_date', {
      header: () => (
        <SortableHeader
          label="Start"
          column="start_date"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor('due_date', {
      header: () => (
        <SortableHeader
          label="Due"
          column="due_date"
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={onSort}
        />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(getValue())}
        </span>
      ),
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
  ] as Array<ColumnDef<Project>>
}
