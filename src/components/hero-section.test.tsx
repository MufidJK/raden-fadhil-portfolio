import { render, screen } from "@testing-library/react"
import { HeroSection } from "./hero-section"

describe("HeroSection", () => {
  it("renders the developer name and role", () => {
    render(<HeroSection />)
    expect(screen.getByText("Raden Fadhil Triansyah")).toBeInTheDocument()
    expect(screen.getByText("Hardware Engineer & IoT Developer")).toBeInTheDocument()
  })

  it("renders the bio text", () => {
    render(<HeroSection />)
    expect(screen.getByText(/Architecting robust physical-digital bridges/i)).toBeInTheDocument()
  })

  it("renders the anchor link CTAs", () => {
    render(<HeroSection />)
    expect(screen.getByRole("link", { name: /view projects/i })).toHaveAttribute("href", "#projects")
    expect(screen.getByRole("link", { name: /contact me/i })).toHaveAttribute("href", "#contact")
  })

  it("renders the profile image", () => {
    render(<HeroSection />)
    const img = screen.getByRole("img", { name: /raden fadhil triansyah/i })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute("src", "/raden-fadhil-profile.jpg")
  })
})
