'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { projectsKeys } from '@/hooks/api/projects/projects-keys'
import { useApi } from '@/providers/api-provider'
import type { PatchProjectSchemaType } from '@/schemas/project.schema'
import type { Project } from '@/types/project'
import { getApiErrorMessage } from '@/utils/api-error'

type UpdateProjectResponse = {
  message: string
  data: {
    project: Project
  }
}

type UpdateProjectVariables = {
  id: number
  payload: PatchProjectSchemaType
}

export function useUpdateProject() {
  const { api } = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: UpdateProjectVariables): Promise<Project> => {
      const { data } = await api.put<UpdateProjectResponse>(
        `/projects/${id}`,
        payload,
      )
      return data.data.project
    },
    onSuccess: (project) => {
      void queryClient.invalidateQueries({ queryKey: projectsKeys.all })
      toast.add({
        title: 'Project updated',
        description: `${project.project_name} was updated successfully.`,
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Failed to update project',
        description: getApiErrorMessage(error, 'Unable to update project.'),
        type: 'error',
      })
    },
  })
}
