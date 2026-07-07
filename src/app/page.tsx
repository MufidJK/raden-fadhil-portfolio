import * as React from "react"
import { TopNavBar } from "@/components/top-nav-bar"
import { HeroSection } from "@/components/hero-section"
import { HardwareCapabilities } from "@/components/hardware-capabilities"
import { ThemeSyncWidget } from "@/components/dashboard/theme-sync-widget"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { ContactSection } from "@/components/contact-section"
import { SiteFooter } from "@/components/site-footer"
import TelemetryWidget from "@/components/dashboard/telemetry-widget-loader"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center overflow-x-hidden">
      <TopNavBar />
      
      <main className="flex-1 w-full flex flex-col pt-16">
        {/* SECTION 1: Hero Section */}
        <HeroSection />
        
        {/* SECTION 2: Hardware Capabilities */}
        <ScrollReveal>
          <HardwareCapabilities />
        </ScrollReveal>
        
        {/* SECTION 3: System Dashboard */}
        <ScrollReveal>
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
        </ScrollReveal>


        {/* SECTION 5: Architecture & Builds */}
        <ScrollReveal>
          <section id="projects" className="py-12">
            <ProjectsGrid />
          </section>
        </ScrollReveal>

        {/* SECTION 6: Contact & Footer */}
        {/* SECTION 6: Contact Section */}
        <ScrollReveal>
          <ContactSection />
        </ScrollReveal>

      </main>
      
      <SiteFooter />
    </div>
  )
}
