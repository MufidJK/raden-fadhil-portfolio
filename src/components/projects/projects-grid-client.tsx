"use client"

import * as React from "react"
import { FilterTabs } from "./filter-tabs"
import { ProjectCard } from "./project-card"
import { Project } from "@/lib/data/projects"

interface ProjectsGridClientProps {
  projects: Project[]
}

export function ProjectsGridClient({ projects }: ProjectsGridClientProps) {
  const [activeTab, setActiveTab] = React.useState("All")

  const categories = React.useMemo(() => {
    const cats = projects.map(p => p.category)
    return ["All", ...Array.from(new Set(cats))]
  }, [projects])

  const filteredProjects = activeTab === "All" 
    ? projects 
    : projects.filter(p => p.category === activeTab)

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground">
          Architecture & Builds
        </h2>
        <FilterTabs tabs={categories} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {filteredProjects.map(project => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </>
  )
}
