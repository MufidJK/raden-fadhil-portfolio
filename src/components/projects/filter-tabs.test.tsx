import { render, screen, fireEvent } from "@testing-library/react"
import { FilterTabs } from "./filter-tabs"

describe("FilterTabs", () => {
  const defaultTabs = ["All", "Reptile IoT", "Automation", "Robotics"]
  const mockOnTabChange = jest.fn()

  it("renders all tab options", () => {
    render(<FilterTabs tabs={defaultTabs} activeTab="All" onTabChange={mockOnTabChange} />)
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Reptile IoT" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Automation" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Robotics" })).toBeInTheDocument()
  })

  it("calls onTabChange on click and active tab has correct class", () => {
    render(<FilterTabs tabs={defaultTabs} activeTab="Robotics" onTabChange={mockOnTabChange} />)
    const roboticsTab = screen.getByRole("button", { name: "Robotics" })
    fireEvent.click(roboticsTab)
    expect(mockOnTabChange).toHaveBeenCalledWith("Robotics")
    expect(roboticsTab.className).toMatch(/bg-primary/)
  })
})
