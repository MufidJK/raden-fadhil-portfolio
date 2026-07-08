import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function HeroSection() {
  return (
    <section className="min-h-[calc(100dvh-4rem)] flex items-center py-16 md:py-24 mb-[20vh]">
      <div className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <ScrollReveal trigger="onMount" className="relative shrink-0 w-48 h-48 md:w-64 md:h-64 overflow-hidden rounded-2xl border-4 border-surface-container-low shadow-lg bg-surface-variant">
            {/* AI IMAGE GENERATION PROMPT: A highly cinematic, photorealistic portrait of an elite hardware engineer, cyberpunk and modern IoT aesthetic, dark theme, sleek workspace with blurred circuit boards and glowing telemetry screens in the background, dramatic lighting, 8k, highly detailed. */}
            {/* TODO: Ensure /profile.webp exists in the /public directory. Using placeholder URL temporarily. */}
            <Image
              src="https://github.com/shadcn.png"
              alt="Raden Fadhil Triansyah"
              fill
              className="object-cover"
              unoptimized
              priority
            />
        </ScrollReveal>
        
        <ScrollReveal trigger="onMount" delay={200} className="flex flex-col gap-4 w-full md:flex-1">
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
          
          <p className="text-body-lg text-foreground w-full max-w-prose leading-relaxed">
            Architecting robust physical-digital bridges. Specializing in low-latency telemetry, embedded systems, and scalable IoT infrastructures. I build hardware that thinks and software that acts.
          </p>

          <div className="flex flex-col md:flex-row w-full sm:w-auto items-stretch sm:items-center gap-4 mt-2">
            <Button asChild className="w-full sm:w-auto font-medium dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-colors">
              <Link href="#projects">View Projects</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto font-medium">
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>
        </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
