'use client'

import { useCallback, useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { createProjectsColumns } from '@/app/constants/columns/projects-columns'
import { DataTable } from '@/components/data-table'
import { CreateProjectModal } from '@/components/pages/projects/create-project-modal'
import { DeleteProjectDialog } from '@/components/pages/projects/delete-project-dialog'
import { EditProjectModal } from '@/components/pages/projects/edit-project-modal'
import {
  ProjectFilters,
  type ProjectFiltersValue,
} from '@/components/pages/projects/project-filters'
import { Button } from '@/components/ui/button'
import { projectsKeys } from '@/hooks/api/projects/projects-keys'
import type {
  Project,
  ProjectSortBy,
  ProjectSortDir,
} from '@/types/project'

const DEFAULT_PER_PAGE = 15

export function ProjectsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)

  const [filters, setFilters] = useState<ProjectFiltersValue>({
    search: '',
    status: '',
    priority: '',
  })
  const [sortBy, setSortBy] = useState<ProjectSortBy>('id')
  const [sortDir, setSortDir] = useState<ProjectSortDir>('asc')
  const [page, setPage] = useState(1)

  function handleFiltersChange(next: ProjectFiltersValue) {
    setFilters(next)
    setPage(1)
  }

  const handleSort = useCallback((column: ProjectSortBy) => {
    if (sortBy === column) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
    setPage(1)
  }, [sortBy])

  const params = useMemo(() => {
    const next: Record<string, unknown> = {
      sort_by: sortBy,
      sort_dir: sortDir,
      page,
      per_page: DEFAULT_PER_PAGE,
    }

    if (filters.search) {
      next.search = filters.search
    }
    if (filters.status) {
      next.status = filters.status
    }
    if (filters.priority) {
      next.priority = filters.priority
    }

    return next
  }, [filters, sortBy, sortDir, page])

  const columns = useMemo(
    () =>
      createProjectsColumns({
        onEdit: setEditingProject,
        onDelete: setDeletingProject,
        sortBy,
        sortDir,
        onSort: handleSort,
      }),
    [sortBy, sortDir, handleSort],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage client projects, status, priority, and timelines.
          </p>
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          Add project
        </Button>
      </div>

      <ProjectFilters value={filters} onChange={handleFiltersChange} />

      <DataTable
        columns={columns}
        endpoint="/projects"
        tableQuery={projectsKeys.all}
        dataKey="projects"
        params={params}
        onPageChange={setPage}
      />

      <CreateProjectModal open={createOpen} onOpenChange={setCreateOpen} />

      <EditProjectModal
        project={editingProject}
        open={!!editingProject}
        onOpenChange={(open) => {
          if (!open) {
            setEditingProject(null)
          }
        }}
      />

      <DeleteProjectDialog
        project={deletingProject}
        open={!!deletingProject}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingProject(null)
          }
        }}
      />
    </div>
  )
}
