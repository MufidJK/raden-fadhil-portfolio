import {
  extractNumber,
  aggregateTelemetry,
  TELEMETRY_DEFAULTS,
} from "./telemetry-aggregator"

// ─── extractNumber ───────────────────────────────────────────────────────────

describe("extractNumber", () => {
  it("extracts integer from value with unit suffix", () => {
    expect(extractNumber("67 Watt")).toBe(67)
  })

  it("extracts float from voltage string", () => {
    expect(extractNumber("5.00V")).toBe(5.0)
  })

  it("extracts integer from temperature with space and unit", () => {
    expect(extractNumber("45 C")).toBe(45)
  })

  it("takes the FIRST number from an ambiguous string", () => {
    // "3.3V / 5V DC" → first numeric sequence is 3.3
    expect(extractNumber("3.3V / 5V DC")).toBe(3.3)
  })

  it("returns null for an empty string", () => {
    expect(extractNumber("")).toBeNull()
  })

  it("returns null for a string with no digit characters at all", () => {
    expect(extractNumber("abc-xyz")).toBeNull()
  })

  it("extracts the first digit sequence from a mixed alphanumeric string", () => {
    // "ESP32-WROOM" contains "32" — the function correctly extracts it
    expect(extractNumber("ESP32-WROOM")).toBe(32)
  })

  it("extracts integer from plain number string", () => {
    expect(extractNumber("100")).toBe(100)
  })

  it("extracts value preceded by a dash (strips sign, takes magnitude)", () => {
    // "-12.5V" → first digit sequence is 12.5
    expect(extractNumber("-12.5V")).toBe(12.5)
  })

  it("handles strings with parentheses and percentages", () => {
    expect(extractNumber("±1.8% RH")).toBe(1.8)
  })
})

// ─── aggregateTelemetry ──────────────────────────────────────────────────────

describe("aggregateTelemetry", () => {
  it("returns defaults when given an empty array", () => {
    expect(aggregateTelemetry([])).toEqual(TELEMETRY_DEFAULTS)
  })

  it("returns defaults when specs contain no matching keys", () => {
    const specs = [{ Microcontroller: "ESP32", Antenna: "5.8 dBi Omni" }]
    expect(aggregateTelemetry(specs)).toEqual(TELEMETRY_DEFAULTS)
  })

  it("correctly matches and extracts a temperature value (key: 'temp')", () => {
    const specs = [{ Temperature: "55 C" }]
    const result = aggregateTelemetry(specs)
    expect(result.coreTemp).toBe(55)
    // Other categories fall back to defaults
    expect(result.voltageIn).toBe(TELEMETRY_DEFAULTS.voltageIn)
    expect(result.cpuLoad).toBe(TELEMETRY_DEFAULTS.cpuLoad)
  })

  it("correctly matches a temperature value for Indonesian key 'suhu'", () => {
    const specs = [{ Suhu: "70 C" }]
    expect(aggregateTelemetry(specs).coreTemp).toBe(70)
  })

  it("correctly matches and extracts a voltage value (key: 'volt')", () => {
    const specs = [{ "Operating Voltage": "3.3V / 5V DC" }]
    const result = aggregateTelemetry(specs)
    // First number in "3.3V / 5V DC" is 3.3
    expect(result.voltageIn).toBe(3.3)
  })

  it("correctly matches Indonesian voltage key 'tegangan'", () => {
    const specs = [{ Tegangan: "5.00V" }]
    expect(aggregateTelemetry(specs).voltageIn).toBe(5.0)
  })

  it("correctly matches CPU/load key", () => {
    const specs = [{ "CPU Load": "42%" }]
    expect(aggregateTelemetry(specs).cpuLoad).toBe(42)
  })

  it("correctly matches 'usage' key", () => {
    const specs = [{ MemoryUsage: "88" }]
    expect(aggregateTelemetry(specs).cpuLoad).toBe(88)
  })

  it("averages values across multiple projects", () => {
    const specs = [{ Temperature: "50 C" }, { Temperature: "70 C" }]
    expect(aggregateTelemetry(specs).coreTemp).toBe(60)
  })

  it("rounds temperature to nearest integer", () => {
    const specs = [
      { Temperature: "50 C" },
      { Temperature: "51 C" },
      { Temperature: "52 C" },
    ]
    // average = 51
    expect(aggregateTelemetry(specs).coreTemp).toBe(51)
  })

  it("rounds voltage to 2 decimal places", () => {
    const specs = [{ Voltage: "5.001V" }, { Voltage: "5.003V" }]
    // average = 5.002 → toFixed(2) = "5.00" → 5.0
    expect(aggregateTelemetry(specs).voltageIn).toBe(5.0)
  })

  it("falls back to default for a category when all its values are non-numeric", () => {
    // "none" has no digits
    const specs = [{ Temperature: "none" }]
    expect(aggregateTelemetry(specs).coreTemp).toBe(TELEMETRY_DEFAULTS.coreTemp)
  })

  it("skips null/undefined spec objects gracefully", () => {
    // TypeScript would normally prevent null here; test defensive runtime path
    const specs = [null, undefined, { Voltage: "5V" }] as unknown as Record<
      string,
      string
    >[]
    expect(() => aggregateTelemetry(specs)).not.toThrow()
    expect(aggregateTelemetry(specs).voltageIn).toBe(5.0)
  })

  it("handles a realistic Supabase row from the live database", () => {
    const specs = [
      {
        Watt: "67 Watt",
        Microcontroller: "ESP32-WROOM-32D",
        "Operating Voltage": "3.3V / 5V DC",
      },
    ]
    const result = aggregateTelemetry(specs)
    // "Watt" doesn't match temp/volt/cpu patterns → no temp match
    expect(result.coreTemp).toBe(TELEMETRY_DEFAULTS.coreTemp)
    // "Operating Voltage" matches volt pattern → first number = 3.3
    expect(result.voltageIn).toBe(3.3)
    expect(result.cpuLoad).toBe(TELEMETRY_DEFAULTS.cpuLoad)
  })
})
