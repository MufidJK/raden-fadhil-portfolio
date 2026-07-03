import { render, screen } from "@testing-library/react"
import { ProjectCard } from "./project-card"

describe("ProjectCard", () => {
  const defaultProps = {
    id: "TEST_ID_01",
    title: "Test Project",
    description: "This is a test description.",
    tags: ["React", "Jest"],
    category: "Robotics",
    link: "/projects/test-project",
    size: "wide" as const
  }

  it("renders the project title and description", () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText("Test Project")).toBeInTheDocument()
    expect(screen.getByText("This is a test description.")).toBeInTheDocument()
  })

  it("renders the project id", () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText("TEST_ID_01")).toBeInTheDocument()
  })

  it("renders all tags", () => {
    render(<ProjectCard {...defaultProps} />)
    expect(screen.getByText("React")).toBeInTheDocument()
    expect(screen.getByText("Jest")).toBeInTheDocument()
  })

  it("applies the correct column span class for wide size", () => {
    const { container } = render(<ProjectCard {...defaultProps} />)
    expect(container.firstChild).toHaveClass("md:col-span-8")
  })

  it("applies the correct column span class for medium size", () => {
    const { container } = render(<ProjectCard {...defaultProps} size="medium" />)
    expect(container.firstChild).toHaveClass("md:col-span-4")
  })
})
