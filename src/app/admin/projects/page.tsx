import { supabase } from "@/lib/supabase"
import { AdminProjectList } from "@/components/admin/admin-project-list"
import { SupabaseProject } from "@/lib/data/projects"
import { FileQuestion, Plus } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminProjectsPage() {
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        <p>Error loading projects: {error.message}</p>
      </div>
    )
  }

  const typedProjects = (projects ?? []) as SupabaseProject[]

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Projects Dashboard</h1>
          <p className="text-muted-foreground">
            Manage all your uploaded projects here.
          </p>
        </div>
        <Link
          href="/admin/upload"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-white text-black shadow hover:bg-white/80"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {typedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileQuestion className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Belum ada project yang diupload.</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            You have not uploaded any projects yet. Go to the upload page to add your first project.
          </p>
        </div>
      ) : (
        <AdminProjectList projects={typedProjects} />
      )}
    </div>
  )
}
