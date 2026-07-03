import { render, screen, fireEvent } from "@testing-library/react"
import { FilterTabs } from "./filter-tabs"

describe("FilterTabs", () => {
  it("renders all tab options", () => {
    render(<FilterTabs />)
    expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Reptile IoT" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Automation" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Robotics" })).toBeInTheDocument()
  })

  it("changes active tab on click", () => {
    render(<FilterTabs />)
    const roboticsTab = screen.getByRole("button", { name: "Robotics" })
    fireEvent.click(roboticsTab)
    // Verify it got the active class styling (bg-primary)
    expect(roboticsTab.className).toMatch(/bg-primary/)
  })
})
