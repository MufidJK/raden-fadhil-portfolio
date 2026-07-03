import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function AboutMe() {
  return (
    <section id="about" className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground">
            About Me
          </h2>
          <div className="space-y-4 font-jetbrains text-muted-foreground text-sm md:text-base leading-relaxed">
            <p>
              I am a Hardware Engineer and IoT Developer with a relentless focus on building low-latency, high-performance systems. My expertise spans embedded C++, real-time telemetry architectures, and modern web applications designed to monitor physical hardware at scale.
            </p>
            <p>
              Whether it's writing robust firmware for an ESP32 or architecting a Next.js dashboard to visualize thousands of data points per second, I bridge the gap between the physical and digital worlds. I believe in strict typing, zero-latency rendering, and bulletproof security.
            </p>
          </div>
          <div className="flex items-center gap-4 pt-4">
            <Button asChild variant="default">
              <Link href="https://github.com/radenfadhil" target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="https://linkedin.com/in/radenfadhil" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="relative aspect-square w-full max-w-md mx-auto hidden md:block rounded-2xl overflow-hidden bg-surface-container border border-border">
          {/* We use a simple placeholder pattern for the about image to keep it clean */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-border/50 to-transparent opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-jetbrains text-4xl">
            {"{ /> }"}
          </div>
        </div>
      </div>
    </section>
  )
}
