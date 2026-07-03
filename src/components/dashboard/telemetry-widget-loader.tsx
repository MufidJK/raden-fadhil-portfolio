"use client"

import dynamic from "next/dynamic"

/**
 * Client-side wrapper that lazily loads TelemetryWidget with SSR disabled.
 * Must live in a "use client" file because next/dynamic with ssr:false
 * is forbidden inside Server Components in Next.js 16+.
 */
const TelemetryWidget = dynamic(
  () => import("@/components/dashboard/telemetry-widget"),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-64 w-full animate-pulse bg-surface-variant rounded-xl border border-surface-variant"
        data-testid="telemetry-loading"
      />
    ),
  }
)

export default TelemetryWidget
