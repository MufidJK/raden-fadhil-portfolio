import { render, screen } from "@testing-library/react"
import { ProjectsGrid } from "./projects-grid"

jest.mock("./filter-tabs", () => ({
  FilterTabs: () => <div data-testid="mock-filter-tabs">Tabs</div>
}))

jest.mock("./project-card", () => ({
  ProjectCard: ({ title }: { title: string }) => <div data-testid="mock-project-card">{title}</div>
}))

describe("ProjectsGrid", () => {
  it("renders the section title", () => {
    render(<ProjectsGrid />)
    expect(screen.getByText("Architecture & Builds")).toBeInTheDocument()
  })

  it("renders the filter tabs", () => {
    render(<ProjectsGrid />)
    expect(screen.getByTestId("mock-filter-tabs")).toBeInTheDocument()
  })

  it("renders all four project cards", () => {
    render(<ProjectsGrid />)
    expect(screen.getByText("Terrarium Climate Controller v2")).toBeInTheDocument()
    expect(screen.getByText("Hexapod Gait Engine")).toBeInTheDocument()
    expect(screen.getByText("Smart Power Rack")).toBeInTheDocument()
    expect(screen.getByText("Homelab Dashboard UI")).toBeInTheDocument()
  })
})
