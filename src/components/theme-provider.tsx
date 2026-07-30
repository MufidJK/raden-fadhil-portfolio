"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Suppress the React 19 false-positive: "Encountered a script tag while rendering React component."
 * next-themes v0.4.x intentionally injects an inline <script> to set the theme attribute before
 * the first paint (FOUC prevention). React 19 warns about it even though the script executes
 * correctly during SSR. This filter only runs in dev mode and only targets this exact message.
 *
 * @see https://github.com/pacocoursey/next-themes/issues/316
 */
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag")
    ) {
      return
    }
    originalConsoleError.apply(console, args)
  }
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
