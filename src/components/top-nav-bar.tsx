import * as React from "react"
import Link from "next/link"
import { ThemeToggleButton } from "./theme-toggle-button"
import { MobileNav } from "./mobile-nav"
export function TopNavBar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-container-max items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-sans text-lg font-bold tracking-tight text-foreground uppercase">
              Raden Fadhil
            </span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#projects" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-emerald-500 after:transition-transform hover:after:scale-x-100">
            Projects
          </Link>
          <Link href="#skills" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-emerald-500 after:transition-transform hover:after:scale-x-100">
            Skills
          </Link>
          <Link href="#dashboard" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-emerald-500 after:transition-transform hover:after:scale-x-100">
            Dashboard
          </Link>
          <Link href="#contact" className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-emerald-500 after:transition-transform hover:after:scale-x-100">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggleButton />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  )
}
