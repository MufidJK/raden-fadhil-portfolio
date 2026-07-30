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

  // ─── Seed prop tests ──────────────────────────────────────────────────────

  it("displays default seed values when no props are passed", () => {
    render(<TelemetryWidget />)
    expect(screen.getByText("74°C")).toBeInTheDocument()
    expect(screen.getByText("5.00V")).toBeInTheDocument()
    expect(screen.getByText("28%")).toBeInTheDocument()
  })

  it("displays the initialCoreTemp seed value on first render", () => {
    render(<TelemetryWidget initialCoreTemp={55} />)
    expect(screen.getByText("55°C")).toBeInTheDocument()
  })

  it("displays the initialVoltageIn seed value on first render", () => {
    render(<TelemetryWidget initialVoltageIn={3.3} />)
    expect(screen.getByText("3.30V")).toBeInTheDocument()
  })

  it("displays the initialCpuLoad seed value on first render", () => {
    render(<TelemetryWidget initialCpuLoad={42} />)
    expect(screen.getByText("42%")).toBeInTheDocument()
  })

  it("applies red color class when initialCoreTemp is above 75", () => {
    render(<TelemetryWidget initialCoreTemp={80} />)
    // The bar divs use the colorClass; target the first one with bg-red-500
    const redBars = document.querySelectorAll(".bg-red-500")
    expect(redBars.length).toBeGreaterThan(0)
  })

  it("applies yellow color class when initialCoreTemp is between 60 and 75", () => {
    render(<TelemetryWidget initialCoreTemp={65} />)
    const yellowBars = document.querySelectorAll(".bg-yellow-500")
    expect(yellowBars.length).toBeGreaterThan(0)
  })

  it("applies green color class when initialCoreTemp is 60 or below", () => {
    render(<TelemetryWidget initialCoreTemp={45} />)
    const greenBars = document.querySelectorAll(".bg-emerald-500")
    expect(greenBars.length).toBeGreaterThan(0)
  })
})
