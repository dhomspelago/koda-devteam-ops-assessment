import { z } from 'zod'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
} from '@/types/project'

const dateOrEmpty = z
  .string()
  .optional()
  .transform((value) => {
    const trimmed = value?.trim() ?? ''
    return trimmed === '' ? null : trimmed
  })

function refineDueDateAfterStart(
  data: { start_date: string | null; due_date: string | null },
  ctx: z.RefinementCtx,
) {
  if (data.start_date && data.due_date && data.due_date < data.start_date) {
    ctx.addIssue({
      code: 'custom',
      message: 'The due date cannot be earlier than the start date.',
      path: ['due_date'],
    })
  }
}

export const PostProjectSchema = z
  .object({
    client_name: z.string().trim().min(1, 'Client name is required').max(255),
    project_name: z
      .string()
      .trim()
      .min(1, 'Project name is required')
      .max(255),
    description: z
      .string()
      .optional()
      .transform((value) => {
        const trimmed = value?.trim() ?? ''
        return trimmed === '' ? null : trimmed
      }),
    status: z.enum(PROJECT_STATUSES, {
      message: 'Status is required',
    }),
    priority: z.enum(PROJECT_PRIORITIES, {
      message: 'Priority is required',
    }),
    start_date: dateOrEmpty,
    due_date: dateOrEmpty,
  })
  .superRefine(refineDueDateAfterStart)

export type PostProjectSchemaType = z.infer<typeof PostProjectSchema>

export const PatchProjectSchema = PostProjectSchema

export type PatchProjectSchemaType = z.infer<typeof PatchProjectSchema>
