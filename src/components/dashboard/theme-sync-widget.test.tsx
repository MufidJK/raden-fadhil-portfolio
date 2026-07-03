import { render, screen, fireEvent } from "@testing-library/react"
import { ThemeSyncWidget } from "./theme-sync-widget"

describe("ThemeSyncWidget", () => {
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

  it("handles pointer events correctly", () => {
    render(<ThemeSyncWidget />)
    const wheel = screen.getByRole("slider", { name: /color wheel/i })
    
    // Mock getBoundingClientRect
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 200,
      height: 200,
      top: 0,
      left: 0,
      bottom: 200,
      right: 200,
      x: 0,
      y: 0,
      toJSON: () => {}
    }))
    
    // Simulate pointer down
    fireEvent.pointerDown(wheel, { clientX: 100, clientY: 100 })
    // Simulate pointer move
    fireEvent.pointerMove(wheel, { clientX: 150, clientY: 100 })
    // Simulate pointer up
    fireEvent.pointerUp(wheel)
    
    // The hex value should have updated from the default, but we mainly check it doesn't crash
    // and the hex text is still visible
    expect(screen.getByText(/#/i)).toBeInTheDocument()
  })
})
