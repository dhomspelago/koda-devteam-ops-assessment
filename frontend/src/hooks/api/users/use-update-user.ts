'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { usersKeys } from '@/hooks/api/users/users-keys'
import { useApi } from '@/providers/api-provider'
import type { User } from '@/types/auth'
import { getApiErrorMessage } from '@/utils/api-error'

export type UpdateUserPayload = {
  name: string
  email: string
  password?: string
  password_confirmation?: string
}

type UpdateUserResponse = {
  message: string
  data: {
    user: User
  }
}

type UpdateUserVariables = {
  id: number
  payload: UpdateUserPayload
}

export function useUpdateUser() {
  const { api } = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: UpdateUserVariables): Promise<User> => {
      const { data } = await api.put<UpdateUserResponse>(
        `/users/${id}`,
        payload,
      )
      return data.data.user
    },
    onSuccess: (user) => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all })
      toast.add({
        title: 'User updated',
        description: `${user.name} was updated successfully.`,
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Failed to update user',
        description: getApiErrorMessage(error, 'Unable to update user.'),
        type: 'error',
      })
    },
  })
}
