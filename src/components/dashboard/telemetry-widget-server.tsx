import * as React from "react"
import { supabase } from "@/lib/supabase"
import { aggregateTelemetry, TELEMETRY_DEFAULTS } from "@/lib/data/telemetry-aggregator"
import TelemetryWidgetLoader from "./telemetry-widget-loader"

/**
 * Async Server Component that fetches `technical_specs` from all Supabase
 * projects, aggregates them into averaged telemetry values, and passes the
 * computed seeds down to the client-side TelemetryWidget.
 *
 * On any fetch error the component falls back to TELEMETRY_DEFAULTS so the
 * widget always renders, never crashes.
 */
export default async function TelemetryWidgetServer() {
  let coreTemp = TELEMETRY_DEFAULTS.coreTemp
  let voltageIn = TELEMETRY_DEFAULTS.voltageIn
  let cpuLoad = TELEMETRY_DEFAULTS.cpuLoad

  try {
    const { data, error } = await supabase
      .from("projects")
      .select("technical_specs")

    if (error) {
      console.error(
        "[TelemetryWidgetServer] Supabase query failed:",
        error.message
      )
    } else if (data && data.length > 0) {
      const specs = (
        data as { technical_specs: Record<string, string> | null }[]
      )
        .map((row) => row.technical_specs)
        .filter((s): s is Record<string, string> => !!s && typeof s === "object")

      const averages = aggregateTelemetry(specs)
      coreTemp = averages.coreTemp
      voltageIn = averages.voltageIn
      cpuLoad = averages.cpuLoad
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[TelemetryWidgetServer] Unexpected error:", message)
  }

  return (
    <TelemetryWidgetLoader
      initialCoreTemp={coreTemp}
      initialVoltageIn={voltageIn}
      initialCpuLoad={cpuLoad}
    />
  )
}
