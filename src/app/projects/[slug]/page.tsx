import * as React from "react"
import { notFound } from "next/navigation"
import { mockProjects } from "@/lib/data/projects"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { MediaCarousel } from "@/components/projects/media-carousel"

export interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = mockProjects.find(p => p.link === `/projects/${slug}`)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col pt-24 pb-12">
      <main className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
        {/* Back Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-jetbrains text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Systems
        </Link>
        
        {/* Hero Header */}
        <section className="block w-full max-w-4xl space-y-6">
          <Badge variant="outline" className="w-fit font-jetbrains text-xs tracking-widest uppercase bg-surface-variant/20 text-muted-foreground border-surface-variant">
            {project.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight text-foreground">
            {project.title}
          </h1>
          <div className="block w-full max-w-4xl">
            <p className="block w-full max-w-4xl text-xl md:text-2xl font-sans text-muted-foreground leading-relaxed">
              {project.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="font-jetbrains text-sm bg-surface-variant/40 text-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        {/* Media Carousel */}
        <MediaCarousel media={project.media} />

        {/* Hardware Specs Section */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold font-sans tracking-tight text-foreground">
            Technical Specifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-6 bg-surface-container-low border-surface-variant">
              <p className="font-jetbrains text-xs text-muted-foreground uppercase tracking-wider mb-2">Microcontroller</p>
              <p className="font-sans font-medium text-foreground">ESP32-S3 WROOM</p>
            </Card>
            <Card className="p-6 bg-surface-container-low border-surface-variant">
              <p className="font-jetbrains text-xs text-muted-foreground uppercase tracking-wider mb-2">Connectivity</p>
              <p className="font-sans font-medium text-foreground">LoRaWAN 915MHz</p>
            </Card>
            <Card className="p-6 bg-surface-container-low border-surface-variant">
              <p className="font-jetbrains text-xs text-muted-foreground uppercase tracking-wider mb-2">Power Draw</p>
              <p className="font-sans font-medium text-foreground">150mA / 10uA Sleep</p>
            </Card>
            <Card className="p-6 bg-surface-container-low border-surface-variant">
              <p className="font-jetbrains text-xs text-muted-foreground uppercase tracking-wider mb-2">Protocol</p>
              <p className="font-sans font-medium text-foreground">MQTT v5.0</p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}
