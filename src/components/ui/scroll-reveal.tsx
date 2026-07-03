"use client"

import * as React from "react"
import { useEffect, useRef, useState } from "react"

// Hardcode cn-like utility for simplicity, or use standard string concatenation if cn is not available
// We'll just use a simple string concatenation to avoid assuming lib/utils structure
function cx(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number // Optional delay in ms
  trigger?: 'onMount' | 'onScroll'
}

export function ScrollReveal({ children, className, delay = 0, trigger = 'onScroll' }: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false)
  const domRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (trigger === 'onMount') {
      const timer = setTimeout(() => setIsVisible(true), delay)
      return () => clearTimeout(timer)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Set visible immediately or wait for delay
            if (delay > 0) {
              setTimeout(() => {
                setIsVisible(true)
              }, delay)
            } else {
              setIsVisible(true)
            }
            
            // Once it's visible, we can unobserve if we only want to animate once
            if (domRef.current) observer.unobserve(domRef.current)
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" } // Trigger slightly before it fully enters
    )

    const currentRef = domRef.current
    if (currentRef) observer.observe(currentRef)

    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [delay, trigger])

  return (
    <div
      ref={domRef}
      className={cx(
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  )
}
