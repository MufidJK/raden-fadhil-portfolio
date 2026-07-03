"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Metric {
  label: string
  value: string
  history: number[]
  colorClass: string
}

const MAX_HISTORY = 7

function generateRandom(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export default function TelemetryWidget() {
  const [coreTemp, setCoreTemp] = React.useState<Metric>({
    label: "CORE TEMP",
    value: "42°C",
    history: Array.from({ length: MAX_HISTORY }, () => generateRandom(30, 90)),
    colorClass: "bg-emerald-500", // Will be dynamic based on value
  })
  
  const [voltageIn, setVoltageIn] = React.useState<Metric>({
    label: "VOLTAGE IN",
    value: "5.02V",
    history: Array.from({ length: MAX_HISTORY }, () => generateRandom(78, 85)),
    colorClass: "bg-blue-500",
  })
  
  const [cpuLoad, setCpuLoad] = React.useState<Metric>({
    label: "CPU LOAD",
    value: "28%",
    history: Array.from({ length: MAX_HISTORY }, () => generateRandom(15, 40)),
    colorClass: "bg-purple-500",
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCoreTemp(prev => {
        const newVal = generateRandom(30, 90)
        let color = "bg-emerald-500"
        if (newVal > 75) color = "bg-red-500"
        else if (newVal > 60) color = "bg-yellow-500"
        
        return {
          ...prev,
          value: `${newVal}°C`,
          history: [...prev.history.slice(1), newVal],
          colorClass: color,
        }
      })
      
      setVoltageIn(prev => {
        const newVal = generateRandom(490, 510) / 100 // 4.90 to 5.10
        const percentage = Math.floor((newVal / 6.0) * 100) // fake percentage for height
        return {
          ...prev,
          value: `${newVal.toFixed(2)}V`,
          history: [...prev.history.slice(1), percentage],
        }
      })
      
      setCpuLoad(prev => {
        const newVal = generateRandom(15, 40)
        return {
          ...prev,
          value: `${newVal}%`,
          history: [...prev.history.slice(1), newVal],
        }
      })
    }, 1000) // using 1000ms instead of 100ms for visual stability in browser, though label says 100ms

    return () => clearInterval(interval)
  }, [])

  const renderBars = (metric: Metric) => (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="flex items-end justify-center gap-1 h-24 w-full border border-surface-variant p-2 rounded-md bg-surface">
        {metric.history.map((val, idx) => (
          <div
            key={idx}
            className={`w-4 rounded-t-sm transition-all duration-300 ${metric.colorClass}`}
            style={{ height: `${Math.max(10, val)}%` }}
          />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="font-jetbrains text-label-sm text-muted-foreground">{metric.label}</span>
        <span className="font-sans font-bold text-foreground text-lg">{metric.value}</span>
      </div>
    </div>
  )

  return (
    <Card className="flex flex-col bg-surface-container-low w-full overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-surface-variant">
        <h3 className="font-jetbrains text-label-sm font-medium tracking-widest uppercase text-muted-foreground">
          Hardware Telemetry
        </h3>
        <Badge variant="secondary" className="font-jetbrains text-[10px] tracking-wider rounded-sm bg-surface-variant text-foreground border border-outline-variant hover:bg-surface-variant">
          LIVE
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-8 flex-1">
        {renderBars(coreTemp)}
        {renderBars(voltageIn)}
        {renderBars(cpuLoad)}
      </div>

      <div className="grid grid-cols-3 divide-x divide-surface-variant p-4 border-t border-surface-variant text-center font-jetbrains text-xs text-muted-foreground">
        <div>Polling Rate: 100ms</div>
        <div>Status: Nominal</div>
        <div>Uptime: 4d 12h</div>
      </div>
    </Card>
  )
}
