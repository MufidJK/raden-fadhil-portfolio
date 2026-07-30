import { render, screen } from "@testing-library/react"
import { ProjectsGrid } from "./projects-grid"

jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      })),
    })),
  },
}))

jest.mock("./filter-tabs", () => ({
  FilterTabs: () => <div data-testid="mock-filter-tabs">Tabs</div>
}))

jest.mock("./project-card", () => ({
  ProjectCard: ({ title }: { title: string }) => <div data-testid="mock-project-card">{title}</div>
}))

describe("ProjectsGrid", () => {
  it("renders the section title with fallback data", async () => {
    const Component = await ProjectsGrid()
    render(Component)
    expect(screen.getByText("Architecture & Builds")).toBeInTheDocument()
  })

  it("renders the filter tabs", async () => {
    const Component = await ProjectsGrid()
    render(Component)
    expect(screen.getByTestId("mock-filter-tabs")).toBeInTheDocument()
  })

  it("renders all fallback project cards when fetch returns empty", async () => {
    const Component = await ProjectsGrid()
    render(Component)
    expect(screen.getByText("Terrarium Climate Controller v2")).toBeInTheDocument()
    expect(screen.getByText("Hexapod Gait Engine")).toBeInTheDocument()
    expect(screen.getByText("Smart Power Rack")).toBeInTheDocument()
    expect(screen.getByText("Homelab Dashboard UI")).toBeInTheDocument()
  })
})
