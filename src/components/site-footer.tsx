import * as React from "react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full py-8 mt-16 bg-surface-container-lowest rounded-t-3xl border-t border-border/10">
      <div className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center md:justify-between text-center md:text-left gap-4 md:gap-0">
        
        {/* LEFT COLUMN: Copyright & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="font-jetbrains text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Raden Fadhil Triansyah. Built with Precision.
          </p>
          
          <div className="flex items-center justify-center gap-2 px-2.5 py-0.5 rounded-full border border-border/50 bg-muted/30 w-fit mx-auto sm:mx-0">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
            <span className="text-[11px] font-mono text-muted-foreground">
              System Online - C++ Firmware Active
            </span>
          </div>
        </div>
        
        {/* RIGHT COLUMN: Navigation Links */}
        <div className="flex items-center gap-6">
          <Link href="https://www.linkedin.com/in/raden-fadhil-triansyah-5757a6361/" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs text-muted-foreground hover:text-primary transition-colors">
            LinkedIn
          </Link>
          <Link href="https://github.com/MufidJK/raden-fadhil-portfolio" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs text-muted-foreground hover:text-primary transition-colors">
            GitHub
          </Link>
          <Link href="https://www.instagram.com/biji_tech/" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs text-muted-foreground hover:text-primary transition-colors">
            Instagram
          </Link>
        </div>

      </div>
    </footer>
  )
}
