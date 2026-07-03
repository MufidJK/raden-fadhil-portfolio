import * as React from "react"

import { TopNavBar } from "@/components/top-nav-bar"
import { HeroSection } from "@/components/hero-section"
import { ThemeSyncWidget } from "@/components/dashboard/theme-sync-widget"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { SiteFooter } from "@/components/site-footer"
import TelemetryWidget from "@/components/dashboard/telemetry-widget-loader"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <TopNavBar />
      
      <main className="flex-1 w-full flex flex-col">
        <HeroSection />
        
        <section id="dashboard" className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground">
              System Dashboard
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-4 w-full">
                <ThemeSyncWidget />
              </div>
              <div className="lg:col-span-8 w-full">
                <TelemetryWidget />
              </div>
            </div>
          </div>
        </section>
        
        <section id="projects">
          <ProjectsGrid />
        </section>
      </main>
      
      <SiteFooter />
    </div>
  )
}
