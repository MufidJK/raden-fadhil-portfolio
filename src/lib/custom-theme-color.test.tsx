import * as React from "react"
import { render, act } from "@testing-library/react"
import {
  CustomThemeColorProvider,
  useCustomThemeColor,
  getClampedLightness,
  ThemeBackgroundSync,
} from "./custom-theme-color"

// Mutable theme state for dynamic theme switching in tests
let mockResolvedTheme = "dark"

jest.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: mockResolvedTheme }),
}))

/** Test helper that exposes the context value via a captured ref */
function TestConsumer({
  onRender,
}: {
  onRender: (ctx: ReturnType<typeof useCustomThemeColor>) => void
}) {
  const ctx = useCustomThemeColor()
  onRender(ctx)
  return null
}

// ── getClampedLightness ──

describe("getClampedLightness", () => {
  it("returns 7 for dark theme", () => {
    expect(getClampedLightness("dark")).toBe(7)
  })

  it("returns 97 for light theme", () => {
    expect(getClampedLightness("light")).toBe(97)
  })

  it("returns 7 for undefined theme (defaults to dark)", () => {
    expect(getClampedLightness(undefined)).toBe(7)
  })
})

// ── CustomThemeColorProvider ──

describe("CustomThemeColorProvider", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("provides null hue/sat by default", () => {
    let captured: ReturnType<typeof useCustomThemeColor> | undefined
    render(
      <CustomThemeColorProvider>
        <TestConsumer
          onRender={(ctx) => {
            captured = ctx
          }}
        />
      </CustomThemeColorProvider>
    )
    expect(captured?.hue).toBeNull()
    expect(captured?.sat).toBeNull()
  })

  it("updates hue/sat and persists to localStorage", () => {
    let captured: ReturnType<typeof useCustomThemeColor> | undefined
    render(
      <CustomThemeColorProvider>
        <TestConsumer
          onRender={(ctx) => {
            captured = ctx
          }}
        />
      </CustomThemeColorProvider>
    )
    act(() => {
      captured?.setHue(120)
      captured?.setSat(50)
    })
    expect(captured?.hue).toBe(120)
    expect(captured?.sat).toBe(50)
    expect(localStorage.getItem("custom-theme-hue")).toBe("120")
    expect(localStorage.getItem("custom-theme-sat")).toBe("50")
  })

  it("hydrates from localStorage on mount", () => {
    localStorage.setItem("custom-theme-hue", "200")
    localStorage.setItem("custom-theme-sat", "75")

    let captured: ReturnType<typeof useCustomThemeColor> | undefined
    render(
      <CustomThemeColorProvider>
        <TestConsumer
          onRender={(ctx) => {
            captured = ctx
          }}
        />
      </CustomThemeColorProvider>
    )

    // After the hydration useEffect fires
    act(() => {})
    expect(captured?.hue).toBe(200)
    expect(captured?.sat).toBe(75)
  })
})

// ── ThemeBackgroundSync ──

describe("ThemeBackgroundSync", () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.style.removeProperty("--background")
    mockResolvedTheme = "dark"
  })

  it("does not set --background when hue/sat are null", () => {
    render(
      <CustomThemeColorProvider>
        <ThemeBackgroundSync />
      </CustomThemeColorProvider>
    )
    expect(
      document.documentElement.style.getPropertyValue("--background")
    ).toBe("")
  })

  it("sets --background when hue/sat are available", () => {
    let captured: ReturnType<typeof useCustomThemeColor> | undefined
    render(
      <CustomThemeColorProvider>
        <TestConsumer
          onRender={(ctx) => {
            captured = ctx
          }}
        />
        <ThemeBackgroundSync />
      </CustomThemeColorProvider>
    )
    act(() => {
      captured?.setHue(240)
      captured?.setSat(30)
    })
    const bg = document.documentElement.style.getPropertyValue("--background")
    expect(bg).toBe("hsl(240, 30%, 7%)")
  })

  it("recalibrates to light lightness when theme switches to light", () => {
    let captured: ReturnType<typeof useCustomThemeColor> | undefined
    const { rerender } = render(
      <CustomThemeColorProvider>
        <TestConsumer
          onRender={(ctx) => {
            captured = ctx
          }}
        />
        <ThemeBackgroundSync />
      </CustomThemeColorProvider>
    )
    act(() => {
      captured?.setHue(120)
      captured?.setSat(40)
    })
    expect(
      document.documentElement.style.getPropertyValue("--background")
    ).toBe("hsl(120, 40%, 7%)")

    // Switch to light mode
    mockResolvedTheme = "light"
    act(() => {
      rerender(
        <CustomThemeColorProvider>
          <TestConsumer
            onRender={(ctx) => {
              captured = ctx
            }}
          />
          <ThemeBackgroundSync />
        </CustomThemeColorProvider>
      )
    })
    expect(
      document.documentElement.style.getPropertyValue("--background")
    ).toBe("hsl(120, 40%, 97%)")
  })
})
