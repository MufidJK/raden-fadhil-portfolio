"use client"

import * as React from "react"

const tabs = ["All", "Reptile IoT", "Automation", "Robotics"]

export function FilterTabs() {
  const [activeTab, setActiveTab] = React.useState("All")

  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-3 py-1 text-sm font-medium font-jetbrains rounded-md transition-colors ${
            activeTab === tab
              ? "bg-primary text-primary-foreground"
              : "bg-surface-variant/30 text-muted-foreground hover:text-foreground hover:bg-surface-variant/60"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
