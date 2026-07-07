import * as React from "react"
import { Mail } from "lucide-react"
import { ContactForm } from "./contact-form"

export function ContactSection() {
  return (
    <section id="contact" className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* COLUMN 1: DIRECT CONTACT INFO */}
        <div className="flex flex-col gap-8 lg:sticky lg:top-32">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-sans tracking-tight text-foreground">
              Let&apos;s Connect.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
              Interested in low-latency systems, IoT integrations, or custom hardware architectures? Drop a message.
            </p>
          </div>
          
          <div className="flex flex-col gap-6 mt-4">
            {/* Direct Links List */}
            <a 
              href="mailto:radenfadhiltriansyah99@gmail.com" 
              className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <span className="font-medium">radenfadhiltriansyah99@gmail.com</span>
            </a>
            
            <a 
              href="https://www.linkedin.com/in/raden-fadhil-triansyah-5757a6361/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted/50 border border-border/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </div>
              <span className="font-medium">linkedin.com/in/raden-fadhil-triansyah</span>
            </a>
          </div>
        </div>

        {/* COLUMN 2: THE INTERACTIVE FORM */}
        <div className="w-full">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
