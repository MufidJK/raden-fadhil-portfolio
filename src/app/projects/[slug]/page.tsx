import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MediaCarousel } from "@/components/projects/media-carousel"
import { TopNavBar } from "@/components/top-nav-bar"
import { SiteFooter } from "@/components/site-footer"
import type { ProjectMedia } from "@/lib/data/projects"

// ── Supabase Row Types (mirroring MCP-verified schema) ──

interface ProjectMediaRow {
  id: string
  project_id: string | null
  media_url: string
  media_type: string | null
  caption: string | null
  sort_order: number | null
  created_at: string | null
}

interface ProjectRow {
  id: string
  title: string
  slug: string
  description: string | null
  technical_specs: Record<string, string> | null
  created_at: string | null
  updated_at: string | null
  category: string | null
  tech_stack: string[] | null
  project_media: ProjectMediaRow[]
}

// ── Page Props ──

interface PageProps {
  params: Promise<{ slug: string }>
}

// ── Server Component ──

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params

  const { data: project, error } = await supabase
    .from("projects")
    .select("*, project_media(*)")
    .eq("slug", slug)
    .order("sort_order", { referencedTable: "project_media", ascending: true })
    .single<ProjectRow>()

  if (error || !project) {
    notFound()
  }

  // Map Supabase project_media rows → MediaCarousel's ProjectMedia shape
  const carouselMedia: ProjectMedia[] = (project.project_media ?? []).map(
    (row) => ({
      id: row.id,
      type: (row.media_type === "video" ? "video" : "image") as "image" | "video",
      url: row.media_url,
      alt: row.caption ?? undefined,
    })
  )

  // Parse technical_specs JSONB into iterable entries
  const specsEntries: [string, string][] = project.technical_specs
    ? Object.entries(project.technical_specs)
    : []

  const techStack: string[] = project.tech_stack ?? []

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <TopNavBar />

      <main className="flex-1 container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12 pt-8 pb-12">
        {/* Back Navigation */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-jetbrains text-muted-foreground hover:text-foreground transition-colors w-fit mt-20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Systems
        </Link>

        {/* Hero Header */}
        <section className="block w-full max-w-4xl space-y-6">
          {project.category && (
            <Badge
              variant="outline"
              className="w-fit font-jetbrains text-xs tracking-widest uppercase bg-surface-variant/20 text-muted-foreground border-surface-variant"
            >
              {project.category}
            </Badge>
          )}

          <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight text-foreground">
            {project.title}
          </h1>

          {project.description && (
            <div className="block w-full max-w-4xl">
              <p className="block w-full max-w-4xl text-xl md:text-2xl font-sans text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>
          )}

          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {techStack.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="font-jetbrains text-sm bg-surface-variant/40 text-foreground"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          )}
        </section>

        {/* Media Carousel */}
        {carouselMedia.length > 0 && <MediaCarousel media={carouselMedia} />}

        {/* Technical Specifications */}
        {specsEntries.length > 0 && (
          <section className="flex flex-col gap-6 w-full">
            <h2 className="text-2xl font-bold font-sans tracking-tight text-foreground">
              Technical Specifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {specsEntries.map(([label, value]) => (
                <Card
                  key={label}
                  className="p-6 bg-surface-container-low border-surface-variant w-full"
                >
                  <p className="font-jetbrains text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    {label}
                  </p>
                  <p className="font-sans font-medium text-foreground">
                    {value}
                  </p>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}
