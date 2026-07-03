import * as React from "react"
import { FilterTabs } from "./filter-tabs"
import { ProjectCard, ProjectCardProps } from "./project-card"

const projects: ProjectCardProps[] = [
  {
    id: "REPTILE_NODE_V2",
    title: "Terrarium Climate Controller v2",
    description: "Closed-loop PID control system for maintaining micro-climates. Features dual ESP32 nodes, LoRa mesh networking, and sub-millimeter precision humidity sensing.",
    tags: ["C++", "ESP-IDF", "MQTT"],
    size: "wide",
  },
  {
    id: "HEX_GAIT_01",
    title: "Hexapod Gait Engine",
    description: "Inverse kinematics solver running on an RTOS environment for a 18-DOF robotic platform.",
    tags: ["ROS2", "Python"],
    size: "medium",
  },
  {
    id: "PWR_RACK",
    title: "Smart Power Rack",
    description: "Per-outlet power monitoring and remote switching for a 42U homelab rack.",
    tags: ["KiCad", "FreeRTOS"],
    size: "medium",
  },
  {
    id: "LAB_DASH",
    title: "Homelab Dashboard UI",
    description: "A centralized, high-performance web dashboard integrating Grafana panels, Proxmox API metrics, and custom hardware sensor data via WebSockets.",
    tags: ["React", "Tailwind", "WebSocket"],
    size: "wide",
  },
]

export function ProjectsGrid() {
  return (
    <section className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground">
          Architecture & Builds
        </h2>
        <FilterTabs />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {projects.map(project => (
          <ProjectCard key={project.id} {...project} />
        ))}
      </div>
    </section>
  )
}
