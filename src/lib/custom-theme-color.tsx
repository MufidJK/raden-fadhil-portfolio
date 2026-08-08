"use client"

import * as React from "react"
import { useTheme } from "next-themes"

/** Lightness bounds that keep text readable on each theme */
const DARK_LIGHTNESS = 7
const LIGHT_LIGHTNESS = 97

/**
 * Determines the clamped lightness based on theme.
 * Dark mode: 7%. Light mode: 97%.
 */
export function getClampedLightness(theme: string | undefined): number {
  return theme === "light" ? LIGHT_LIGHTNESS : DARK_LIGHTNESS
}

// ── localStorage keys ──

const LS_HUE_KEY = "custom-theme-hue"
const LS_SAT_KEY = "custom-theme-sat"

function readStoredFloat(key: string): number | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(key)
  if (raw === null) return null
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : null
}

// ── Context ──

interface CustomThemeColorContextValue {
  hue: number | null
  sat: number | null
  setHue: (h: number) => void
  setSat: (s: number) => void
}

const CustomThemeColorContext = React.createContext<CustomThemeColorContextValue>({
  hue: null,
  sat: null,
  setHue: () => {},
  setSat: () => {},
})

export function useCustomThemeColor(): CustomThemeColorContextValue {
  return React.useContext(CustomThemeColorContext)
}

export function CustomThemeColorProvider({ children }: { children: React.ReactNode }) {
  const [hue, setHueState] = React.useState<number | null>(null)
  const [sat, setSatState] = React.useState<number | null>(null)

  // Hydrate from localStorage once on mount
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHueState(readStoredFloat(LS_HUE_KEY))
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSatState(readStoredFloat(LS_SAT_KEY))
  }, [])

  const setHue = React.useCallback((h: number) => {
    setHueState(h)
    localStorage.setItem(LS_HUE_KEY, String(h))
  }, [])

  const setSat = React.useCallback((s: number) => {
    setSatState(s)
    localStorage.setItem(LS_SAT_KEY, String(s))
  }, [])

  const value = React.useMemo(
    () => ({ hue, sat, setHue, setSat }),
    [hue, sat, setHue, setSat]
  )

  return (
    <CustomThemeColorContext.Provider value={value}>
      {children}
    </CustomThemeColorContext.Provider>
  )
}

// ── Headless sync component (renders null) ──

/**
 * Keeps `--background` on `<html>` in sync with the custom hue/saturation
 * and the current light/dark theme.  Mount once in the root layout so it
 * stays active across all routes.
 */
export function ThemeBackgroundSync() {
  const { hue, sat } = useCustomThemeColor()
  const { resolvedTheme } = useTheme()

  React.useEffect(() => {
    if (hue === null || sat === null) return
    const lightness = getClampedLightness(resolvedTheme)
    document.documentElement.style.setProperty(
      "--background",
      `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${lightness}%)`
    )
  }, [hue, sat, resolvedTheme])

  return null
}
