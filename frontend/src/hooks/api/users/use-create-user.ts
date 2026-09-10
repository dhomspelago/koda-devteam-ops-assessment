'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from '@/components/ui/toast'
import { usersKeys } from '@/hooks/api/users/users-keys'
import { useApi } from '@/providers/api-provider'
import type { PostUserSchemaType } from '@/schemas/user.schema'
import type { User } from '@/types/auth'
import { getApiErrorMessage } from '@/utils/api-error'

type CreateUserResponse = {
  message: string
  data: {
    user: User
  }
}

export function useCreateUser() {
  const { api } = useApi()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PostUserSchemaType): Promise<User> => {
      const { data } = await api.post<CreateUserResponse>('/users', payload)
      return data.data.user
    },
    onSuccess: (user) => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all })
      toast.add({
        title: 'User created',
        description: `${user.name} was created successfully.`,
        type: 'success',
      })
    },
    onError: (error) => {
      toast.add({
        title: 'Failed to create user',
        description: getApiErrorMessage(error, 'Unable to create user.'),
        type: 'error',
      })
    },
  })
}
