import * as React from "react"
import { fetchProjects, fallbackProjects } from "@/lib/data/projects"
import { ProjectsGridClient } from "./projects-grid-client"

export async function ProjectsGrid() {
  const fetchedProjects = await fetchProjects()
  const activeProjects =
    fetchedProjects.length > 0 ? fetchedProjects : fallbackProjects

  return (
    <section className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <ProjectsGridClient projects={activeProjects} />
    </section>
  )
}
