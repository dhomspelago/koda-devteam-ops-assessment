export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...projectsKeys.lists(), params ?? {}] as const,
  details: () => [...projectsKeys.all, 'detail'] as const,
  detail: (id: number) => [...projectsKeys.details(), id] as const,
}
