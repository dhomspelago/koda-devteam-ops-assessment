'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { projectsKeys } from '@/hooks/api/projects/projects-keys'
import { useApi } from '@/providers/api-provider'
import { getApiErrorMessage } from '@/utils/api-error'

export function useDeleteProject() {
  const { api } = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/projects/${id}`)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: projectsKeys.all })
      toast.add({
        title: 'Project deleted',
        description: 'The project was deleted successfully.',
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Failed to delete project',
        description: getApiErrorMessage(error, 'Unable to delete project.'),
        type: 'error',
      })
    },
  })
}
