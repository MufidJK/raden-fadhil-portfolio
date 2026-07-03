import * as React from "react"
import { TopNavBar } from "@/components/top-nav-bar"
import { HeroSection } from "@/components/hero-section"
import { TechStack } from "@/components/tech-stack"
import { ThemeSyncWidget } from "@/components/dashboard/theme-sync-widget"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { AboutMe } from "@/components/about-me"
import { ContactForm } from "@/components/contact-form"
import { SiteFooter } from "@/components/site-footer"
import TelemetryWidget from "@/components/dashboard/telemetry-widget-loader"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center overflow-x-hidden">
      <TopNavBar />
      
      <main className="flex-1 w-full flex flex-col">
        {/* SECTION 1: Hero Section */}
        <HeroSection />
        
        {/* SECTION 2: Tech Stack */}
        <ScrollReveal>
          <TechStack />
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

        {/* SECTION 4: About Me */}
        <ScrollReveal>
          <AboutMe />
        </ScrollReveal>
        
        {/* SECTION 5: Architecture & Builds */}
        <ScrollReveal>
          <section id="projects" className="py-12">
            <ProjectsGrid />
          </section>
        </ScrollReveal>

        {/* SECTION 6: Contact & Footer */}
        <ScrollReveal>
          <section id="contact" className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
               <div>
                 <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground mb-4">
                   Let's Connect
                 </h2>
                 <p className="text-muted-foreground mb-6 font-jetbrains">
                   Interested in low-latency systems, IoT integrations, or modern web architectures? Let's build something together.
                 </p>
                 <a href="/cv.pdf" download className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                   Download CV
                 </a>
               </div>
               <ContactForm />
             </div>
          </section>
        </ScrollReveal>

      </main>
      
      <SiteFooter />
    </div>
  )
}
