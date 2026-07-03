"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { Card } from "@/components/ui/card"

function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

export function ThemeSyncWidget() {
  const wheelRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const [state, setState] = React.useState({
    hex: "#12131A", // Initial default
    x: 0,
    y: 0,
    isDragging: false,
  })

  // Initialize center position after mount
  React.useEffect(() => {
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect()
      setState(s => ({ ...s, x: rect.width / 2, y: rect.height / 2 }))
    }
  }, [])

  const updateColor = (clientX: number, clientY: number) => {
    if (!wheelRef.current) return
    const rect = wheelRef.current.getBoundingClientRect()
    const radius = rect.width / 2
    const centerX = rect.left + radius
    const centerY = rect.top + radius

    let dx = clientX - centerX
    let dy = clientY - centerY

    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Constrain to circle
    if (distance > radius) {
      dx = (dx / distance) * radius
      dy = (dy / distance) * radius
    }

    const x = dx + radius
    const y = dy + radius

    // Calculate Hue and Saturation
    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    if (angle < 0) angle += 360
    
    // Saturation based on distance from center
    const saturation = Math.min(100, (distance / radius) * 100)
    
    // Lightness fixed at 50% for vibrant colors
    const hex = hslToHex(angle, saturation, 50)

    setState(s => ({ ...s, x, y, hex }))
    
    // DEVIATION NOTE: The prompt requires us not to mutate document.body.style.backgroundColor.
    // Instead, we scope the tint to our container ref.
    if (containerRef.current) {
      // Apply a subtle tint based on selected color (e.g., 5% opacity)
      containerRef.current.style.backgroundColor = `${hex}1A` // 1A is ~10% opacity
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setState(s => ({ ...s, isDragging: true }))
    updateColor(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (state.isDragging) {
      updateColor(e.clientX, e.clientY)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    setState(s => ({ ...s, isDragging: false }))
  }

  return (
    <Card 
      ref={containerRef}
      className="flex flex-col bg-surface-container-low transition-colors duration-300"
    >
      <div className="flex items-center justify-between p-4 border-b border-surface-variant">
        <h3 className="font-jetbrains text-label-sm font-medium tracking-widest uppercase text-muted-foreground">
          Global Theme Sync
        </h3>
        <Palette className="w-4 h-4 text-muted-foreground" />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div 
          ref={wheelRef}
          className="relative w-48 h-48 rounded-full shadow-inner cursor-crosshair touch-none"
          style={{
            background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)"
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="slider"
          aria-label="Color Wheel"
          aria-valuenow={0}
        >
          {/* Overlay to create saturation gradient from center (white to transparent) */}
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, white, transparent)" }} />
          
          <div 
            className="absolute w-4 h-4 -ml-2 -mt-2 border-2 border-white rounded-full shadow-md pointer-events-none"
            style={{ 
              left: `${state.x}px`, 
              top: `${state.y}px`,
              backgroundColor: state.hex
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between p-4 border-t border-surface-variant">
        <span className="font-jetbrains text-label-sm text-muted-foreground">HEX</span>
        <span className="font-jetbrains text-code font-bold text-foreground">{state.hex}</span>
      </div>
    </Card>
  )
}
