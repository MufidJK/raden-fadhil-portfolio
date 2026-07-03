import { render, screen } from "@testing-library/react"
import { SiteFooter } from "./site-footer"

describe("SiteFooter", () => {
  it("renders the copyright text", () => {
    render(<SiteFooter />)
    expect(screen.getByText(/© 2024 Raden Fadhil Triansyah. Built with Precision./i)).toBeInTheDocument()
  })

  it("renders the external links", () => {
    render(<SiteFooter />)
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /source/i })).toBeInTheDocument()
  })
})
