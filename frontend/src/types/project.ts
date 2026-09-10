export const PROJECT_STATUSES = [
  'Planning',
  'In Progress',
  'On Hold',
  'Completed',
] as const

export const PROJECT_PRIORITIES = ['Low', 'Medium', 'High'] as const

export const PROJECT_SORTABLE = [
  'id',
  'client_name',
  'project_name',
  'status',
  'priority',
  'start_date',
  'due_date',
  'created_at',
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]
export type ProjectPriority = (typeof PROJECT_PRIORITIES)[number]
export type ProjectSortBy = (typeof PROJECT_SORTABLE)[number]
export type ProjectSortDir = 'asc' | 'desc'

export type Project = {
  id: number
  client_name: string
  project_name: string
  description: string | null
  status: ProjectStatus
  priority: ProjectPriority
  start_date: string | null
  due_date: string | null
  created_at: string | null
  updated_at: string | null
}

export type ProjectListMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}
