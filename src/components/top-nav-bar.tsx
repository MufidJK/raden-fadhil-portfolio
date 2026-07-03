import * as React from "react"
import Link from "next/link"
import { ThemeToggleButton } from "./theme-toggle-button"

export function TopNavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container">
      <div className="container mx-auto flex h-16 max-w-container-max items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-sans text-lg font-bold tracking-tight text-foreground uppercase">
              Raden Fadhil
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#projects" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Projects
          </Link>
          <Link href="#skills" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Skills
          </Link>
          <Link href="#dashboard" className="text-sm font-bold text-foreground border-b-2 border-primary py-1 transition-colors">
            Dashboard
          </Link>
          <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggleButton />
        </div>
      </div>
    </header>
  )
}
