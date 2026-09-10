import { z } from 'zod'

export const PostUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255),
    email: z.string().trim().email('Invalid email').max(255),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z
      .string()
      .min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  })

export type PostUserSchemaType = z.infer<typeof PostUserSchema>

export const PatchUserSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(255),
    email: z.string().trim().email('Invalid email').max(255),
    password: z.string().optional(),
    password_confirmation: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const password = data.password?.trim() ?? ''
    const confirmation = data.password_confirmation?.trim() ?? ''

    if (!password && !confirmation) {
      return
    }

    if (password.length < 8) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password must be at least 8 characters',
        path: ['password'],
      })
    }

    if (!confirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'Password confirmation is required',
        path: ['password_confirmation'],
      })
      return
    }

    if (password !== confirmation) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['password_confirmation'],
      })
    }
  })

export type PatchUserSchemaType = z.infer<typeof PatchUserSchema>
