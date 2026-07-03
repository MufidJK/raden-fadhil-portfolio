import React from "react"
import { render, screen } from "@testing-library/react"
import { TechStack } from "./tech-stack"

describe("TechStack Component", () => {
  it("renders correctly without crashing", () => {
    render(<TechStack />)
    expect(screen.getByText("Core Technologies")).toBeInTheDocument()
  })

  it("renders the technology names", () => {
    render(<TechStack />)
    expect(screen.getAllByText("ESP32")[0]).toBeInTheDocument()
    expect(screen.getAllByText("React")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Next.js")[0]).toBeInTheDocument()
  })

  it("has overflow-hidden explicitly applied to prevent mobile scrolling", () => {
    const { container } = render(<TechStack />)
    const section = container.querySelector("section")
    expect(section).toHaveClass("overflow-hidden")
  })
})
