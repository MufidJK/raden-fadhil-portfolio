import * as React from "react"
import { notFound } from "next/navigation"
import { mockProjects } from "@/lib/data/projects"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen bg-background flex flex-col items-center pt-24 pb-12">
      <main className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-12">
        {/* Back Navigation */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-jetbrains text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Systems
        </Link>
        
        {/* Hero Header */}
        <section className="flex flex-col gap-6">
          <Badge variant="outline" className="w-fit font-jetbrains text-xs tracking-widest uppercase bg-surface-variant/20 text-muted-foreground border-surface-variant">
            {project.category}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight text-foreground">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl font-sans text-muted-foreground max-w-3xl leading-relaxed">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            {project.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="font-jetbrains text-sm bg-surface-variant/40 text-foreground">
                {tag}
              </Badge>
            ))}
          </div>
        </section>

        {/* Media Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative aspect-video bg-surface-container-low rounded-xl overflow-hidden border border-surface-variant flex items-center justify-center group cursor-pointer">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center z-20 group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-emerald-400 fill-emerald-400 ml-1" />
            </div>
            <div className="absolute bottom-4 left-4 z-20">
              <p className="font-jetbrains text-sm text-white/80">system_demo.mp4</p>
            </div>
          </div>
          
          <div className="relative aspect-video bg-surface-container-low rounded-xl overflow-hidden border border-surface-variant">
            {/* AI IMAGE GENERATION PROMPT: A photorealistic, hyper-detailed close-up of a custom PCB with glowing LEDs and microcontrollers, dark cinematic lighting, cyberpunk hardware aesthetic, 8k resolution. */}
            <Image
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop"
              alt="Hardware prototype"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </section>

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
