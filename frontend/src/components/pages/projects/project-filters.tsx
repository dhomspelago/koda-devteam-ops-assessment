'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  type ProjectPriority,
  type ProjectStatus,
} from '@/types/project'

export type ProjectFiltersValue = {
  search: string
  status: ProjectStatus | ''
  priority: ProjectPriority | ''
}

type ProjectFiltersProps = {
  value: ProjectFiltersValue
  onChange: (next: ProjectFiltersValue) => void
}

export function ProjectFilters({ value, onChange }: ProjectFiltersProps) {
  const [searchInput, setSearchInput] = useState(value.search)

  useEffect(() => {
    setSearchInput(value.search)
  }, [value.search])

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = searchInput.trim()
      if (trimmed === value.search) {
        return
      }

      onChange({ ...value, search: trimmed })
    }, 300)

    return () => window.clearTimeout(handle)
    // Only debounce local search input; parent sync is intentional via value.search
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <Input
        type="search"
        placeholder="Search client, project, description…"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        className="sm:max-w-xs"
        aria-label="Search projects"
      />

      <NativeSelect
        aria-label="Filter by status"
        value={value.status}
        onChange={(event) =>
          onChange({
            ...value,
            status: event.target.value as ProjectStatus | '',
          })
        }
      >
        <NativeSelectOption value="">All statuses</NativeSelectOption>
        {PROJECT_STATUSES.map((status) => (
          <NativeSelectOption key={status} value={status}>
            {status}
          </NativeSelectOption>
        ))}
      </NativeSelect>

      <NativeSelect
        aria-label="Filter by priority"
        value={value.priority}
        onChange={(event) =>
          onChange({
            ...value,
            priority: event.target.value as ProjectPriority | '',
          })
        }
      >
        <NativeSelectOption value="">All priorities</NativeSelectOption>
        {PROJECT_PRIORITIES.map((priority) => (
          <NativeSelectOption key={priority} value={priority}>
            {priority}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}
