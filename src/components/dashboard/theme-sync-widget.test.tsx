import { render, screen, fireEvent, act } from "@testing-library/react"
import { ThemeSyncWidget } from "./theme-sync-widget"

// Mutable theme state for dynamic theme switching in tests
let mockResolvedTheme = "dark"

jest.mock("next-themes", () => ({
  useTheme: () => ({
    resolvedTheme: mockResolvedTheme,
  }),
}))

/**
 * Helper: mock getBoundingClientRect to simulate a 200×200 wheel at (0, 0).
 */
function mockWheelRect() {
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 200,
    height: 200,
    top: 0,
    left: 0,
    bottom: 200,
    right: 200,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }))
}

describe("ThemeSyncWidget", () => {
  beforeEach(() => {
    document.documentElement.style.cssText = ""
    mockResolvedTheme = "dark"
    jest.restoreAllMocks()
    jest.spyOn(window, "requestAnimationFrame").mockImplementation(
      (cb: FrameRequestCallback) => {
        cb(0)
        return 0
      }
    )
    mockWheelRect()
  })

  it("renders the widget title and hex label", () => {
    render(<ThemeSyncWidget />)
    expect(screen.getByText(/global theme sync/i)).toBeInTheDocument()
    expect(screen.getByText(/hex/i)).toBeInTheDocument()
  })

  it("renders the color wheel slider", () => {
    render(<ThemeSyncWidget />)
    const wheel = screen.getByRole("slider", { name: /color wheel/i })
    expect(wheel).toBeInTheDocument()
  })

  it("sets --background with hsl() format and 7% lightness in dark mode on pointer down", () => {
    render(<ThemeSyncWidget />)
    const wheel = screen.getByRole("slider", { name: /color wheel/i })

    fireEvent.pointerDown(wheel, { clientX: 150, clientY: 100 })

    const bgVar = document.documentElement.style.getPropertyValue("--background")
    expect(bgVar).not.toBe("")
    // Must be full hsl(...) format with 7% lightness for dark mode
    expect(bgVar).toMatch(/^hsl\(\d+, \d+%, 7%\)$/)
  })

  it("sets --background with hsl() format and 97% lightness in light mode", () => {
    mockResolvedTheme = "light"
    render(<ThemeSyncWidget />)
    const wheel = screen.getByRole("slider", { name: /color wheel/i })

    fireEvent.pointerDown(wheel, { clientX: 150, clientY: 100 })

    const bgVar = document.documentElement.style.getPropertyValue("--background")
    expect(bgVar).toMatch(/^hsl\(\d+, \d+%, 97%\)$/)
  })

  it("updates --background on pointer move during drag", () => {
    render(<ThemeSyncWidget />)
    const wheel = screen.getByRole("slider", { name: /color wheel/i })

    fireEvent.pointerDown(wheel, { clientX: 150, clientY: 100 })
    const firstBg = document.documentElement.style.getPropertyValue("--background")

    fireEvent.pointerMove(wheel, { clientX: 100, clientY: 150 })
    const secondBg = document.documentElement.style.getPropertyValue("--background")

    // Values should change after moving to a different position
    expect(secondBg).not.toBe(firstBg)
    expect(secondBg).toMatch(/^hsl\(\d+, \d+%, 7%\)$/)
  })

  it("does not crash on pointer up and displays hex value", () => {
    render(<ThemeSyncWidget />)
    const wheel = screen.getByRole("slider", { name: /color wheel/i })

    fireEvent.pointerDown(wheel, { clientX: 150, clientY: 100 })
    fireEvent.pointerUp(wheel)

    expect(screen.getByText(/#/i)).toBeInTheDocument()
  })

  it("recalibrates lightness when theme changes after a color was selected", () => {
    const { rerender } = render(<ThemeSyncWidget />)
    const wheel = screen.getByRole("slider", { name: /color wheel/i })

    // Select a color in dark mode
    fireEvent.pointerDown(wheel, { clientX: 150, clientY: 100 })
    const darkBg = document.documentElement.style.getPropertyValue("--background")
    expect(darkBg).toMatch(/7%\)$/)

    // Switch to light mode and re-render
    mockResolvedTheme = "light"
    act(() => {
      rerender(<ThemeSyncWidget />)
    })

    // The useEffect watching resolvedTheme should recalibrate
    const lightBg = document.documentElement.style.getPropertyValue("--background")
    expect(lightBg).toMatch(/97%\)$/)
  })
})
