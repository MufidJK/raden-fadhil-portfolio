"use client"

import * as React from "react"
import Link from "next/link"
import { toast } from "sonner"
import { deleteProjectAction } from "@/app/admin/projects/actions"
import { SupabaseProject } from "@/lib/data/projects"
import { Pencil, Trash2, Calendar, FileText } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AdminProjectListProps {
  projects: SupabaseProject[]
}

export function AdminProjectList({ projects }: AdminProjectListProps) {
  const [projectToDelete, setProjectToDelete] = React.useState<string | null>(null)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!projectToDelete) return

    setIsDeleting(true)
    const toastId = toast.loading("Deleting project...")

    try {
      const result = await deleteProjectAction(projectToDelete)
      if (result.error) {
        toast.error(`Failed to delete: ${result.error}`, { id: toastId })
      } else {
        toast.success("Project deleted successfully", { id: toastId })
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error"
      toast.error(`An error occurred: ${message}`, { id: toastId })
    } finally {
      setIsDeleting(false)
      setProjectToDelete(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all"
        >
          <div className="flex flex-col gap-1.5 w-full">
            <h3 className="font-semibold text-base sm:text-lg tracking-tight line-clamp-1">
              {project.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                {project.category || "Uncategorized"}
              </span>
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-muted-foreground/30" />
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(project.created_at ?? "").toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end mt-2 sm:mt-0">
            <Link
              href={`/admin/projects/${project.slug}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit</span>
            </Link>
            <button
              onClick={() => setProjectToDelete(project.id)}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      ))}

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              and all of its associated media files from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
