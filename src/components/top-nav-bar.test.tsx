import { render, screen } from "@testing-library/react"
import { TopNavBar } from "./top-nav-bar"

jest.mock("./theme-toggle-button", () => ({
  ThemeToggleButton: () => <button data-testid="mock-theme-toggle">Theme Toggle</button>
}))

describe("TopNavBar", () => {
  it("renders the brand name", () => {
    render(<TopNavBar />)
    expect(screen.getByText(/Raden Fadhil/i)).toBeInTheDocument()
  })

  it("renders navigation links", () => {
    render(<TopNavBar />)
    expect(screen.getByRole("link", { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /skills/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /contact/i })).toBeInTheDocument()
  })

  it("renders theme toggle button", () => {
    render(<TopNavBar />)
    expect(screen.getByTestId("mock-theme-toggle")).toBeInTheDocument()
  })
})
