'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteProject } from '@/hooks/api/projects/use-delete-project'
import type { Project } from '@/types/project'

type DeleteProjectDialogProps = {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProjectDialog({
  project,
  open,
  onOpenChange,
}: DeleteProjectDialogProps) {
  const deleteProject = useDeleteProject()

  function handleDelete() {
    if (!project) {
      return
    }

    deleteProject.mutate(project.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete project</AlertDialogTitle>
          <AlertDialogDescription>
            {project
              ? `Are you sure you want to delete ${project.project_name}? This action cannot be undone.`
              : 'Are you sure you want to delete this project?'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteProject.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={deleteProject.isPending || !project}
            onClick={handleDelete}
          >
            {deleteProject.isPending ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
