import * as React from "react"
import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="w-full py-8 mt-16 bg-surface-container-lowest rounded-t-3xl">
      <div className="container mx-auto max-w-container-max px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-jetbrains text-xs text-muted-foreground">
          © 2024 Raden Fadhil Triansyah. Built with Precision.
        </p>
        
        <div className="flex items-center gap-6">
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs text-muted-foreground hover:text-foreground transition-colors">
            LinkedIn
          </Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs text-muted-foreground hover:text-foreground transition-colors">
            GitHub
          </Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="font-jetbrains text-xs text-muted-foreground hover:text-foreground transition-colors">
            Source
          </Link>
        </div>
      </div>
    </footer>
  )
}
