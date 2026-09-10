'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { usersKeys } from '@/hooks/api/users/users-keys'
import { useApi } from '@/providers/api-provider'
import { getApiErrorMessage } from '@/utils/api-error'

export function useDeleteUser() {
  const { api } = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number): Promise<void> => {
      await api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all })
      toast.add({
        title: 'User deleted',
        description: 'The user was deleted successfully.',
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Failed to delete user',
        description: getApiErrorMessage(error, 'Unable to delete user.'),
        type: 'error',
      })
    },
  })
}
