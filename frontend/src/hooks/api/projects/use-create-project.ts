'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { projectsKeys } from '@/hooks/api/projects/projects-keys'
import { useApi } from '@/providers/api-provider'
import type { PostProjectSchemaType } from '@/schemas/project.schema'
import type { Project } from '@/types/project'
import { getApiErrorMessage } from '@/utils/api-error'

type CreateProjectResponse = {
  message: string
  data: {
    project: Project
  }
}

export function useCreateProject() {
  const { api } = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PostProjectSchemaType): Promise<Project> => {
      const { data } = await api.post<CreateProjectResponse>(
        '/projects',
        payload,
      )
      return data.data.project
    },
    onSuccess: (project) => {
      void queryClient.invalidateQueries({ queryKey: projectsKeys.all })
      toast.add({
        title: 'Project created',
        description: `${project.project_name} was created successfully.`,
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Failed to create project',
        description: getApiErrorMessage(error, 'Unable to create project.'),
        type: 'error',
      })
    },
  })
}
