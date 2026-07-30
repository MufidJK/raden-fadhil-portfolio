import { render, screen } from "@testing-library/react"
import TelemetryWidgetServer from "./telemetry-widget-server"
import { TELEMETRY_DEFAULTS } from "@/lib/data/telemetry-aggregator"

// ─── Module mocks ─────────────────────────────────────────────────────────────

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}))

jest.mock("@/lib/data/telemetry-aggregator", () => ({
  ...jest.requireActual("@/lib/data/telemetry-aggregator"),
  aggregateTelemetry: jest.fn(),
}))

jest.mock("./telemetry-widget-loader", () => {
  return function MockTelemetryWidgetLoader(props: any) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const TelemetryWidget = require("./telemetry-widget").default
    return <TelemetryWidget {...props} />
  }
})

// ─── Typed mock helpers ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { supabase } = require("@/lib/supabase") as {
  supabase: { from: jest.Mock }
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { aggregateTelemetry } = require("@/lib/data/telemetry-aggregator") as {
  aggregateTelemetry: jest.Mock
}

/** Builds a fully chainable Supabase mock for `.from().select()` */
function mockSupabaseSelect(
  result: { data: unknown; error: { message: string } | null }
) {
  const selectMock = jest.fn().mockResolvedValue(result)
  supabase.from.mockReturnValue({ select: selectMock })
  return selectMock
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("TelemetryWidgetServer", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("passes aggregated averages to TelemetryWidget on success", async () => {
    mockSupabaseSelect({
      data: [
        { technical_specs: { Temperature: "50 C", Voltage: "5V" } },
      ],
      error: null,
    })
    aggregateTelemetry.mockReturnValue({
      coreTemp: 50,
      voltageIn: 5.0,
      cpuLoad: 28,
    })

    const Component = await TelemetryWidgetServer()
    render(Component)

    expect(screen.getByText("50°C")).toBeInTheDocument()
    expect(screen.getByText("5.00V")).toBeInTheDocument()
    expect(screen.getByText("28%")).toBeInTheDocument()
    expect(aggregateTelemetry).toHaveBeenCalledTimes(1)
  })

  it("falls back to TELEMETRY_DEFAULTS when Supabase returns an error", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    mockSupabaseSelect({
      data: null,
      error: { message: "connection refused" },
    })

    const Component = await TelemetryWidgetServer()
    render(Component)

    expect(screen.getByText(`${TELEMETRY_DEFAULTS.coreTemp}°C`)).toBeInTheDocument()
    expect(screen.getByText(`${TELEMETRY_DEFAULTS.voltageIn.toFixed(2)}V`)).toBeInTheDocument()
    expect(screen.getByText(`${TELEMETRY_DEFAULTS.cpuLoad}%`)).toBeInTheDocument()
    expect(aggregateTelemetry).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it("falls back to TELEMETRY_DEFAULTS when data is empty", async () => {
    mockSupabaseSelect({ data: [], error: null })

    const Component = await TelemetryWidgetServer()
    render(Component)

    expect(screen.getByText(`${TELEMETRY_DEFAULTS.coreTemp}°C`)).toBeInTheDocument()
    expect(aggregateTelemetry).not.toHaveBeenCalled()
  })

  it("falls back to TELEMETRY_DEFAULTS when an unexpected error is thrown", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    supabase.from.mockImplementation(() => {
      throw new Error("Network failure")
    })

    const Component = await TelemetryWidgetServer()
    render(Component)

    expect(screen.getByText(`${TELEMETRY_DEFAULTS.coreTemp}°C`)).toBeInTheDocument()
    expect(consoleSpy).toHaveBeenCalledWith(
      "[TelemetryWidgetServer] Unexpected error:",
      "Network failure"
    )

    consoleSpy.mockRestore()
  })

  it("filters out null technical_specs rows before aggregating", async () => {
    mockSupabaseSelect({
      data: [
        { technical_specs: null },
        { technical_specs: { Temperature: "60 C" } },
      ],
      error: null,
    })
    aggregateTelemetry.mockReturnValue({
      coreTemp: 60,
      voltageIn: TELEMETRY_DEFAULTS.voltageIn,
      cpuLoad: TELEMETRY_DEFAULTS.cpuLoad,
    })

    await TelemetryWidgetServer()

    // aggregateTelemetry should be called with only the non-null spec
    expect(aggregateTelemetry).toHaveBeenCalledWith([{ Temperature: "60 C" }])
  })
})
