"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLinkClick = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={isOpen ? "Close Menu" : "Open Menu"}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full flex flex-col bg-background/95 backdrop-blur-md border-b border-border/40"
          >
            <nav className="flex flex-col">
              <Link
                href="/#about"
                onClick={handleLinkClick}
                className="py-4 px-6 text-lg font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Skills
              </Link>
              <Link
                href="/#dashboard"
                onClick={handleLinkClick}
                className="py-4 px-6 text-lg font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/#projects"
                onClick={handleLinkClick}
                className="py-4 px-6 text-lg font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/#contact"
                onClick={handleLinkClick}
                className="py-4 px-6 text-lg font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
