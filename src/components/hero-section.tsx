import * as React from "react"
import Image from "next/image"
import { Mail, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
        <div className="relative shrink-0 w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-2xl border-4 border-surface-container-low shadow-lg bg-surface-variant">
          {/* Using a placeholder path; user will provide actual image */}
          <Image
            src="/profile.jpg"
            alt="Raden Fadhil Triansyah"
            fill
            className="object-cover"
            priority
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl lg:text-display font-bold font-sans tracking-tight text-foreground">
              Raden Fadhil Triansyah
            </h1>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-jetbrains text-label-sm uppercase tracking-widest text-muted-foreground">
                Hardware Engineer & IoT Developer
              </span>
            </div>
          </div>
          
          <p className="text-body-lg text-foreground max-w-2xl leading-relaxed">
            Architecting robust physical-digital bridges. Specializing in low-latency telemetry, embedded systems, and scalable IoT infrastructures. I build hardware that thinks and software that acts.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <Button className="gap-2 font-medium">
              Contact Me <Mail className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="gap-2 font-medium">
              Resume <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
