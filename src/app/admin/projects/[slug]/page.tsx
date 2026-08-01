import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { TopNavBar } from "@/components/top-nav-bar"
import { SiteFooter } from "@/components/site-footer"
import {
  AdminProjectWrapper,
  type AdminProjectData,
} from "@/components/admin/admin-project-wrapper"
import type { SupabaseProjectWithMedia } from "@/lib/data/projects"

// ── Page Props ──

interface PageProps {
  params: Promise<{ slug: string }>
}

// ── Server Component ──

export default async function AdminProjectDetailPage({ params }: PageProps) {
  const { slug } = await params

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, project_media(*)")
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "project_media", ascending: true })
    .single<SupabaseProjectWithMedia>()

  if (error || !project) {
    notFound()
  }

  // Serialize to a plain object for the client component
  const projectData: AdminProjectData = {
    id: project.id,
    title: project.title,
    slug: project.slug,
    description: project.description,
    category: project.category,
    tech_stack: project.tech_stack,
    technical_specs: project.technical_specs,
    project_media: project.project_media ?? [],
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <TopNavBar />

      {/* Back Navigation */}
      <div className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 w-full pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-jetbrains text-muted-foreground hover:text-foreground transition-colors w-fit mt-20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Systems
        </Link>
      </div>

      {/* WYSIWYG Admin Wrapper — handles edit/delete/save */}
      <AdminProjectWrapper project={projectData} />

      <SiteFooter />
    </div>
  )
}
