'use client'

import { useMemo, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { createUsersColumns } from '@/app/constants/columns/users-columns'
import { DataTable } from '@/components/data-table'
import { CreateUserModal } from '@/components/pages/users/create-user-modal'
import { DeleteUserDialog } from '@/components/pages/users/delete-user-dialog'
import { EditUserModal } from '@/components/pages/users/edit-user-modal'
import { Button } from '@/components/ui/button'
import { usersKeys } from '@/hooks/api/users/users-keys'
import type { User } from '@/types/auth'

export function UsersPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  const columns = useMemo(
    () =>
      createUsersColumns({
        onEdit: setEditingUser,
        onDelete: setDeletingUser,
      }),
    [],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts for the assessment app.
          </p>
        </div>
        <Button type="button" onClick={() => setCreateOpen(true)}>
          <PlusIcon data-icon="inline-start" />
          Add user
        </Button>
      </div>

      <DataTable
        columns={columns}
        endpoint="/users"
        tableQuery={usersKeys.all}
        dataKey="users"
      />

      <CreateUserModal open={createOpen} onOpenChange={setCreateOpen} />

      <EditUserModal
        user={editingUser}
        open={!!editingUser}
        onOpenChange={(open) => {
          if (!open) {
            setEditingUser(null)
          }
        }}
      />

      <DeleteUserDialog
        user={deletingUser}
        open={!!deletingUser}
        onOpenChange={(open) => {
          if (!open) {
            setDeletingUser(null)
          }
        }}
      />
    </div>
  )
}
