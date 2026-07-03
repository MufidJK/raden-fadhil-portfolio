import * as React from "react"
import { ArrowUpRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/lib/data/projects"
import Link from "next/link"

export type ProjectCardProps = Project

export function ProjectCard({ id, title, description, tags, size, link }: ProjectCardProps) {
  const isWide = size === "wide"
  
  return (
    <Link href={link} className={`group ${isWide ? "md:col-span-8" : "md:col-span-4"}`}>
      <Card className="relative flex flex-col justify-between p-6 bg-surface-container-low hover:bg-surface-container transition-colors duration-300 border-surface-variant cursor-pointer h-full">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="font-jetbrains text-[10px] tracking-widest uppercase rounded-sm bg-surface-variant/50 text-muted-foreground border-transparent">
              {id}
            </Badge>
            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          
          <div className="flex flex-col gap-2 mt-2">
            <h3 className="font-sans text-xl font-bold text-foreground">
              {title}
            </h3>
            <p className="font-sans text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map(tag => (
            <Badge key={tag} variant="outline" className="font-jetbrains text-[10px] bg-surface-variant/20 text-muted-foreground border-surface-variant rounded-sm">
              {tag}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  )
}

