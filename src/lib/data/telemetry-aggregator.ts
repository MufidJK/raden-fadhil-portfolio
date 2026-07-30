/**
 * Telemetry Aggregator Utility
 *
 * Parses `technical_specs` JSONB objects from Supabase projects and computes
 * average values for Core Temp, Voltage, and CPU Load.
 *
 * Intentionally has zero Supabase/Next.js imports so it can be unit-tested
 * in isolation with no environment variable requirements.
 */

export interface TelemetryAverages {
  /** Average temperature in °C. Default: 74 */
  coreTemp: number
  /** Average voltage in V. Default: 5.00 */
  voltageIn: number
  /** Average CPU/load percentage. Default: 28 */
  cpuLoad: number
}

export const TELEMETRY_DEFAULTS: TelemetryAverages = {
  coreTemp: 74,
  voltageIn: 5.0,
  cpuLoad: 28,
}

// Key-matching patterns (case-insensitive)
const TEMP_KEY_RE = /temp|suhu/i
const VOLT_KEY_RE = /volt|tegangan/i
const CPU_KEY_RE = /cpu|load|usage/i

/**
 * Extracts the first valid floating-point number from a string.
 *
 * Strategy: scan the string for the first sequence that looks like a number
 * (digits, optional dot, optional more digits). This correctly handles:
 * - "67 Watt"         → 67
 * - "5.00V"           → 5.00
 * - "45 C"            → 45
 * - "3.3V / 5V DC"    → 3.3  (takes the first number only)
 * - "-12.5V"          → 12.5 (sign ignored; only absolute magnitudes matter)
 * - ""  / "abc"       → null
 *
 * @param raw - The raw string value from the JSONB column.
 * @returns A finite float, or null if no numeric content is found.
 */
export function extractNumber(raw: string): number | null {
  if (!raw || typeof raw !== "string") return null

  // Match the first sequence of digits (with optional decimal point)
  const match = raw.match(/\d+(\.\d+)?/)
  if (!match) return null

  const parsed = parseFloat(match[0])
  return isFinite(parsed) ? parsed : null
}

/**
 * Computes average telemetry values from an array of `technical_specs` objects.
 *
 * For each project's specs, every key-value pair is tested against the three
 * category patterns. Matched numeric values are collected per category and
 * averaged. Categories with zero valid numbers fall back to defaults.
 *
 * @param allSpecs - Array of `technical_specs` JSONB objects (one per project).
 * @returns Averaged telemetry values with guaranteed fallbacks.
 */
export function aggregateTelemetry(
  allSpecs: Record<string, string>[]
): TelemetryAverages {
  const tempValues: number[] = []
  const voltValues: number[] = []
  const cpuValues: number[] = []

  for (const specs of allSpecs) {
    if (!specs || typeof specs !== "object") continue

    for (const [key, rawValue] of Object.entries(specs)) {
      // Skip non-string values defensively
      const value = typeof rawValue === "string" ? rawValue : String(rawValue ?? "")
      const num = extractNumber(value)
      if (num === null) continue

      if (TEMP_KEY_RE.test(key)) {
        tempValues.push(num)
      } else if (VOLT_KEY_RE.test(key)) {
        voltValues.push(num)
      } else if (CPU_KEY_RE.test(key)) {
        cpuValues.push(num)
      }
    }
  }

  const average = (values: number[]): number | null =>
    values.length === 0 ? null : values.reduce((a, b) => a + b, 0) / values.length

  const avgTemp = average(tempValues)
  const avgVolt = average(voltValues)
  const avgCpu = average(cpuValues)

  return {
    coreTemp:
      avgTemp !== null && isFinite(avgTemp)
        ? Math.round(avgTemp)
        : TELEMETRY_DEFAULTS.coreTemp,
    voltageIn:
      avgVolt !== null && isFinite(avgVolt)
        ? parseFloat(avgVolt.toFixed(2))
        : TELEMETRY_DEFAULTS.voltageIn,
    cpuLoad:
      avgCpu !== null && isFinite(avgCpu)
        ? Math.round(avgCpu)
        : TELEMETRY_DEFAULTS.cpuLoad,
  }
}
