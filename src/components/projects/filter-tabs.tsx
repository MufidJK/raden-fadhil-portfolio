"use client"

import * as React from "react"

interface FilterTabsProps {
  tabs: string[]
  activeTab: string
  onTabChange: (tab: string) => void
}

export function FilterTabs({ tabs, activeTab, onTabChange }: FilterTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tabs.map(tab => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
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
