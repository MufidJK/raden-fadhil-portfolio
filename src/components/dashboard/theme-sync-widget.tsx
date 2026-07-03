"use client"

import * as React from "react"
import { Palette } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"

/** Lightness bounds that keep text readable on each theme */
const DARK_LIGHTNESS = 7
const LIGHT_LIGHTNESS = 97

interface ColorData {
  x: number
  y: number
  h: number
  s: number
  l: number
}

interface WidgetState {
  hex: string
  x: number
  y: number
}

function hslToHex(h: number, s: number, l: number): string {
  const lNorm = l / 100
  const a = (s * Math.min(lNorm, 1 - lNorm)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0")
  }
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase()
}

/**
 * Determines the clamped lightness based on theme.
 * Dark mode: 4-8% range (defaults to 7%).
 * Light mode: 95-98% range (defaults to 97%).
 */
function getClampedLightness(theme: string | undefined): number {
  return theme === "light" ? LIGHT_LIGHTNESS : DARK_LIGHTNESS
}

export function ThemeSyncWidget() {
  const wheelRef = React.useRef<HTMLDivElement>(null)
  const dotRef = React.useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  const [state, setState] = React.useState<WidgetState>({
    hex: "#12131A",
    x: 0,
    y: 0,
  })

  const isDragging = React.useRef(false)
  const reqFrame = React.useRef<number | null>(null)

  /** Track the latest resolvedTheme via ref to avoid stale closures in rAF */
  const themeRef = React.useRef(resolvedTheme)
  React.useEffect(() => {
    themeRef.current = resolvedTheme
  }, [resolvedTheme])

  /** Track last chosen hue/saturation so theme toggle can recalibrate */
  const lastHueRef = React.useRef<number | null>(null)
  const lastSatRef = React.useRef<number | null>(null)

  // Initialize center position after mount
  React.useEffect(() => {
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect()
      setState(s => ({ ...s, x: rect.width / 2, y: rect.height / 2 }))
      if (dotRef.current) {
        dotRef.current.style.left = `${rect.width / 2}px`
        dotRef.current.style.top = `${rect.height / 2}px`
      }
    }
  }, [])

  /**
   * When the theme toggles (light↔dark), recalibrate the --background
   * lightness so it doesn't get stuck at 97% in dark mode or 7% in light.
   */
  React.useEffect(() => {
    if (lastHueRef.current === null || lastSatRef.current === null) return
    const lightness = getClampedLightness(resolvedTheme)
    const hue = lastHueRef.current
    const sat = lastSatRef.current
    document.documentElement.style.setProperty(
      "--background",
      `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${lightness}%)`
    )
  }, [resolvedTheme])

  const calculateColor = (clientX: number, clientY: number): ColorData | null => {
    if (!wheelRef.current) return null
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

    // Angle math mapped precisely to standard conic-gradient (0° is top)
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360

    // Saturation based on distance from center
    const saturation = Math.min(100, (distance / radius) * 100)

    return { x, y, h: angle, s: saturation, l: 50 }
  }

  const applyColorUpdate = (clientX: number, clientY: number, syncState: boolean) => {
    if (reqFrame.current !== null) cancelAnimationFrame(reqFrame.current)

    reqFrame.current = requestAnimationFrame(() => {
      const colorData = calculateColor(clientX, clientY)
      if (!colorData) return

      const { x, y, h, s, l } = colorData
      const hex = hslToHex(h, s, l)
      const dotColor = `hsl(${h}, ${s}%, ${l}%)`

      // Update dot DOM directly for real-time zero-latency feedback
      if (dotRef.current) {
        dotRef.current.style.left = `${x}px`
        dotRef.current.style.top = `${y}px`
        dotRef.current.style.backgroundColor = dotColor
      }

      // Persist hue/saturation for theme-toggle recalibration
      lastHueRef.current = h
      lastSatRef.current = s

      // ── Global background sync ──
      // This project uses Tailwind v4 where --background holds a FULL
      // CSS color value (hex or hsl(...)), NOT raw "H S% L%" tokens.
      // We inject `hsl(H, S%, L%)` with lightness clamped for readability.
      const bgLightness = getClampedLightness(themeRef.current)
      document.documentElement.style.setProperty(
        "--background",
        `hsl(${Math.round(h)}, ${Math.round(s)}%, ${bgLightness}%)`
      )

      if (syncState) {
        setState({ hex, x, y })
      }
    })
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.current = true
    applyColorUpdate(e.clientX, e.clientY, true)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      applyColorUpdate(e.clientX, e.clientY, false)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId)
    isDragging.current = false
    applyColorUpdate(e.clientX, e.clientY, true)
  }

  return (
    <Card
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
            background: "conic-gradient(from 0deg, red, yellow, lime, aqua, blue, magenta, red)"
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="slider"
          aria-label="Color Wheel"
          aria-valuenow={0}
        >
          {/* Overlay to create saturation gradient from center (white → transparent) */}
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, white, transparent)" }} />

          <div
            ref={dotRef}
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
