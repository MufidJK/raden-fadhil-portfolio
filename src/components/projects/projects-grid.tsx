import * as React from "react"
import { mockProjects } from "@/lib/data/projects"
import { ProjectsGridClient } from "./projects-grid-client"

export function ProjectsGrid() {
  return (
    <section className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <ProjectsGridClient projects={mockProjects} />
    </section>
  )
}
