import { render, screen } from "@testing-library/react"
import TelemetryWidget from "./telemetry-widget"

describe("TelemetryWidget", () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("renders the widget title and live badge", () => {
    render(<TelemetryWidget />)
    expect(screen.getByText(/hardware telemetry/i)).toBeInTheDocument()
    expect(screen.getByText(/live/i)).toBeInTheDocument()
  })

  it("renders all three metrics columns", () => {
    render(<TelemetryWidget />)
    expect(screen.getByText(/core temp/i)).toBeInTheDocument()
    expect(screen.getByText(/voltage in/i)).toBeInTheDocument()
    expect(screen.getByText(/cpu load/i)).toBeInTheDocument()
  })

  it("renders footer statistics", () => {
    render(<TelemetryWidget />)
    expect(screen.getByText(/polling rate: 100ms/i)).toBeInTheDocument()
    expect(screen.getByText(/status: nominal/i)).toBeInTheDocument()
    expect(screen.getByText(/uptime: 4d 12h/i)).toBeInTheDocument()
  })

  it("cleans up interval on unmount", () => {
    const { unmount } = render(<TelemetryWidget />)
    const clearIntervalSpy = jest.spyOn(global, "clearInterval")
    unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
  })
})
