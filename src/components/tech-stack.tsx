import * as React from "react"
import { Marquee } from "@/components/ui/marquee"

const technologies = [
  "ESP32",
  "Raspberry Pi",
  "AWS",
  "MQTT",
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Shadcn UI",
  "Framer Motion",
  "Node.js",
  "C++",
]

export function TechStack() {
  return (
    <section id="tech-stack" className="w-full overflow-hidden py-12 bg-background border-y border-border">
      <div className="container mx-auto px-4 max-w-[100vw] overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-bold font-sans tracking-tight text-foreground text-center mb-8">
          Core Technologies
        </h2>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:30s] w-full max-w-full overflow-hidden">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="flex items-center justify-center px-6 py-3 rounded-full bg-surface-container border border-border shrink-0"
              >
                <span className="font-jetbrains font-medium text-sm md:text-base whitespace-nowrap text-foreground">
                  {tech}
                </span>
              </div>
            ))}
          </Marquee>
          
          <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-1/4 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-1/4 bg-gradient-to-l from-background to-transparent z-10"></div>
        </div>
      </div>
    </section>
  )
}
